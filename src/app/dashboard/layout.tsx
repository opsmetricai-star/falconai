import Link from "next/link";
import { LayoutDashboard, ShieldAlert, Server, Activity, Siren, Radar, FileText, KeyRound, CreditCard, Settings, Bell } from "lucide-react";
import { requireUser, trialDaysLeft } from "@/lib/session";
import { Logo } from "@/components/Logo";

const LINKS = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/dashboard/detections", "Detections", ShieldAlert],
  ["/dashboard/events", "Events", Activity],
  ["/dashboard/assets", "Assets", Server],
  ["/dashboard/incidents", "Incidents", Siren],
  ["/dashboard/threat-intel", "Threat intel", Radar],
  ["/dashboard/reports", "Reports", FileText],
  ["/dashboard/api-keys", "API keys", KeyRound],
  ["/dashboard/billing", "Billing", CreditCard],
  ["/dashboard/settings", "Settings", Settings],
] as const;

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const { sb, user, profile } = await requireUser();
  const { count } = await sb.from("notifications").select("id", { count: "exact", head: true }).eq("read", false);
  const expired = profile.plan === "trial" && trialDaysLeft(profile) === 0;
  return (
    <div className="flex min-h-screen flex-col bg-soft lg:flex-row">
      <aside className="bg-ink text-white lg:w-60 lg:shrink-0">
        <div className="flex items-center justify-between p-5"><Logo light /></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {LINKS.map(([h, l, I]) => (
            <Link key={h} href={h} className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"><I size={17} />{l}</Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white px-6 py-3 text-sm">
          <span className="rounded bg-soft px-2 py-1 font-bold uppercase">{profile.plan}{profile.plan === "trial" && ` · ${trialDaysLeft(profile)}d left`}</span>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="relative" aria-label="Notifications"><Bell size={18} />{!!count && <span className="absolute -right-2 -top-2 rounded-full bg-red px-1.5 text-[10px] font-bold text-white">{count}</span>}</Link>
            <span className="hidden text-muted sm:inline">{user.email}</span>
            <form action="/auth/logout" method="post"><button className="font-bold text-red">Log out</button></form>
          </div>
        </div>
        {expired && <div className="bg-amber-100 px-6 py-3 text-sm text-amber-900">Your trial has ended. <Link href="/dashboard/billing" className="font-bold underline">Choose a plan</Link> to keep using AI features.</div>}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
