import { requireUser } from "@/lib/session";
import { Card, Sev, Empty, AnalyzeButton, inputCls } from "@/components/dash";
import { setDetectionStatus, escalateDetection } from "../actions";

export const metadata = { title: "Detections" };

export default async function Detections() {
  const { sb } = await requireUser();
  const { data } = await sb.from("detections").select("*").order("created_at", { ascending: false }).limit(100);
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Detections</h1>
      {!data?.length && <Empty>No detections yet. Send events from the Events page; rules run automatically on ingest.</Empty>}
      {data?.map((d) => {
        const a = d.ai_analysis as null | { verdict: string; confidence: number; summary: string; likely_cause: string; recommended_actions: string[]; evidence: string[] };
        return (
          <Card key={d.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><div className="flex items-center gap-2"><Sev v={d.severity} /><h3 className="font-bold">{d.title}</h3></div>
                <p className="mt-1 text-sm text-muted">{d.rule_id} · {d.technique}{d.hostname && ` · ${d.hostname}`} · {new Date(d.created_at).toLocaleString()}</p>
                <p className="mt-2 text-sm">{d.summary}</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <form action={setDetectionStatus} className="flex gap-1"><input type="hidden" name="id" value={d.id} />
                  <select name="status" defaultValue={d.status} className={inputCls}>{["open", "investigating", "resolved", "false_positive"].map((s) => <option key={s}>{s}</option>)}</select>
                  <button className="rounded border border-line px-3 text-xs font-bold">Set</button></form>
                {d.incident_id ? <span className="text-xs font-bold text-muted">Incident open</span> : <form action={escalateDetection}><input type="hidden" name="id" value={d.id} /><button className="rounded border border-red px-3 py-1 text-xs font-bold text-red">Open incident</button></form>}
              </div>
            </div>
            <div className="mt-4"><AnalyzeButton id={d.id} done={!!a} /></div>
            {a && (
              <div className="mt-4 rounded-lg bg-soft p-4 text-sm">
                <p className="font-bold">AI verdict: {a.verdict.replace("_", " ")} ({Math.round(a.confidence * 100)}% confidence)</p>
                <p className="mt-2">{a.summary}</p><p className="mt-2"><b>Likely cause:</b> {a.likely_cause}</p>
                <p className="mt-2 font-bold">Recommended actions</p><ul className="list-disc pl-5">{a.recommended_actions.map((x) => <li key={x}>{x}</li>)}</ul>
                {a.evidence.length > 0 && <><p className="mt-2 font-bold">Evidence</p><ul className="list-disc pl-5">{a.evidence.map((x) => <li key={x}>{x}</li>)}</ul></>}
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
}
