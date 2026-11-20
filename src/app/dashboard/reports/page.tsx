import { requireUser } from "@/lib/session";
import { Card, Empty, inputCls } from "@/components/dash";
import { generateReport, deleteReport } from "../actions";

export const metadata = { title: "Reports" };

export default async function Reports() {
  const { sb } = await requireUser();
  const { data } = await sb.from("reports").select("*").order("created_at", { ascending: false });
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Reports</h1>
      <Card title="Generate summary">
        <form action={generateReport} className="flex gap-2"><select name="days" defaultValue="7" className={inputCls}>{[1, 7, 30, 90].map((d) => <option key={d} value={d}>Last {d} day{d > 1 ? "s" : ""}</option>)}</select><button className="btn-red px-4 py-2 text-sm">Generate</button></form>
      </Card>
      {!data?.length && <Empty>No reports yet.</Empty>}
      {data?.map((r) => (
        <Card key={r.id} title={r.title} right={<form action={deleteReport}><input type="hidden" name="id" value={r.id} /><button className="text-xs font-bold text-red">Delete</button></form>}>
          <pre className="whitespace-pre-wrap text-sm">{r.content}</pre>
        </Card>
      ))}
    </>
  );
}
