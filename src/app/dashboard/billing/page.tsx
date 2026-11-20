import { requireUser, trialDaysLeft } from "@/lib/session";
import { PLANS, PLAN_LIMITS } from "@/lib/site";
import { Card, inputCls, Empty } from "@/components/dash";
import { adminActivatePlan } from "../actions";

export const metadata = { title: "Billing" };

export default async function Billing() {
  const { sb, profile } = await requireUser();
  const { data: pays } = await sb.from("payments").select("id,plan,amount,status,provider,created_at").order("created_at", { ascending: false });
  const lim = PLAN_LIMITS[profile.plan];
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Billing</h1>
      <Card title="Current plan">
        <p className="display text-3xl font-extrabold uppercase">{profile.plan}</p>
        <p className="mt-2 text-sm text-muted">{profile.plan === "trial" ? `${trialDaysLeft(profile)} trial days left. ` : profile.plan_activated_at ? `Active since ${new Date(profile.plan_activated_at).toLocaleDateString()}. ` : ""}AI credits: {profile.ai_credits_used} / {lim.credits}. Asset limit: {lim.assets > 100000 ? "unlimited" : lim.assets}.</p>
      </Card>
      <Card title="Upgrade">
        <p className="mb-4 text-sm text-muted">Use the same email as your account at checkout. Your plan activates after the payment is confirmed (usually within minutes); returning from checkout alone does not activate it.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.filter((p) => p.id !== "trial").map((p) => (
            <div key={p.id} className="rounded-lg border border-line p-4"><p className="font-bold">{p.name}</p><p className="display text-2xl font-extrabold">{p.price}</p><p className="text-xs text-muted">{p.unit}</p>
              <a href={p.href} target={p.external ? "_blank" : undefined} rel="noopener noreferrer" className="btn-red mt-3 block py-2 text-center text-sm">{p.cta}</a></div>
          ))}
        </div>
      </Card>
      <Card title="Payment history">{!pays?.length ? <Empty>No payments recorded.</Empty> : <ul className="divide-y divide-line text-sm">{pays.map((p) => <li key={p.id} className="flex justify-between py-2"><span>{p.plan} · {p.provider}</span><span>{p.status} · {new Date(p.created_at).toLocaleDateString()}</span></li>)}</ul>}</Card>
      {profile.is_admin && (
        <Card title="Admin: activate plan after verifying payment">
          <form action={adminActivatePlan} className="flex flex-wrap gap-2"><input name="email" type="email" required placeholder="Customer email" className={inputCls} /><select name="plan" className={inputCls}><option>go</option><option>pro</option><option>enterprise</option></select><button className="btn-red px-4 py-2 text-sm">Activate</button></form>
        </Card>
      )}
    </>
  );
}
