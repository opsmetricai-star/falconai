import Link from "next/link";
import { ArrowRight, Cpu, GraduationCap, ShieldAlert, Play } from "lucide-react";
import type { Metadata } from "next";
import { PublicShell, RedButton, FinalCta, SectionHead } from "@/components/ui";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { InfinityLoop, Rings } from "@/components/PlatformDiagrams";
import { RULES } from "@/lib/detect";

export const metadata: Metadata = { title: "The FalconAI Platform | Unified Agentic Security" };

const USE_CASES = [
  ["Secure AI everywhere", "Protect AI adoption and autonomous agents across endpoint, SaaS and cloud.", "/solutions/ai-detection-and-response"],
  ["Secure the AI agent lifecycle", "Govern what agents can access and do, from build to runtime.", "/solutions/agent-security"],
  ["Accelerate agentic SOC transformation", "Let agents triage every alert while analysts focus on hunting.", "/solutions/agentic-soc-transformation"],
  ["Stop AI-accelerated adversaries", "Correlate endpoint, identity and cloud activity into one story.", "/solutions/cross-domain-attacks"],
  ["Stay ahead with elite experts", "Add 24/7 expert-led managed defense when you need it.", "/services/managed-defense"],
];
const VIDEOS = ["Securing AI agents at runtime", "Detect agent insider threats", "Identity attack paths, explained", "Introducing the Cyber SI Lab"];
const POSTS = [
  "Advancing AI security from endpoint to cloud",
  "Introducing the AI kill switch: control when agents go rogue",
  "Why agent observability is now a security requirement",
  "Automated AI security testing comes to the platform",
  "Extending the agentic SOC to agent insider threats",
  "Adversary emulation to counter AI-enabled attackers",
];
const STATS = [
  ["Detection coverage", String(RULES.length), "built-in detection rules, each mapped to a MITRE ATT&CK technique"],
  ["Correlation", "30 min", "rolling window used to link related events into one detection"],
  ["Time to start", "15 days", "free workspace with no credit card, ready in minutes"],
];

const dark = "bg-black text-white";

export default function PlatformPage() {
  return (
    <PublicShell>
      <section className="hex-bg px-6 py-24 text-center text-white">
        <h1 className="display mx-auto max-w-5xl text-4xl font-extrabold leading-[1.1] sm:text-6xl">
          FalconAI Platform:
          <span className="block text-[0.92em]">One unified platform to secure the agentic enterprise</span>
        </h1>
        <p className="mx-auto mt-10 max-w-4xl text-xl font-light sm:text-[26px]">The platform combines data, AI, automation and expert human intelligence to stop breaches.</p>
        <p className="mx-auto mt-6 max-w-4xl text-xl font-light sm:text-[26px]">Collect once and use everywhere. Operate agentically and learn continuously.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3"><RedButton href="/signup">Start free trial</RedButton><RedButton href="/dashboard" outline>Open dashboard</RedButton></div>
      </section>

      <section className={`${dark} px-6 py-20`}>
        <div className="mx-auto max-w-[1280px] text-center">
          <h2 className="display mx-auto max-w-3xl text-3xl font-extrabold sm:text-5xl">Turning the platform advantage into frontier AI breakthroughs</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/75">The Cyber SuperIntelligence Lab combines researchers, offensive operators and incident responders with unmatched security data, so each investigation improves the next.</p>
          <div className="mt-8"><RedButton href="/cyber-si-lab">Learn more</RedButton></div>
        </div>
      </section>

      <section className="red-gradient px-6 py-14 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="display text-3xl font-extrabold sm:text-4xl">Latest innovations from the platform</h2>
          <Link href="/resources/latest-innovations" className="inline-flex items-center gap-3 rounded-md bg-white px-6 py-3 font-bold text-red">See all announcements <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* stat tiles */}
      <section className={`${dark} px-6 py-24`}>
        <SectionHead dark title="Stopping modern adversaries starts with unified security" body="Figures below are properties of the product you can verify, not borrowed statistics." />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 md:grid-cols-3">
          {STATS.map(([label, num, cap]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#0d0f13] p-8">
              <p className="text-sm font-bold text-red">{label}</p>
              <p className="display mt-6 text-6xl font-extrabold sm:text-7xl">{num}</p>
              <p className="mt-4 text-lg text-white/80">{cap}</p>
            </div>
          ))}
        </div>
      </section>

      {/* calculator */}
      <section className="bg-[#101318] px-6 py-24 text-white">
        <SectionHead dark title="Calculate the value of consolidating" body="Model licence and triage savings from retiring overlapping tools." />
        <div className="mt-12 text-ink"><SavingsCalculator /></div>
      </section>

      {/* infinity loop */}
      <section className={`${dark} px-6 py-24`}>
        <SectionHead dark title="AI-native security that moves faster than the threat" />
        <div className="mt-12"><InfinityLoop /></div>
        <div className="mx-auto mt-6 flex flex-wrap justify-center gap-3 text-xs font-bold text-white/80">
          {["SOC analysts", "Incident responders", "Data scientists"].map((c) => <span key={c} className="rounded border border-white/20 px-3 py-1.5">{c}</span>)}
        </div>
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 md:grid-cols-3">
          {[[Cpu, "Single sensor. Unified context.", "One source of telemetry feeds detections, triage and reporting."], [GraduationCap, "AI shaped by security experts", "Prompts, rules and guardrails are written and reviewed by practitioners."], [ShieldAlert, "Built for AI. Built to stop breaches.", "Controls for AI systems are first-class, not an add-on."]].map(([I, t, b]) => {
            const Icon = I as typeof Cpu;
            return (
              <div key={t as string} className="rounded-2xl border border-white/10 bg-[#0d0f13] p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-red text-red"><Icon size={24} /></span>
                <h3 className="display mt-6 border-b-2 border-red pb-3 text-2xl font-extrabold leading-tight">{t as string}</h3>
                <p className="mt-4 text-white/75">{b as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* rings + use cases */}
      <section className={`${dark} px-6 pb-24`}>
        <SectionHead dark title="Explore the unified platform built to secure the AI era" />
        <div className="mx-auto mt-14 grid max-w-[1280px] items-center gap-10 rounded-3xl border border-white/10 bg-[#07090c] p-6 sm:p-10 lg:grid-cols-2">
          <Rings />
          <ul className="divide-y divide-white/10">
            {USE_CASES.map(([t, b, h]) => (
              <li key={h}>
                <Link href={h} className="group block py-5">
                  <h3 className="display text-xl font-extrabold group-hover:text-red">{t}</h3>
                  <p className="mt-1 text-sm text-white/70">{b}</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-red">Learn more <ArrowRight size={14} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#101318] px-6 py-24 text-white">
        <SectionHead dark title="See the platform in action" />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((v) => (
            <Link key={v} href="/resources/videos" className="group">
              <div className="hex-bg flex aspect-video items-center justify-center rounded-xl border border-white/10"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-red text-white transition group-hover:scale-110"><Play size={22} /></span></div>
              <h3 className="mt-3 font-bold">{v}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${dark} px-6 py-24`}>
        <SectionHead dark title="Recognition you can verify" body="Our detections map to MITRE ATT&CK and our reports to NIST CSF 2.0 and CIS Controls." />
        <div className="mt-10 text-center"><RedButton href="/why-falconai/industry-alignment">Industry alignment</RedButton></div>
      </section>

      <section className="bg-[#101318] px-6 py-24 text-white">
        <SectionHead dark title="Latest from the blog" />
        <div className="mx-auto mt-12 grid max-w-[1280px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((t) => (
            <Link key={t} href="/blog" className="group rounded-2xl border border-white/10 bg-[#0d0f13] p-6 hover:border-red">
              <h3 className="display text-lg font-bold">{t}</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red">Read blog <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <FinalCta />
    </PublicShell>
  );
}
