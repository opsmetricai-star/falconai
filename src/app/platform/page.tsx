import Link from "next/link";
import { ArrowRight, Cpu, GraduationCap, ShieldAlert, Play } from "lucide-react";
import type { Metadata } from "next";
import { PublicShell, RedButton, FinalCta, SectionHead } from "@/components/ui";
import { SavingsCalculator } from "@/components/SavingsCalculator";

export const metadata: Metadata = { title: "The FalconAI Platform | Unified Agentic Security" };

const USE_CASES = [
  ["Secure AI everywhere", "/solutions/ai-detection-and-response"],
  ["Secure the AI agent lifecycle", "/solutions/agent-security"],
  ["Accelerate agentic SOC transformation", "/solutions/agentic-soc-transformation"],
  ["Stop AI-accelerated adversaries", "/solutions/cross-domain-attacks"],
  ["Stay ahead with elite experts", "/services/managed-defense"],
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
        <div className="mt-10 flex justify-center gap-3"><RedButton href="/signup">Start free trial</RedButton><RedButton href="/dashboard" outline>Open dashboard</RedButton></div>
      </section>

      <section className="bg-ink2 px-6 py-20 text-white">
        <div className="mx-auto max-w-[1280px] lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-3xl">
            <h2 className="display text-3xl font-extrabold sm:text-4xl">Turning the platform advantage into frontier AI breakthroughs</h2>
            <p className="mt-4 text-white/75">Defender data and research combine so each investigation improves the next.</p>
          </div>
          <div className="mt-6 lg:mt-0"><RedButton href="/cyber-si-lab">Learn more</RedButton></div>
        </div>
      </section>

      <section className="red-gradient px-6 py-16 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="display text-3xl font-extrabold sm:text-4xl">Latest innovations from the platform</h2>
          <Link href="/resources/latest-innovations" className="inline-flex items-center gap-3 rounded-md bg-white px-6 py-3 font-bold text-red">See all announcements <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="px-6 py-24">
        <SectionHead title="Stopping modern adversaries starts with unified security" body="Measure what matters inside your own workspace instead of relying on borrowed statistics." />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-6 md:grid-cols-3">
          {[["Detection precision", "Track true- and false-positive outcomes per rule."], ["Operational efficiency", "Mean time to triage and respond, from your incident data."], ["Financial impact", "Use the calculator below to model consolidation."]].map(([t, b]) => (
            <div key={t} className="rounded-xl bg-soft p-8"><h3 className="display text-xl font-bold text-red">{t}</h3><p className="mt-3 text-muted">{b}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-soft px-6 py-24">
        <SectionHead title="Calculate the value of consolidating" />
        <div className="mt-12"><SavingsCalculator /></div>
      </section>

      <section className="px-6 py-24">
        <SectionHead title="AI-native security that moves faster than the threat" />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-6 md:grid-cols-3">
          {[[Cpu, "Single sensor. Unified context.", "One source of telemetry feeds detections, triage and reporting."], [GraduationCap, "AI shaped by security experts", "Prompts, rules and guardrails are written and reviewed by practitioners."], [ShieldAlert, "Built for AI. Built to stop breaches.", "Controls for AI systems are first-class, not an add-on."]].map(([I, t, b]) => {
            const Icon = I as typeof Cpu;
            return (
              <div key={t as string} className="rounded-xl border border-line p-8"><Icon className="text-red" size={32} /><h3 className="display mt-5 text-xl font-bold">{t as string}</h3><p className="mt-3 text-muted">{b as string}</p></div>
            );
          })}
        </div>
      </section>

      <section className="bg-ink px-6 py-24 text-white">
        <SectionHead dark title="Explore the unified platform built to secure the AI era" />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {USE_CASES.map(([t, h]) => (
            <Link key={h} href={h} className="group flex min-h-[220px] flex-col justify-between rounded-xl bg-panel p-6 hover:bg-red">
              <h3 className="display text-xl font-bold leading-snug">{t}</h3>
              <span className="inline-flex items-center gap-2 text-sm font-bold">Learn more <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <SectionHead title="See the platform in action" />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((v) => (
            <Link key={v} href="/resources/videos" className="group">
              <div className="hex-bg flex aspect-video items-center justify-center rounded-xl"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-red text-white group-hover:scale-110 transition"><Play size={22} /></span></div>
              <h3 className="mt-3 font-bold">{v}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-soft px-6 py-24">
        <SectionHead title="Recognition you can verify" body="Our detections map to MITRE ATT&CK and our reports to NIST CSF 2.0 and CIS Controls." />
        <div className="mt-10 text-center"><RedButton href="/why-falconai/industry-alignment">Industry alignment</RedButton></div>
      </section>

      <section className="px-6 py-24">
        <SectionHead title="Latest from the blog" />
        <div className="mx-auto mt-12 grid max-w-[1280px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((t) => (
            <Link key={t} href="/blog" className="group rounded-xl border border-line p-6 hover:border-red">
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
