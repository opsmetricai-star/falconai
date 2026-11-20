import Link from "next/link";
import { ArrowRight, CircleCheck, CircleX } from "lucide-react";
import { PLANS, FEATURE_ROWS } from "@/lib/site";

export function PricingCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {PLANS.map((p) => {
        const trial = p.id === "trial";
        const tier = p.name.replace("FalconAI ", "");
        const btn = "flex items-center justify-center gap-2 rounded-md px-5 py-3 text-center text-sm font-bold";
        return (
          <div
            key={p.id}
            id={p.id}
            className={`flex flex-col rounded-2xl bg-white p-6 shadow-sm ${trial ? "border-2 border-[#3b3bff]" : "border border-transparent"}`}
          >
            <p className="text-xs font-bold text-red">{p.tag}</p>
            <h3 className="mt-3 text-2xl leading-tight">
              <span className="block font-normal">FalconAI</span>
              <span className="display block font-extrabold">{tier}</span>
            </h3>
            <div className={`my-4 h-px ${trial ? "bg-gradient-to-r from-red to-[#3b3bff]" : "bg-ink"}`} />
            <p className="display text-3xl font-extrabold text-red">{p.price}</p>
            <p className="mt-1 min-h-[2.5rem] text-xs text-muted">{p.unit}</p>

            <div className="mt-4 space-y-2">
              {p.external ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className={`btn-red ${btn}`}>
                  {p.cta} <ArrowRight size={14} />
                </a>
              ) : (
                <Link
                  href={p.href}
                  className={trial ? `${btn} bg-gradient-to-r from-red to-[#3b3bff] text-white` : `btn-red ${btn}`}
                >
                  {p.cta} <ArrowRight size={14} />
                </Link>
              )}
              {!trial && (
                <Link href="/signup" className={`${btn} border border-ink hover:bg-ink hover:text-white`}>
                  Try free <ArrowRight size={14} />
                </Link>
              )}
            </div>

            <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[13px]">
              {FEATURE_ROWS.map((f) => {
                const on = f.plans[p.id];
                return (
                  <li key={f.label} className={`flex items-center gap-2 ${on ? "font-bold" : "text-muted/60"}`}>
                    {on ? <CircleCheck size={17} className="shrink-0 text-red" /> : <CircleX size={17} className="shrink-0 text-muted/50" />}
                    {f.label}
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-xs text-muted">
              {p.credits.toLocaleString()} AI analyst credits / month
            </p>
          </div>
        );
      })}
    </div>
  );
}
