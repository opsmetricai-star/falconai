import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import type { PageDef } from "@/lib/content";
import type { Rich } from "@/lib/rich";
import { PublicShell, RedButton, FinalCta, SectionHead } from "./ui";

const Badge = ({ live }: { live: boolean }) => (
  <span className={`w-fit self-start rounded-full px-2.5 py-0.5 text-[11px] font-bold ${live ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"}`}>
    {live ? "Available now" : "Roadmap"}
  </span>
);

export function RichPage({ def, rich, related }: { def: PageDef; rich: Rich; related: PageDef[] }) {
  const live = rich.capabilities.filter((c) => c.status === "live").length;
  const road = rich.capabilities.length - live;
  return (
    <PublicShell>
      {/* hero */}
      <section className="hex-bg px-6 pb-20 pt-16 text-white sm:pt-20">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red">{def.eyebrow}</p>
            <h1 className="display mt-3 text-4xl font-extrabold leading-[1.08] sm:text-6xl">{def.title}</h1>
            <p className="mt-5 text-2xl font-light">{def.tagline}</p>
            <p className="mt-5 max-w-2xl text-lg text-white/75">{def.summary}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <RedButton href="/signup">Start free trial</RedButton>
              <RedButton href="/contact-us" outline>Talk to an expert</RedButton>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0d0f13] p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">At a glance</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-4"><p className="display text-4xl font-extrabold text-red">{live}</p><p className="mt-1 text-sm text-white/75">capabilities available now</p></div>
              <div className="rounded-xl bg-white/5 p-4"><p className="display text-4xl font-extrabold">{road}</p><p className="mt-1 text-sm text-white/75">on the roadmap</p></div>
            </div>
            <p className="mt-5 text-sm text-white/60">We label every capability so you know exactly what you can use today.</p>
          </div>
        </div>
      </section>

      {/* overview */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-2">
          <SectionHead center={false} eyebrow="Overview" title={rich.overview.title} body={rich.overview.body} />
          <ul className="space-y-3 rounded-2xl bg-soft p-8">
            {rich.overview.bullets.map((b) => (
              <li key={b} className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red text-white"><Check size={14} /></span>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* capabilities */}
      <section className="bg-soft px-6 py-24">
        <SectionHead title="Capabilities" body="Everything below is labelled by availability." />
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rich.capabilities.map((c) => (
            <div key={c.title} className={`flex flex-col rounded-xl border bg-white p-7 ${c.status === "live" ? "border-line" : "border-dashed border-line opacity-90"}`}>
              <Badge live={c.status === "live"} />
              <h3 className="display mt-4 text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="bg-black px-6 py-24 text-white">
        <SectionHead dark title="How it works" />
        <ol className="mx-auto mt-14 grid max-w-[1280px] gap-5 md:grid-cols-2 lg:grid-cols-4">
          {rich.steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-white/10 bg-[#0d0f13] p-7">
              <span className="display flex h-11 w-11 items-center justify-center rounded-full bg-red text-lg font-extrabold">{i + 1}</span>
              <h3 className="display mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-white/70">{s.body}</p>
              {i < rich.steps.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-red lg:block" size={22} />}
            </li>
          ))}
        </ol>
      </section>

      {/* in-product band */}
      {rich.module && (
        <section className="red-gradient px-6 py-14 text-white">
          <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/80">In the product</p>
              <h2 className="display mt-1 text-3xl font-extrabold">{rich.module.label}</h2>
              <p className="mt-2 max-w-xl text-white/90">{rich.module.blurb}</p>
            </div>
            <Link href={rich.module.href} className="inline-flex shrink-0 items-center gap-3 rounded-md bg-white px-6 py-3 font-bold text-red">Open <ArrowRight size={16} /></Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="px-6 py-24">
        <SectionHead title="Frequently asked questions" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-line rounded-xl border border-line">
          {rich.faq.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">{f.q}<ChevronDown size={18} className="shrink-0 transition group-open:rotate-180" /></summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="bg-soft px-6 py-20">
          <SectionHead title={`More in ${def.eyebrow}`} />
          <div className="mx-auto mt-10 grid max-w-[1280px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link key={c.path} href={"/" + c.path} className="group rounded-xl border border-line bg-white p-6 hover:border-red">
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
