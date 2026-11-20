import { requireUser } from "@/lib/session";
import { Card, Empty, inputCls, Sev } from "@/components/dash";
import { setIncidentStatus } from "../actions";

export const metadata = { title: "Incidents" };

export default async function Incidents() {
  const { sb } = await requireUser();
  const { data } = await sb.from("incidents").select("*").order("created_at", { ascending: false });
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Incidents</h1>
      {!data?.length && <Empty>No incidents. Open one from a detection.</Empty>}
      {data?.map((i) => (
        <Card key={i.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><div className="flex items-center gap-2"><Sev v={i.severity} /><h3 className="font-bold">{i.title}</h3></div><p className="mt-1 text-sm text-muted">Opened {new Date(i.created_at).toLocaleString()} · updated {new Date(i.updated_at).toLocaleString()}</p>{i.description && <p className="mt-2 text-sm">{i.description}</p>}</div>
            <form action={setIncidentStatus} className="flex gap-1"><input type="hidden" name="id" value={i.id} /><select name="status" defaultValue={i.status} className={inputCls}>{["open", "investigating", "contained", "closed"].map((s) => <option key={s}>{s}</option>)}</select><button className="rounded border border-line px-3 text-xs font-bold">Set</button></form>
          </div>
        </Card>
      ))}
    </>
  );
}
