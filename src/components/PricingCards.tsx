import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/site";

export function PricingCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((p) => {
        const hot = p.id === "pro";
        return (
          <div key={p.id} id={p.id} className={`relative flex flex-col rounded-xl border p-7 ${hot ? "border-red shadow-xl" : "border-line"} bg-white`}>
            {hot && <span className="absolute -top-3 left-7 rounded bg-red px-2 py-0.5 text-xs font-bold text-white">Most popular</span>}
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{p.tag}</p>
            <h3 className="display mt-1 text-xl font-extrabold">{p.name}</h3>
            <p className="display mt-5 text-4xl font-extrabold">{p.price}</p>
            <p className="text-sm text-muted">{p.unit}</p>
            <p className="mt-4 text-sm">{p.blurb}</p>
            <ul className="my-5 flex-1 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-red" />{f}</li>
              ))}
            </ul>
            {p.external ? (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn-red px-5 py-3 text-center">{p.cta}</a>
            ) : (
              <Link href={p.href} className={p.id === "trial" ? "btn-red px-5 py-3 text-center" : "rounded-md border-2 border-ink px-5 py-3 text-center font-bold hover:bg-ink hover:text-white"}>{p.cta}</Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
