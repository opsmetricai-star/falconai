"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { createAdmin } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/site";
import { eventSchema, ingestEvents, parseCsv, MAX_BATCH } from "@/lib/ingest";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function addAsset(f: FormData) {
  const { sb, user, profile } = await requireUser();
  const hostname = z.string().min(1).max(255).parse(s(f, "hostname"));
  const { count } = await sb.from("assets").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= PLAN_LIMITS[profile.plan].assets) throw new Error("Asset limit reached for your plan. Upgrade on the Billing page.");
  const crit = z.enum(["low", "medium", "high", "critical"]).parse(s(f, "criticality") || "medium");
  const { error } = await sb.from("assets").insert({ user_id: user.id, hostname, os: s(f, "os") || null, ip: s(f, "ip") || null, owner: s(f, "owner") || null, criticality: crit });
  if (error) throw new Error(error.code === "23505" ? "That hostname already exists." : error.message);
  revalidatePath("/dashboard/assets");
}

export async function setAssetStatus(f: FormData) {
  const { sb } = await requireUser();
  const status = z.enum(["active", "isolated", "retired"]).parse(s(f, "status"));
  await sb.from("assets").update({ status }).eq("id", s(f, "id"));
  revalidatePath("/dashboard/assets");
}

export async function deleteAsset(f: FormData) {
  const { sb } = await requireUser();
  await sb.from("assets").delete().eq("id", s(f, "id"));
  revalidatePath("/dashboard/assets");
}

export async function addEvent(f: FormData) {
  const { sb, user } = await requireUser();
  const ev = eventSchema.parse({
    event_type: s(f, "event_type"), hostname: s(f, "hostname") || null, username: s(f, "username") || null,
    src_ip: s(f, "src_ip") || null, process: s(f, "process") || null, command_line: s(f, "command_line") || null, message: s(f, "message") || null,
  });
  await ingestEvents(sb, user.id, [ev], "manual");
  revalidatePath("/dashboard", "layout");
}

export async function uploadCsv(f: FormData) {
  const { sb, user } = await requireUser();
  const file = f.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Choose a CSV file.");
  if (file.size > 2_000_000) throw new Error("File too large (2 MB max).");
  const rows = parseCsv(await file.text()).slice(0, MAX_BATCH);
  const events = rows.map((r) => {
    const p = eventSchema.safeParse({
      event_type: r.event_type || r.type || "log", hostname: r.hostname || r.host || null, username: r.username || r.user || null,
      src_ip: r.src_ip || r.ip || null, process: r.process || null, command_line: r.command_line || r.command || null,
      message: r.message || null, occurred_at: r.occurred_at || r.timestamp || undefined,
    });
    return p.success ? p.data : null;
  }).filter((x): x is NonNullable<typeof x> => !!x);
  if (!events.length) throw new Error("No valid rows. Required header: event_type (optional: hostname, username, src_ip, process, command_line, message, occurred_at).");
  await ingestEvents(sb, user.id, events, "csv");
  revalidatePath("/dashboard", "layout");
}

export async function setDetectionStatus(f: FormData) {
  const { sb } = await requireUser();
  const status = z.enum(["open", "investigating", "resolved", "false_positive"]).parse(s(f, "status"));
  await sb.from("detections").update({ status }).eq("id", s(f, "id"));
  revalidatePath("/dashboard", "layout");
}

export async function escalateDetection(f: FormData) {
  const { sb, user } = await requireUser();
  const { data: d } = await sb.from("detections").select("*").eq("id", s(f, "id")).single();
  if (!d) throw new Error("Detection not found.");
  if (d.incident_id) return;
  const { data: inc, error } = await sb.from("incidents").insert({ user_id: user.id, title: d.title + (d.hostname ? ` on ${d.hostname}` : ""), severity: d.severity, description: d.summary }).select("id").single();
  if (error || !inc) throw new Error("Could not open incident.");
  await sb.from("detections").update({ incident_id: inc.id, status: "investigating" }).eq("id", d.id);
  revalidatePath("/dashboard", "layout");
}

export async function setIncidentStatus(f: FormData) {
  const { sb } = await requireUser();
  const status = z.enum(["open", "investigating", "contained", "closed"]).parse(s(f, "status"));
  await sb.from("incidents").update({ status, updated_at: new Date().toISOString() }).eq("id", s(f, "id"));
  revalidatePath("/dashboard/incidents");
}

export async function addIoc(f: FormData) {
  const { sb, user } = await requireUser();
  const type = z.enum(["ip", "domain", "hash", "process"]).parse(s(f, "type"));
  const value = z.string().min(2).max(300).parse(s(f, "value"));
  const { error } = await sb.from("ioc_watchlist").insert({ user_id: user.id, type, value, note: s(f, "note") || null });
  if (error && error.code !== "23505") throw new Error(error.message);
  revalidatePath("/dashboard/threat-intel");
}

export async function deleteIoc(f: FormData) {
  const { sb } = await requireUser();
  await sb.from("ioc_watchlist").delete().eq("id", s(f, "id"));
  revalidatePath("/dashboard/threat-intel");
}

export async function generateReport(f: FormData) {
  const { sb, user } = await requireUser();
  const days = z.coerce.number().int().min(1).max(90).parse(s(f, "days") || 7);
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const [det, inc, ast, evc] = await Promise.all([
    sb.from("detections").select("rule_id,title,severity,technique,status,hostname,created_at").gte("created_at", since).order("created_at", { ascending: false }),
    sb.from("incidents").select("title,severity,status").gte("created_at", since),
    sb.from("assets").select("id", { count: "exact", head: true }),
    sb.from("events").select("id", { count: "exact", head: true }).gte("occurred_at", since),
  ]);
  const d = det.data ?? [];
  const by = (k: "severity" | "status" | "technique") => Object.entries(d.reduce<Record<string, number>>((a, x) => ((a[x[k] ?? "n/a"] = (a[x[k] ?? "n/a"] ?? 0) + 1), a), {})).map(([a, b]) => `- ${a}: ${b}`).join("\n") || "- none";
  const content = `# Security summary: last ${days} days\n\nGenerated ${new Date().toISOString()}\n\n## Overview\n- Assets tracked: ${ast.count ?? 0}\n- Events ingested: ${evc.count ?? 0}\n- Detections: ${d.length}\n- Incidents opened: ${inc.data?.length ?? 0}\n\n## Detections by severity\n${by("severity")}\n\n## Detections by status\n${by("status")}\n\n## ATT&CK techniques observed\n${by("technique")}\n\n## Detection list\n${d.slice(0, 50).map((x) => `- [${x.severity}] ${x.title}${x.hostname ? ` (${x.hostname})` : ""} - ${x.status}`).join("\n") || "- none"}\n`;
  await sb.from("reports").insert({ user_id: user.id, title: `Security summary (${days}d)`, kind: "summary", content });
  revalidatePath("/dashboard/reports");
}

export async function deleteReport(f: FormData) {
  const { sb } = await requireUser();
  await sb.from("reports").delete().eq("id", s(f, "id"));
  revalidatePath("/dashboard/reports");
}

export async function revokeKey(f: FormData) {
  const { sb } = await requireUser();
  await sb.from("api_keys").update({ revoked: true }).eq("id", s(f, "id"));
  revalidatePath("/dashboard/api-keys");
}

export async function markNotificationsRead() {
  const { sb } = await requireUser();
  await sb.from("notifications").update({ read: true }).eq("read", false);
  revalidatePath("/dashboard", "layout");
}

export async function updateProfile(f: FormData) {
  const { sb, user } = await requireUser();
  await sb.from("profiles").update({ full_name: s(f, "full_name").slice(0, 120), company: s(f, "company").slice(0, 160) }).eq("id", user.id);
  revalidatePath("/dashboard/settings");
}

/** Admin-only manual plan activation (for verified payments handled outside the webhook). */
export async function adminActivatePlan(f: FormData) {
  const { profile } = await requireUser();
  if (!profile.is_admin) throw new Error("Forbidden");
  const email = z.string().email().parse(s(f, "email"));
  const plan = z.enum(["go", "pro", "enterprise"]).parse(s(f, "plan"));
  const admin = createAdmin();
  const { error } = await admin.from("profiles").update({ plan, plan_activated_at: new Date().toISOString(), ai_credits_used: 0, credits_period_start: new Date().toISOString() }).eq("email", email);
  if (error) throw new Error(error.message);
  await admin.from("payments").insert({ email, plan, provider: "manual", status: "confirmed" });
  revalidatePath("/dashboard/billing");
}
