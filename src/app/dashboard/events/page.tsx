import { requireUser } from "@/lib/session";
import { Card, Empty, inputCls } from "@/components/dash";
import { addEvent, uploadCsv } from "../actions";

export const metadata = { title: "Events" };

const TYPES = ["login_failed", "login_success", "process_start", "file_modified", "network_connection", "dns_query", "log"];

export default async function Events() {
  const { sb } = await requireUser();
  const { data } = await sb.from("events").select("id,event_type,hostname,username,src_ip,process,command_line,message,source,occurred_at").order("occurred_at", { ascending: false }).limit(50);
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Events</h1>
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <Card title="Send an event">
          <form action={addEvent} className="grid gap-2 sm:grid-cols-2">
            <select name="event_type" className={inputCls}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            <input name="hostname" placeholder="Hostname" className={inputCls} />
            <input name="username" placeholder="Username" className={inputCls} />
            <input name="src_ip" placeholder="Source IP" className={inputCls} />
            <input name="process" placeholder="Process (e.g. powershell.exe)" className={inputCls} />
            <input name="command_line" placeholder="Command line" className={inputCls} />
            <input name="message" placeholder="Message" className={`${inputCls} sm:col-span-2`} />
            <button className="btn-red px-4 py-2 text-sm sm:col-span-2">Ingest event</button>
          </form>
        </Card>
        <Card title="Upload CSV">
          <p className="mb-3 text-sm text-muted">Header row required: <code>event_type</code>, optional <code>hostname, username, src_ip, process, command_line, message, occurred_at</code>. Up to 1,000 rows / 2 MB.</p>
          <form action={uploadCsv} className="flex flex-wrap gap-2"><input type="file" name="file" accept=".csv,text/csv" required className="w-full max-w-full min-w-0 text-sm" /><button className="btn-red px-4 py-2 text-sm">Upload</button></form>
        </Card>
      </div>
      <Card title="Latest events">
        {!data?.length ? <Empty>No events yet.</Empty> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="text-muted"><tr><th className="p-2">Time</th><th>Type</th><th>Host</th><th>User</th><th>IP</th><th>Detail</th><th>Src</th></tr></thead><tbody>
            {data.map((e) => <tr key={e.id} className="border-t border-line"><td className="p-2 whitespace-nowrap">{new Date(e.occurred_at).toLocaleString()}</td><td>{e.event_type}</td><td>{e.hostname}</td><td>{e.username}</td><td>{e.src_ip}</td><td className="max-w-xs truncate">{e.command_line || e.message || e.process}</td><td>{e.source}</td></tr>)}
          </tbody></table></div>
        )}
      </Card>
    </>
  );
}
