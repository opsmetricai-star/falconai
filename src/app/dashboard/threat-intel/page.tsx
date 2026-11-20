import { requireUser } from "@/lib/session";
import { Card, Empty, inputCls } from "@/components/dash";
import { RULES } from "@/lib/detect";
import { addIoc, deleteIoc } from "../actions";

export const metadata = { title: "Threat intel" };

export default async function Intel() {
  const { sb } = await requireUser();
  const { data } = await sb.from("ioc_watchlist").select("*").order("created_at", { ascending: false });
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Threat intelligence</h1>
      <Card title="Indicator watchlist">
        <p className="mb-3 text-sm text-muted">Every ingested event is matched against these indicators. Matches create a FAI-006 detection.</p>
        <form action={addIoc} className="mb-4 grid gap-2 sm:grid-cols-4">
          <select name="type" className={inputCls}>{["ip", "domain", "hash", "process"].map((t) => <option key={t}>{t}</option>)}</select>
          <input name="value" required placeholder="Value" className={inputCls} />
          <input name="note" placeholder="Note (optional)" className={inputCls} />
          <button className="btn-red px-4 py-2 text-sm">Add indicator</button>
        </form>
        {!data?.length ? <Empty>No indicators yet.</Empty> : <ul className="divide-y divide-line text-sm">{data.map((i) => <li key={i.id} className="flex items-center justify-between py-2"><span><b className="uppercase">{i.type}</b> {i.value}{i.note && <span className="text-muted"> · {i.note}</span>}</span><form action={deleteIoc}><input type="hidden" name="id" value={i.id} /><button className="text-xs font-bold text-red">Remove</button></form></li>)}</ul>}
      </Card>
      <Card title="Detection coverage (ATT&CK)">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">{RULES.map((r) => <li key={r.id} className="rounded bg-soft p-3"><b>{r.id}</b> {r.title}<span className="block text-muted">{r.technique}</span></li>)}</ul>
      </Card>
    </>
  );
}
