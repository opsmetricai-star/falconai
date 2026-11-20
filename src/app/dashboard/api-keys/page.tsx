import { requireUser } from "@/lib/session";
import { Card, Empty, KeyCreator } from "@/components/dash";
import { revokeKey } from "../actions";

export const metadata = { title: "API keys" };

export default async function Keys() {
  const { sb, profile } = await requireUser();
  const { data } = await sb.from("api_keys").select("id,name,prefix,revoked,last_used_at,created_at").order("created_at", { ascending: false });
  const allowed = ["pro", "enterprise"].includes(profile.plan);
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">API keys</h1>
      <Card title="Ingest API">
        <pre className="overflow-x-auto rounded bg-ink p-4 text-xs text-white">{`curl -X POST $SITE/api/ingest \\
  -H "Authorization: Bearer fai_..." -H "Content-Type: application/json" \\
  -d '{"events":[{"event_type":"login_failed","hostname":"srv1","username":"admin","src_ip":"203.0.113.5"}]}'`}</pre>
      </Card>
      <Card title="Your keys">
        {allowed ? <KeyCreator /> : <p className="rounded bg-amber-50 p-3 text-sm text-amber-900">API keys are available on Pro and Enterprise plans. Upgrade on the Billing page.</p>}
        <div className="mt-5">{!data?.length ? <Empty>No keys yet.</Empty> : <ul className="divide-y divide-line text-sm">{data.map((k) => <li key={k.id} className="flex items-center justify-between py-2"><span><b>{k.name}</b> <code>{k.prefix}…</code>{k.revoked && <span className="ml-2 text-red">revoked</span>}<span className="block text-muted">Last used: {k.last_used_at ? new Date(k.last_used_at).toLocaleString() : "never"}</span></span>{!k.revoked && <form action={revokeKey}><input type="hidden" name="id" value={k.id} /><button className="text-xs font-bold text-red">Revoke</button></form>}</li>)}</ul>}</div>
      </Card>
    </>
  );
}
