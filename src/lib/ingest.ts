import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { evaluate, type EventRow, type Ioc } from "./detect";

export const eventSchema = z.object({
  event_type: z.string().trim().min(1).max(60),
  hostname: z.string().trim().max(255).optional().nullable(),
  username: z.string().trim().max(255).optional().nullable(),
  src_ip: z.string().trim().max(64).optional().nullable(),
  process: z.string().trim().max(500).optional().nullable(),
  command_line: z.string().trim().max(4000).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  source: z.string().trim().max(60).optional(),
  occurred_at: z.string().datetime({ offset: true }).optional().or(z.string().refine((s) => !Number.isNaN(Date.parse(s)), "bad date").optional()),
  raw: z.record(z.string(), z.unknown()).optional(),
});
export type IncomingEvent = z.infer<typeof eventSchema>;

export const MAX_BATCH = 1000;

/**
 * Persists events for `userId`, then evaluates detection rules over the last 30 minutes of
 * that user's events and stores any new detections. `sb` must be either the user's own client
 * (RLS) or a service-role client; user_id is always set explicitly.
 */
export async function ingestEvents(sb: SupabaseClient, userId: string, incoming: IncomingEvent[], source = "manual") {
  const rows = incoming.map((e) => ({
    user_id: userId,
    source: e.source ?? source,
    event_type: e.event_type.toLowerCase().replace(/\s+/g, "_"),
    hostname: e.hostname || null,
    username: e.username || null,
    src_ip: e.src_ip || null,
    process: e.process || null,
    command_line: e.command_line || null,
    message: e.message || null,
    raw: e.raw ?? null,
    occurred_at: e.occurred_at ? new Date(e.occurred_at).toISOString() : new Date().toISOString(),
  }));
  if (!rows.length) return { inserted: 0, newDetections: 0 };

  const { error: insErr } = await sb.from("events").insert(rows);
  if (insErr) throw new Error(`Could not store events: ${insErr.message}`);

  // Keep asset last_seen fresh for known hosts.
  const hosts = [...new Set(rows.map((r) => r.hostname).filter(Boolean))] as string[];
  if (hosts.length) await sb.from("assets").update({ last_seen: new Date().toISOString() }).eq("user_id", userId).in("hostname", hosts);

  const since = new Date(Date.now() - 30 * 60_000).toISOString();
  const [{ data: recent }, { data: iocs }] = await Promise.all([
    sb.from("events").select("id,event_type,hostname,username,src_ip,process,command_line,message,occurred_at").eq("user_id", userId).gte("occurred_at", since).limit(5000),
    sb.from("ioc_watchlist").select("type,value,note").eq("user_id", userId),
  ]);

  const candidates = evaluate((recent ?? []) as EventRow[], (iocs ?? []) as Ioc[]);
  if (!candidates.length) return { inserted: rows.length, newDetections: 0 };

  const { data: created, error: dErr } = await sb
    .from("detections")
    .upsert(
      candidates.map((c) => ({ user_id: userId, ...c })),
      { onConflict: "user_id,dedupe_key", ignoreDuplicates: true },
    )
    .select("id,title,severity,hostname");
  if (dErr) throw new Error(`Could not store detections: ${dErr.message}`);

  const urgent = (created ?? []).filter((d) => d.severity === "high" || d.severity === "critical");
  if (urgent.length)
    await sb.from("notifications").insert(
      urgent.map((d) => ({ user_id: userId, title: `${d.severity.toUpperCase()}: ${d.title}`, body: d.hostname ? `Host: ${d.hostname}` : null })),
    );

  return { inserted: rows.length, newDetections: created?.length ?? 0 };
}

/** Minimal CSV parser (quoted fields, commas, newlines). Header row required. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { cur.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      cur.push(field); field = "";
      if (cur.some((x) => x.trim())) rows.push(cur);
      cur = [];
    } else field += c;
  }
  cur.push(field);
  if (cur.some((x) => x.trim())) rows.push(cur);
  if (rows.length < 2) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}
