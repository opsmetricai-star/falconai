import { NextResponse } from "next/server";
import { createAdmin } from "@/lib/supabase/server";
import { safeEqual } from "@/lib/keys";

export const runtime = "nodejs";

// ASSUMPTION: Selar's real webhook payload and signing scheme are not verified here. This endpoint
// requires a shared secret (header `x-webhook-secret` or `?secret=`) and reads common field names.
// Confirm against Selar's docs before relying on it. Anything it cannot match is stored as
// "unmatched" for an admin to review; plans are never activated from a client redirect.
const AMOUNT_TO_PLAN: Record<number, "go" | "pro"> = { 57: "go", 97: "pro" };

const pick = (o: unknown, ...paths: string[]) => {
  for (const p of paths) {
    const v = p.split(".").reduce<unknown>((a, k) => (a && typeof a === "object" ? (a as Record<string, unknown>)[k] : undefined), o);
    if (v !== undefined && v !== null && v !== "") return v;
  }
};

export async function POST(req: Request) {
  const secret = process.env.SELAR_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const given = req.headers.get("x-webhook-secret") ?? new URL(req.url).searchParams.get("secret") ?? "";
  if (!safeEqual(given, secret)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  if (!raw) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const email = String(pick(raw, "customer_email", "email", "buyer.email", "customer.email", "data.customer_email") ?? "").toLowerCase();
  const amount = Number(pick(raw, "amount", "price", "data.amount", "total") ?? NaN);
  const ref = String(pick(raw, "reference", "order_id", "id", "transaction_id", "data.reference") ?? "");
  const status = String(pick(raw, "status", "data.status") ?? "").toLowerCase();
  const success = ["success", "successful", "paid", "completed", "confirmed"].includes(status);
  const plan = AMOUNT_TO_PLAN[Math.round(amount)];

  const admin = createAdmin();
  const { data: prof } = email ? await admin.from("profiles").select("id").eq("email", email).maybeSingle() : { data: null };

  if (ref) {
    const { data: existing } = await admin.from("payments").select("id").eq("provider_ref", ref).maybeSingle();
    if (existing) return NextResponse.json({ ok: true, duplicate: true });
  }

  const matched = success && plan && prof;
  await admin.from("payments").insert({
    user_id: prof?.id ?? null, email: email || null, plan: plan ?? null, amount: Number.isFinite(amount) ? amount : null, currency: "USD",
    provider: "selar", provider_ref: ref || null, status: matched ? "confirmed" : "unmatched", raw,
  });
  if (matched) {
    const now = new Date().toISOString();
    await admin.from("profiles").update({ plan, plan_activated_at: now, ai_credits_used: 0, credits_period_start: now }).eq("id", prof.id);
    await admin.from("notifications").insert({ user_id: prof.id, title: `Your ${plan.toUpperCase()} plan is active`, body: "Thanks for your payment." });
  }
  return NextResponse.json({ ok: true, activated: Boolean(matched) });
}
