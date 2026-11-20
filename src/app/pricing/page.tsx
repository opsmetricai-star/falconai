import Link from "next/link";
import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { PublicShell, FinalCta, SectionHead, RedButton } from "@/components/ui";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = { title: "Pricing" };

const MATRIX: [string, boolean[]][] = [
  ["Detections & event ingest", [true, true, true, true]],
  ["Asset inventory", [true, true, true, true]],
  ["Threat intelligence lookups", [true, true, true, true]],
  ["Incidents & reports", [true, true, true, true]],
  ["Analyst AI", [true, true, true, true]],
  ["API ingest keys", [false, false, true, true]],
  ["SSO & audit exports", [false, false, false, true]],
  ["Dedicated support", [false, false, false, true]],
];

const FAQ = [
  ["Are there extra fees besides the plan price?", "No. The price shown is the full price for the plan. Enterprise terms are quoted individually."],
  ["How does the free trial work?", "Sign up and you get a 15-day workspace with 10 AI analyst credits. No credit card is required."],
  ["How do I pay and when is my plan activated?", "Buttons open our secure checkout page. Your plan is activated once the payment is confirmed by our payment webhook or by an administrator, not simply because you returned from checkout."],
  ["Can I upgrade later?", "Yes. Purchase a higher plan from the Billing page in your dashboard at any time."],
  ["What sources can I connect?", "Anything that can send JSON over HTTPS to the ingest API, plus CSV upload from the dashboard."],
  ["What support is included?", "Go and Pro include email support. Enterprise adds a dedicated contact."],
];

export default function PricingPage() {
  return (
    <PublicShell>
      <section className="px-6 pb-8 pt-16 text-center">
        <h1 className="display mx-auto max-w-3xl text-4xl font-extrabold sm:text-6xl">Tailored bundles to stop breaches</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">Flexible pricing, your way. Start free and upgrade when you are ready.</p>
      </section>
      <section className="mx-auto max-w-[1280px] px-6 pb-20 pt-8"><PricingCards /></section>

      <section className="bg-soft px-6 py-20">
        <SectionHead title="Compare all bundles" />
        <div className="mx-auto mt-10 max-w-5xl overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead><tr className="border-b border-line"><th className="p-4" />{["Free Trial", "Go", "Pro", "Enterprise"].map((h) => <th key={h} className="p-4 font-bold">{h}</th>)}</tr></thead>
            <tbody>
              {MATRIX.map(([name, v]) => (
                <tr key={name} className="border-b border-line last:border-0">
                  <td className="p-4 font-medium">{name}</td>
                  {v.map((x, i) => <td key={i} className="p-4">{x ? <Check size={18} className="text-red" /> : <Minus size={18} className="text-muted/50" />}</td>)}
                </tr>
              ))}
              <tr><td className="p-4 font-medium">Assets / AI credits per month</td><td className="p-4">25 / 10</td><td className="p-4">100 / 100</td><td className="p-4">1,000 / 500</td><td className="p-4">Unlimited / custom</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-6 py-20">
        <SectionHead title="Need help customizing a plan or financing?" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {[["Flex Licensing", "Access the whole portfolio and swap modules as needs change.", "/pricing/flex"], ["Financing", "Financing tailored to your business.", "/pricing/financing"]].map(([t, b, h]) => (
            <div key={t} className="rounded-xl border border-line p-8"><h3 className="display text-2xl font-bold">{t}</h3><p className="mt-3 text-muted">{b}</p><div className="mt-6 flex gap-4 text-sm font-bold"><Link href={h} className="text-red underline">Learn more</Link><Link href="/contact-us" className="underline">Contact us</Link></div></div>
          ))}
        </div>
      </section>

      <section className="bg-soft px-6 py-20">
        <SectionHead title="Frequently asked questions" />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-line rounded-xl bg-white">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-5"><summary className="cursor-pointer list-none font-bold">{q}</summary><p className="mt-3 text-muted">{a}</p></details>
          ))}
        </div>
        <div className="mt-10 text-center"><RedButton href="/signup">Start free trial</RedButton></div>
      </section>
      <FinalCta />
    </PublicShell>
  );
}
