import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Zap, Layers, Eye } from "lucide-react";
import { PAGES, PAGE_MAP } from "@/lib/content";
import { PublicShell, RedButton, FinalCta, SectionHead } from "@/components/ui";

const HUBS: Record<string, { title: string; tagline: string; summary: string }> = {
  services: { title: "Services", tagline: "Expert-led help, on your terms.", summary: "Managed defense, incident response and advisory from practitioners who work intrusions every day." },
  solutions: { title: "Solutions", tagline: "Solutions for every threat and every industry.", summary: "Start from the problem you need to solve, or the industry you operate in." },
  resources: { title: "Resources", tagline: "Research, training and guides.", summary: "Reports, education and tools to help you defend better." },
  "why-falconai": { title: "Why FalconAI", tagline: "Why teams choose a unified, AI-native platform.", summary: "See how the platform aligns to frameworks, what to evaluate, and how teams use it." },
  "cyber-si-lab": { title: "Cyber SuperIntelligence Lab", tagline: "Frontier AI, applied to defense.", summary: "Our research lab pairs offensive emulation with defensive learning so every investigation makes the platform smarter." },
  about: { title: "About FalconAI", tagline: "We stop breaches with AI-native security.", summary: "We are building a unified platform that lets small teams defend like large ones." },
};

function allSlugs() {
  const s = new Set<string>(Object.keys(HUBS));
  PAGES.forEach((p) => s.add(p.path));
  return [...s];
}

export function generateStaticParams() {
  return allSlugs().map((p) => ({ slug: p.split("/") }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const path = (await params).slug.join("/");
  const def = PAGE_MAP.get(path);
  const hub = HUBS[path];
  const t = def?.title ?? hub?.title;
  return t ? { title: t, description: def?.summary ?? hub?.summary } : {};
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const path = (await params).slug.join("/");
  const def = PAGE_MAP.get(path);
  const hub = HUBS[path];
  if (!def && !hub) notFound();

  const section = path.split("/")[0];
  const children = PAGES.filter((p) => p.path.startsWith(section + "/") && p.path !== path);
  const title = def?.title ?? hub!.title;
  const tagline = def?.tagline ?? hub!.tagline;
  const summary = def?.summary ?? hub!.summary;
  const icons = [Zap, Layers, Eye];
  const isProduct = section === "platform" || section === "solutions" || section === "services";

  return (
    <PublicShell>
      <section className="hex-bg px-6 pb-24 pt-20 text-white">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-sm font-bold uppercase tracking-widest text-red">{def?.eyebrow ?? "FalconAI"}</p>
          <h1 className="display mt-3 max-w-4xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-2xl font-light">{tagline}</p>
          <p className="mt-5 max-w-2xl text-lg text-white/75">{summary}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <RedButton href="/signup">Start free trial</RedButton>
            <RedButton href="/contact-us" outline>Talk to an expert</RedButton>
          </div>
        </div>
      </section>

      {def && (
        <section className="px-6 py-24">
          <SectionHead title="What you get" />
          <div className="mx-auto mt-14 grid max-w-[1280px] gap-6 md:grid-cols-3">
            {def.features.map((f, i) => {
              const Icon = icons[i % 3];
              return (
                <div key={f.title} className="rounded-xl border border-line p-8 transition hover:shadow-lg">
                  <Icon className="text-red" size={30} />
                  <h3 className="display mt-5 text-xl font-bold">{f.title}</h3>
                  <p className="mt-3 text-muted">{f.body}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {def && isProduct && (
        <section className="bg-soft px-6 py-20">
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHead center={false} eyebrow="In the product" title="See it working on your own data" body="Create a free workspace, add assets, send events and let the detection engine and Analyst AI do the rest. Every module in the dashboard is backed by your workspace data, not a demo." />
              <div className="mt-6"><RedButton href="/signup">Create free workspace</RedButton></div>
            </div>
            <ol className="space-y-3">
              {["Add assets", "Ingest events", "Review detections", "Ask Analyst AI", "Open incidents and generate reports"].map((s, i) => (
                <li key={s} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red text-sm font-bold text-white">{i + 1}</span>{s}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {children.length > 0 && (
        <section className="px-6 py-20">
          <SectionHead title={def ? `More in ${HUBS[section]?.title ?? def.eyebrow}` : `Explore ${title}`} />
          <div className="mx-auto mt-12 grid max-w-[1280px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children.slice(0, 12).map((c) => (
              <Link key={c.path} href={"/" + c.path} className="group rounded-xl border border-line p-6 hover:border-red">
                <h3 className="display text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted">{c.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red">Learn more <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FinalCta />
    </PublicShell>
  );
}
