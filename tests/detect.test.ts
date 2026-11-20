import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, type EventRow } from "../src/lib/detect.ts";

const base = Date.parse("2026-01-01T10:00:00Z");
const ev = (i: number, o: Partial<EventRow>): EventRow => ({ id: "e" + i, event_type: "log", occurred_at: new Date(base + i * 30_000).toISOString(), ...o });

test("brute force then success", () => {
  const evs = [...Array(6)].map((_, i) => ev(i, { event_type: "login_failed", username: "admin", src_ip: "1.2.3.4" }));
  evs.push(ev(7, { event_type: "login_success", username: "admin", src_ip: "1.2.3.4" }));
  assert.deepEqual(evaluate(evs).map((d) => d.rule_id).sort(), ["FAI-001", "FAI-002"]);
});
test("below threshold no alert", () => {
  assert.equal(evaluate([...Array(4)].map((_, i) => ev(i, { event_type: "login_failed", username: "a" }))).length, 0);
});
test("encoded powershell, shadow copy, mimikatz", () => {
  const out = evaluate([
    ev(1, { process: "powershell.exe", command_line: "powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAKQA=", hostname: "h1" }),
    ev(2, { command_line: "vssadmin delete shadows /all /quiet", hostname: "h1" }),
    ev(3, { command_line: "mimikatz.exe sekurlsa::logonpasswords", hostname: "h1" }),
  ]).map((d) => d.rule_id).sort();
  assert.deepEqual(out, ["FAI-003", "FAI-004", "FAI-005"]);
});
test("benign powershell not flagged", () => {
  assert.equal(evaluate([ev(1, { process: "powershell.exe", command_line: "powershell.exe Get-Process" })]).length, 0);
});
test("IOC match and mass file modification", () => {
  const out = evaluate([ev(1, { src_ip: "198.51.100.7", hostname: "h" })], [{ type: "ip", value: "198.51.100.7" }]);
  assert.equal(out[0].rule_id, "FAI-006");
  const mass = [...Array(60)].map((_, i) => ({ ...ev(i, { event_type: "file_modified", hostname: "h" }), occurred_at: new Date(base + i * 500).toISOString() }));
  assert.equal(evaluate(mass)[0].rule_id, "FAI-008");
});
test("dedupe within the same hour", () => {
  const e = [ev(1, { command_line: "vssadmin delete shadows", hostname: "h" }), ev(2, { command_line: "vssadmin delete shadows", hostname: "h" })];
  assert.equal(evaluate(e).length, 1);
});
