import Link from "next/link";
import { requireUser } from "@/lib/session";
import { PLAN_LIMITS } from "@/lib/site";
import { Card, Sev, Empty } from "@/components/dash";
import { markNotificationsRead } from "./actions";

export const metadata = { title: "Overview" };

export default async function Overview() {
  const { sb, profile } = await requireUser();
  const day = new Date(Date.now() - 86_400_000).toISOString();
  const [open, crit, assets, ev, recent, notes] = await Promise.all([
    sb.from("detections").select("id", { count: "exact", head: true }).in("status", ["open", "investigating"]),
    sb.from("detections").select("id", { count: "exact", head: true }).eq("severity", "critical").in("status", ["open", "investigating"]),
    sb.from("assets").select("id", { count: "exact", head: true }),
    sb.from("events").select("id", { count: "exact", head: true }).gte("occurred_at", day),
    sb.from("detections").select("id,title,severity,hostname,created_at,status").order("created_at", { ascending: false }).limit(6),
    sb.from("notifications").select("id,title,body,read,created_at").order("created_at", { ascending: false }).limit(6),
  ]);
  const lim = PLAN_LIMITS[profile.plan];
  const stats = [["Open detections", open.count ?? 0], ["Critical open", crit.count ?? 0], ["Assets", `${assets.count ?? 0} / ${lim.assets > 100000 ? "∞" : lim.assets}`], ["Events (24h)", ev.count ?? 0], ["AI credits used", `${profile.ai_credits_used} / ${lim.credits}`]];
  const first = (assets.count ?? 0) === 0;
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Welcome{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([l, v]) => <div key={l as string} className="rounded-xl border border-line bg-white p-5"><p className="text-sm text-muted">{l}</p><p className="display mt-1 text-3xl font-extrabold">{v}</p></div>)}
      </div>
      {first && (
        <Card title="Get started">
          <ol className="list-decimal space-y-1 pl-5 text-sm"><li><Link className="text-red underline" href="/dashboard/assets">Add an asset</Link></li><li><Link className="text-red underline" href="/dashboard/events">Send events (form or CSV)</Link></li><li>Review <Link className="text-red underline" href="/dashboard/detections">detections</Link> and run Analyst AI</li></ol>
        </Card>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent detections" right={<Link href="/dashboard/detections" className="text-sm font-bold text-red">View all</Link>}>
          {recent.data?.length ? <ul className="divide-y divide-line">{recent.data.map((d) => <li key={d.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span>{d.title}{d.hostname && <span className="text-muted"> · {d.hostname}</span>}</span><Sev v={d.severity} /></li>)}</ul> : <Empty>No detections yet.</Empty>}
        </Card>
        <Card title="Notifications" right={<form action={markNotificationsRead}><button className="text-sm font-bold text-red">Mark all read</button></form>}>
          {notes.data?.length ? <ul className="divide-y divide-line">{notes.data.map((n) => <li key={n.id} className={`py-3 text-sm ${n.read ? "text-muted" : "font-bold"}`}>{n.title}{n.body && <span className="block font-normal text-muted">{n.body}</span>}</li>)}</ul> : <Empty>Nothing new.</Empty>}
        </Card>
      </div>
    </>
  );
}
