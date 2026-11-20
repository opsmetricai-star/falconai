"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SEV: Record<string, string> = {
  critical: "bg-red text-white", high: "bg-orange-500 text-white", medium: "bg-amber-300 text-ink", low: "bg-slate-200 text-ink",
};
export const Sev = ({ v }: { v: string }) => <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${SEV[v] ?? "bg-slate-200"}`}>{v}</span>;
export const Card = ({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) => (
  <section className="mb-6 rounded-xl border border-line bg-white p-5">
    {(title || right) && <div className="mb-4 flex items-center justify-between"><h2 className="display text-lg font-bold">{title}</h2>{right}</div>}
    {children}
  </section>
);
export const inputCls = "rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-red";
export const Empty = ({ children }: { children: React.ReactNode }) => <p className="rounded-lg bg-soft p-6 text-center text-sm text-muted">{children}</p>;

export function AnalyzeButton({ id, done }: { id: string; done: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function run() {
    setBusy(true); setErr("");
    const r = await fetch("/api/ai/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ detection_id: id }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setErr(j.error ?? "Failed");
    router.refresh();
  }
  return (
    <span>
      <button onClick={run} disabled={busy} className="rounded border border-ink px-3 py-1 text-xs font-bold hover:bg-ink hover:text-white disabled:opacity-50">{busy ? "Analyzing…" : done ? "Re-run AI (1 credit)" : "Analyze with AI (1 credit)"}</button>
      {err && <span role="alert" className="ml-2 text-xs text-red">{err}</span>}
    </span>
  );
}

export function KeyCreator() {
  const router = useRouter();
  const [key, setKey] = useState<string | null>(null);
  const [err, setErr] = useState("");
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "");
    const r = await fetch("/api/keys", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setErr(j.error ?? "Failed");
    setErr(""); setKey(j.key); router.refresh();
  }
  return (
    <div>
      <form onSubmit={create} className="flex gap-2"><input name="name" required placeholder="Key name (e.g. firewall)" className={`${inputCls} flex-1`} /><button className="btn-red px-4 py-2 text-sm">Create key</button></form>
      {err && <p role="alert" className="mt-2 text-sm text-red">{err}</p>}
      {key && <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm"><p className="font-bold text-green-900">Copy this key now. It will not be shown again.</p><code className="mt-2 block break-all rounded bg-white p-2">{key}</code></div>}
    </div>
  );
}
