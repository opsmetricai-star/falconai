// Live end-to-end check against the configured Supabase project. Creates and deletes a throwaway user.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/).filter(Boolean).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]));
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const mk = () => createClient(URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
let pass = 0, fail = 0;
const ok = (n, c, d = "") => { c ? pass++ : fail++; console.log(`${c ? "PASS" : "FAIL"} ${n}${c ? "" : " :: " + d}`); };

const email = `e2e-${Date.now()}@example.com`, pw = "Test-pass-12345";
const email2 = `e2e2-${Date.now()}@example.com`;
let uid, uid2;
try {
  const c1 = await admin.auth.admin.createUser({ email, password: pw, email_confirm: true, user_metadata: { full_name: "E2E One", company: "T" } });
  ok("create user 1", !c1.error, c1.error?.message); uid = c1.data.user?.id;
  const c2 = await admin.auth.admin.createUser({ email: email2, password: pw, email_confirm: true });
  uid2 = c2.data.user?.id;

  const { data: prof, error: pe } = await admin.from("profiles").select("*").eq("id", uid).single();
  ok("profile trigger created row", !!prof && prof.plan === "trial" && prof.full_name === "E2E One", pe?.message);

  const u1 = mk(); const s = await u1.auth.signInWithPassword({ email, password: pw });
  ok("sign in", !s.error, s.error?.message);
  const u2 = mk(); await u2.auth.signInWithPassword({ email: email2, password: pw });

  // plan escalation must be blocked
  const esc = await u1.from("profiles").update({ plan: "pro" }).eq("id", uid);
  const { data: after } = await admin.from("profiles").select("plan").eq("id", uid).single();
  ok("user cannot self-upgrade plan", after.plan === "trial", JSON.stringify(esc.error));

  // assets + RLS isolation
  const a = await u1.from("assets").insert({ user_id: uid, hostname: "srv1" }).select().single();
  ok("insert own asset", !a.error, a.error?.message);
  const cross = await u2.from("assets").select("*");
  ok("RLS hides other user's assets", (cross.data ?? []).length === 0);
  const spoof = await u2.from("assets").insert({ user_id: uid, hostname: "evil" });
  ok("RLS blocks inserting as another user", !!spoof.error);

  // ingest path (copy of engine via admin client through compiled route is covered below)
  const now = Date.now();
  const evs = [...Array(6)].map((_, i) => ({ user_id: uid, event_type: "login_failed", username: "admin", src_ip: "203.0.113.9", hostname: "srv1", occurred_at: new Date(now - (6 - i) * 20000).toISOString() }));
  const ins = await u1.from("events").insert(evs);
  ok("insert events", !ins.error, ins.error?.message);

  // credits
  const c = await u1.rpc("consume_ai_credit");
  ok("consume credit (trial 10 -> 9)", c.data === 9, JSON.stringify(c));
  await u1.rpc("refund_ai_credit");
  const { data: p2 } = await admin.from("profiles").select("ai_credits_used").eq("id", uid).single();
  ok("refund credit", p2.ai_credits_used === 0);
  for (let i = 0; i < 10; i++) await u1.rpc("consume_ai_credit");
  const over = await u1.rpc("consume_ai_credit");
  ok("credit limit enforced", over.data === -1, JSON.stringify(over));
  const anonCall = await mk().rpc("consume_ai_credit");
  ok("anon cannot consume credits", !!anonCall.error || anonCall.data === -1);

  // contact form open to anon
  const ct = await mk().from("contact_messages").insert({ name: "x", email: "x@example.com", message: "hello e2e" });
  ok("anon contact insert", !ct.error, ct.error?.message);
  const ctr = await mk().from("contact_messages").select("*");
  ok("anon cannot read contact messages", (ctr.data ?? []).length === 0);

  // ----- HTTP API (needs dev server on :3000) -----
  const base = "http://localhost:3000";
  const bad = await fetch(`${base}/api/ingest`, { method: "POST", headers: { authorization: "Bearer fai_nope", "content-type": "application/json" }, body: JSON.stringify({ events: [{ event_type: "x" }] }) });
  ok("ingest rejects bad key (401)", bad.status === 401, bad.status);
  // make user Pro and create a key through the same hash scheme
  await admin.from("profiles").update({ plan: "pro", ai_credits_used: 0 }).eq("id", uid);
  const { createHash, randomBytes } = await import("node:crypto");
  const key = "fai_" + randomBytes(24).toString("hex");
  await admin.from("api_keys").insert({ user_id: uid, name: "e2e", prefix: key.slice(0, 10), key_hash: createHash("sha256").update(key).digest("hex") });
  const good = await fetch(`${base}/api/ingest`, { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify({ events: [
    { event_type: "process_start", hostname: "srv1", process: "powershell.exe", command_line: "powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAKQA=" },
    { event_type: "process_start", hostname: "srv1", command_line: "vssadmin delete shadows /all" } ] }) });
  const gj = await good.json();
  ok("API ingest accepted + detections created", good.status === 200 && gj.newDetections >= 2, JSON.stringify(gj));
  const { data: dets } = await u1.from("detections").select("rule_id,severity,status");
  ok("detections visible to owner via RLS", (dets ?? []).some((d) => d.rule_id === "FAI-003") && dets.some((d) => d.rule_id === "FAI-005"), JSON.stringify(dets));
  const { data: notes } = await u1.from("notifications").select("title");
  ok("notifications created for high/critical", (notes ?? []).length >= 1);
  const empty = await fetch(`${base}/api/ingest`, { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify({ events: [] }) });
  ok("ingest validates empty batch (400)", empty.status === 400);

  // webhook
  const w0 = await fetch(`${base}/api/webhooks/selar`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  ok("webhook without secret rejected", [401, 503].includes(w0.status), w0.status);

  // contact API
  const cr = await fetch(`${base}/api/contact`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "E2E", email: "e2e@example.com", message: "Testing the contact API" }) });
  ok("contact API ok", cr.status === 200, cr.status);
  const cb = await fetch(`${base}/api/contact`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "", email: "bad" }) });
  ok("contact API validates (400)", cb.status === 400);

  // AI analyze requires a session cookie: unauthenticated must be 401
  const ai = await fetch(`${base}/api/ai/analyze`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ detection_id: dets?.[0] ? "00000000-0000-0000-0000-000000000000" : "x" }) });
  ok("AI route requires auth (401)", ai.status === 401, ai.status);

  // gemini direct
  const g = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply with JSON {"ok":true}' }] }], generationConfig: { responseMimeType: "application/json" } }) });
  const gtxt = await g.text();
  ok("Gemini generateContent works", g.status === 200, g.status + " " + gtxt.slice(0, 200));
} catch (e) {
  fail++; console.log("EXCEPTION", e);
} finally {
  if (uid) await admin.auth.admin.deleteUser(uid);
  if (uid2) await admin.auth.admin.deleteUser(uid2);
  await admin.from("contact_messages").delete().in("email", ["x@example.com", "e2e@example.com"]);
  console.log(`\n${pass} passed, ${fail} failed`);
}
