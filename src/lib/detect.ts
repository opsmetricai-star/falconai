// Deterministic detection engine. Pure functions: no I/O, fully testable.

export type Sev = "low" | "medium" | "high" | "critical";

export type EventRow = {
  id: string;
  event_type: string;
  hostname?: string | null;
  username?: string | null;
  src_ip?: string | null;
  process?: string | null;
  command_line?: string | null;
  message?: string | null;
  occurred_at: string;
};

export type Ioc = { type: "ip" | "domain" | "hash" | "process"; value: string; note?: string | null };

export type DetectionCandidate = {
  rule_id: string;
  title: string;
  severity: Sev;
  technique: string;
  summary: string;
  hostname: string | null;
  event_ids: string[];
  dedupe_key: string;
};

export const RULES: { id: string; title: string; severity: Sev; technique: string }[] = [
  { id: "FAI-001", title: "Brute-force login attempts", severity: "high", technique: "T1110 Brute Force" },
  { id: "FAI-002", title: "Successful login after repeated failures", severity: "critical", technique: "T1078 Valid Accounts" },
  { id: "FAI-003", title: "Encoded PowerShell command", severity: "high", technique: "T1059.001 PowerShell" },
  { id: "FAI-004", title: "Credential dumping tool or LSASS access", severity: "critical", technique: "T1003 OS Credential Dumping" },
  { id: "FAI-005", title: "Backup or shadow copy destruction", severity: "critical", technique: "T1490 Inhibit System Recovery" },
  { id: "FAI-006", title: "Threat indicator match", severity: "high", technique: "T1071 Application Layer Protocol" },
  { id: "FAI-007", title: "Persistence via scheduled task or Run key", severity: "medium", technique: "T1053 / T1547 Persistence" },
  { id: "FAI-008", title: "Mass file modification (possible ransomware)", severity: "critical", technique: "T1486 Data Encrypted for Impact" },
  { id: "FAI-009", title: "Living-off-the-land download", severity: "medium", technique: "T1105 Ingress Tool Transfer" },
];
const R = Object.fromEntries(RULES.map((r) => [r.id, r]));

const t = (e: EventRow) => new Date(e.occurred_at).getTime();
const hourBucket = (ms: number) => Math.floor(ms / 3_600_000);
const low = (s?: string | null) => (s ?? "").toLowerCase();

function make(ruleId: string, evs: EventRow[], summary: string, keyPart: string): DetectionCandidate {
  const r = R[ruleId];
  const last = Math.max(...evs.map(t));
  return {
    rule_id: r.id,
    title: r.title,
    severity: r.severity,
    technique: r.technique,
    summary,
    hostname: evs.find((e) => e.hostname)?.hostname ?? null,
    event_ids: evs.map((e) => e.id),
    dedupe_key: `${r.id}:${keyPart}:${hourBucket(last)}`,
  };
}

function groupBy<T>(items: T[], key: (x: T) => string | null | undefined) {
  const m = new Map<string, T[]>();
  for (const i of items) {
    const k = key(i);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(i);
  }
  return m;
}

/** Sliding window: returns the largest cluster within `windowMs`, or null if below `min`. */
function densest(evs: EventRow[], windowMs: number, min: number): EventRow[] | null {
  const s = [...evs].sort((a, b) => t(a) - t(b));
  let best: EventRow[] = [];
  let lo = 0;
  for (let hi = 0; hi < s.length; hi++) {
    while (t(s[hi]) - t(s[lo]) > windowMs) lo++;
    if (hi - lo + 1 > best.length) best = s.slice(lo, hi + 1);
  }
  return best.length >= min ? best : null;
}

export function evaluate(events: EventRow[], iocs: Ioc[] = []): DetectionCandidate[] {
  const out: DetectionCandidate[] = [];

  // FAI-001 / FAI-002: authentication patterns
  const fails = events.filter((e) => e.event_type === "login_failed");
  for (const [who, list] of groupBy(fails, (e) => e.username || e.src_ip)) {
    const c = densest(list, 10 * 60_000, 5);
    if (!c) continue;
    out.push(make("FAI-001", c, `${c.length} failed logins for "${who}" within 10 minutes.`, who));
    const lastFail = Math.max(...c.map(t));
    const win = events.filter(
      (e) => e.event_type === "login_success" && (e.username === c[0].username || e.src_ip === c[0].src_ip) && t(e) >= lastFail && t(e) - lastFail <= 15 * 60_000,
    );
    if (win.length) out.push(make("FAI-002", [...c, win[0]], `Login succeeded for "${who}" shortly after ${c.length} failures. Possible credential compromise.`, who));
  }

  // Command-line based rules
  for (const e of events) {
    const cmd = low(e.command_line);
    const proc = low(e.process);
    const host = e.hostname ?? "unknown";
    if (!cmd && !proc) continue;

    if (/powershell|pwsh/.test(proc + " " + cmd) && /\s-(e|en|enc|enco|encod|encode|encoded|encodedcommand)\s+[a-z0-9+/=]{20,}/i.test(e.command_line ?? ""))
      out.push(make("FAI-003", [e], `Encoded PowerShell executed on ${host}${e.username ? ` by ${e.username}` : ""}.`, `${host}:${e.id}`));

    if (/mimikatz|sekurlsa|lsadump|procdump.*lsass|comsvcs\.dll.*minidump|ntdsutil.*ifm/.test(cmd + " " + proc))
      out.push(make("FAI-004", [e], `Credential theft technique observed on ${host}.`, host));

    if (/vssadmin\s+delete\s+shadows|wbadmin\s+delete|bcdedit.*recoveryenabled\s+no|wmic\s+shadowcopy\s+delete/.test(cmd))
      out.push(make("FAI-005", [e], `Recovery inhibition command on ${host}: a common ransomware precursor.`, host));

    if (/schtasks(\.exe)?\s+\/create|reg(\.exe)?\s+add\s+.*\\currentversion\\run/.test(cmd))
      out.push(make("FAI-007", [e], `Persistence mechanism created on ${host}.`, `${host}:${e.id}`));

    if (/certutil.*-urlcache|bitsadmin.*\/transfer|mshta\s+http|regsvr32.*\/i:http/.test(cmd))
      out.push(make("FAI-009", [e], `Native binary used to download content on ${host}.`, `${host}:${e.id}`));
  }

  // FAI-008: mass modification
  for (const [host, list] of groupBy(events.filter((e) => e.event_type === "file_modified"), (e) => e.hostname)) {
    const c = densest(list, 60_000, 50);
    if (c) out.push(make("FAI-008", c.slice(0, 200), `${c.length} file modifications within one minute on ${host}.`, host));
  }

  // FAI-006: IOC matching
  if (iocs.length) {
    for (const e of events) {
      const hay = low([e.src_ip, e.command_line, e.message, e.process].join(" "));
      for (const i of iocs) {
        const v = low(i.value);
        const hit = i.type === "process" ? low(e.process) === v : hay.includes(v);
        if (hit) out.push(make("FAI-006", [e], `Event matched watchlist ${i.type} "${i.value}"${i.note ? ` (${i.note})` : ""}.`, `${i.type}:${v}:${e.hostname ?? ""}`));
      }
    }
  }

  // De-duplicate candidates produced in this pass.
  const seen = new Map<string, DetectionCandidate>();
  for (const d of out) if (!seen.has(d.dedupe_key)) seen.set(d.dedupe_key, d);
  return [...seen.values()];
}
