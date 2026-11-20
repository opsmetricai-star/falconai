import { requireUser } from "@/lib/session";
import { Card, Empty, inputCls, Sev } from "@/components/dash";
import { addAsset, deleteAsset, setAssetStatus } from "../actions";

export const metadata = { title: "Assets" };

export default async function Assets() {
  const { sb } = await requireUser();
  const { data } = await sb.from("assets").select("*").order("created_at", { ascending: false });
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Assets</h1>
      <Card title="Add asset">
        <form action={addAsset} className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <input name="hostname" required placeholder="Hostname" className={inputCls} />
          <input name="os" placeholder="OS" className={inputCls} />
          <input name="ip" placeholder="IP" className={inputCls} />
          <input name="owner" placeholder="Owner" className={inputCls} />
          <select name="criticality" defaultValue="medium" className={inputCls}>{["low", "medium", "high", "critical"].map((c) => <option key={c}>{c}</option>)}</select>
          <button className="btn-red px-4 py-2 text-sm">Add</button>
        </form>
      </Card>
      <Card title="Inventory">
        {!data?.length ? <Empty>No assets yet.</Empty> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="text-muted"><tr><th className="p-2">Host</th><th>OS</th><th>IP</th><th>Owner</th><th>Criticality</th><th>Status</th><th>Last seen</th><th /></tr></thead><tbody>
            {data.map((a) => <tr key={a.id} className="border-t border-line"><td className="p-2 font-bold">{a.hostname}</td><td>{a.os}</td><td>{a.ip}</td><td>{a.owner}</td><td><Sev v={a.criticality} /></td>
              <td><form action={setAssetStatus} className="flex gap-1"><input type="hidden" name="id" value={a.id} /><select name="status" defaultValue={a.status} className={inputCls}>{["active", "isolated", "retired"].map((s) => <option key={s}>{s}</option>)}</select><button className="rounded border border-line px-2 text-xs">Set</button></form></td>
              <td>{a.last_seen ? new Date(a.last_seen).toLocaleString() : "never"}</td>
              <td><form action={deleteAsset}><input type="hidden" name="id" value={a.id} /><button className="text-xs font-bold text-red">Delete</button></form></td></tr>)}
          </tbody></table></div>
        )}
      </Card>
    </>
  );
}
