import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdmin } from "@/lib/supabase/server";
import { eventSchema, ingestEvents, MAX_BATCH } from "@/lib/ingest";
import { hashKey } from "@/lib/keys";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token?.startsWith("fai_")) return NextResponse.json({ error: "Missing or invalid API key." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = z.object({ events: z.array(eventSchema).min(1).max(MAX_BATCH) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: `Body must be {"events":[...]} with 1-${MAX_BATCH} valid events.`, details: parsed.error.issues.slice(0, 5) }, { status: 400 });

  const admin = createAdmin();
  const { data: key } = await admin.from("api_keys").select("id,user_id,revoked").eq("key_hash", hashKey(token)).maybeSingle();
  if (!key || key.revoked) return NextResponse.json({ error: "Invalid or revoked API key." }, { status: 401 });

  const { data: prof } = await admin.from("profiles").select("plan,trial_ends_at").eq("id", key.user_id).single();
  if (!prof || (prof.plan === "trial" && new Date(prof.trial_ends_at) < new Date())) return NextResponse.json({ error: "Plan inactive." }, { status: 402 });

  try {
    const r = await ingestEvents(admin, key.user_id, parsed.data.events, "api");
    await admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", key.id);
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ingest failed." }, { status: 500 });
  }
}
