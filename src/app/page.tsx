import Link from "next/link";
import { ArrowRight, ShieldCheck, Target, ScrollText, Bot } from "lucide-react";
import { PublicShell, RedButton, FinalCta, SectionHead } from "@/components/ui";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PricingCards } from "@/components/PricingCards";

const FRAMEWORKS = [
  { icon: Target, title: "MITRE ATT&CK mapping", body: "Every detection rule is tagged to a technique so you can see coverage gaps at a glance.", href: "/why-falconai/industry-alignment" },
  { icon: ShieldCheck, title: "NIST CSF 2.0 reporting", body: "Generate reports organized by Govern, Identify, Protect, Detect, Respond and Recover.", href: "/why-falconai/industry-alignment" },
  { icon: ScrollText, title: "CIS Controls evidence", body: "Export safeguard-level evidence from your own telemetry for auditors.", href: "/why-falconai/industry-alignment" },
  { icon: Bot, title: "Explainable AI triage", body: "Every AI finding cites the events and assets it was derived from.", href: "/platform/analyst-ai" },
  { icon: ShieldCheck, title: "Tenant isolation", body: "Row-level security keeps each workspace's data separate by design.", href: "/why-falconai/compliance" },
];

const SCENARIOS = [
  { who: "Lean IT team", role: "Illustrative scenario", quote: "One administrator connects laptops and servers in an afternoon, and Analyst AI explains each alert in plain language.", href: "/why-falconai/customer-scenarios" },
  { who: "Growing SOC", role: "Illustrative scenario", quote: "Automated triage clears the repetitive queue so analysts spend time hunting and improving detections.", href: "/why-falconai/customer-scenarios" },
  { who: "Regulated business", role: "Illustrative scenario", quote: "Reports aligned to NIST CSF give auditors evidence straight from live telemetry.", href: "/why-falconai/customer-scenarios" },
];

const SOLUTIONS = [
  { title: "Secure your AI", kicker: "FalconAI AI Detection & Response", links: [["Learn more", "/solutions/ai-detection-and-response"]], bg: "from-[#3a0a0f] to-[#0b0d11]" },
  { title: "Secure your cloud", kicker: "FalconAI Cloud Security", links: [["Latest news", "/blog"], ["Discover Cloud Security", "/platform/cloud-security"]], bg: "from-[#0b3a40] to-[#0b0d11]" },
  { title: "Stop identity attacks", kicker: "FalconAI Identity Security", links: [["Read blog", "/blog"], ["Discover Identity Security", "/platform/identity-security"]], bg: "from-[#1b2438] to-[#0b0d11]" },
  { title: "The next SOC era starts here", kicker: "FalconAI Next-Gen SIEM", links: [["Latest news", "/blog"], ["Discover Next-Gen SIEM", "/platform/next-gen-siem"]], bg: "from-[#2a1230] to-[#0b0d11]" },
];

export default function Home() {
  return (
    <PublicShell>
      <HeroCarousel />

      {/* Platform intro */}
      <section className="hex-bg px-6 py-24 text-center text-white">
        <h2 className="display mx-auto max-w-5xl text-4xl font-extrabold leading-[1.1] sm:text-6xl">
          FalconAI Platform:
          <br />
          <span className="block text-[0.92em]">One unified platform to secure the agentic enterprise</span>
        </h2>
        <p className="mx-auto mt-10 max-w-4xl text-xl font-light leading-snug sm:text-[26px]">
          The platform combines security telemetry, AI intelligence, automation and expert human insight to stop breaches.
        </p>
        <p className="mx-auto mt-8 max-w-4xl text-xl font-light leading-snug sm:text-[26px]">
          Collect once and use everywhere. Unified visibility with full context. Operate agentically and learn continuously with human intelligence.
        </p>
        <div className="mt-10"><RedButton href="/platform">Explore now</RedButton></div>
      </section>

      {/* Cyber SI Lab */}
      <section className="bg-ink2 px-6 py-24 text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-red">Cyber SuperIntelligence Lab</p>
            <h2 className="display text-3xl font-extrabold leading-tight sm:text-5xl">Turning the platform advantage into frontier AI breakthroughs</h2>
            <p className="mt-6 text-lg text-white/75">
              Our research lab applies frontier models to real defender workflows. Its first project pairs an offensive emulation model for realistic testing with a defensive model that learns from every investigation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RedButton href="/cyber-si-lab">Learn more</RedButton>
              <RedButton href="/cyber-si-lab/research" outline>Explore research hub</RedButton>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-panel p-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-white/60">Detection lifecycle</p>
            <ol className="space-y-4">
              {["Collect telemetry", "Detect with rules and models", "Triage with Analyst AI", "Respond with approval", "Learn from the outcome"].map((s, n) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red text-sm font-bold">{n + 1}</span>
                  <span className="text-lg">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Framework alignment (analyst recognition slot) */}
      <section className="bg-soft px-6 py-24">
        <SectionHead title="Built around the frameworks defenders are measured on" body="We do not claim analyst rankings we have not earned. Here is what you can verify yourself." />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {FRAMEWORKS.map((f) => (
            <Link key={f.title} href={f.href} className="group flex flex-col rounded-xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <f.icon className="text-red" size={30} />
              <h3 className="display mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{f.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red">Learn more <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24">
        <SectionHead title="Tailored bundles to stop breaches" body="Start free, then pick the plan that fits your team." />
        <div className="mt-6 flex justify-center gap-3">
          <RedButton href="/signup">Start free trial</RedButton>
          <Link href="/pricing" className="inline-flex items-center gap-3 rounded-md border-2 border-ink px-6 py-3 font-bold hover:bg-ink hover:text-white">Explore all bundles <ArrowRight size={16} /></Link>
        </div>
        <div className="mx-auto mt-12 max-w-[1280px]"><PricingCards /></div>
      </section>

      {/* Scenarios */}
      <section className="bg-ink px-6 py-24 text-white">
        <SectionHead dark title="Built for teams that protect what matters most" body="Illustrative scenarios showing how teams use the platform. These are examples, not customer testimonials." />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-6 md:grid-cols-3">
          {SCENARIOS.map((s) => (
            <figure key={s.who} className="flex flex-col rounded-xl bg-panel p-8">
              <blockquote className="flex-1 text-xl font-light leading-snug">“{s.quote}”</blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-4 text-sm">
                <strong className="block text-base">{s.who}</strong>
                <span className="text-white/60">{s.role}</span>
              </figcaption>
              <Link href={s.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red">See scenarios <ArrowRight size={14} /></Link>
            </figure>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section className="px-6 py-24">
        <SectionHead title="Experience industry-leading solutions from one powerful platform" />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s) => (
            <div key={s.title} className={`flex min-h-[380px] flex-col justify-end rounded-xl bg-gradient-to-b ${s.bg} p-7 text-white`}>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">{s.kicker}</p>
              <h3 className="display mt-2 text-2xl font-extrabold leading-tight">{s.title}</h3>
              <div className="mt-5 flex flex-col gap-2">
                {s.links.map(([l, h], n) => (
                  <Link key={h + l} href={h} className={n === s.links.length - 1 ? "btn-red inline-flex w-fit items-center gap-2 px-4 py-2 text-sm" : "text-sm font-bold underline"}>
                    {l}
                    {n === s.links.length - 1 && <ArrowRight size={14} />}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Adversary banner */}
      <section className="hex-bg px-6 py-24 text-center text-white">
        <h2 className="display text-4xl font-extrabold sm:text-6xl">Know them. Find them. Stop them.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-white/80">Adversaries operate with unprecedented stealth. Discover who is targeting you and how to get ahead.</p>
        <div className="mt-8"><RedButton href="/resources/adversary-hub">Explore Adversary Hub</RedButton></div>
      </section>

      <FinalCta />
    </PublicShell>
  );
}
