"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  { cls: "hero-slide-a", cat: "Agentic SOC", title: "Triage every alert at machine speed", body: "Analyst AI investigates each detection, cites its evidence and drafts the next step for your team.", cta: "Learn more", href: "/platform/analyst-ai" },
  { cls: "hero-slide-b", cat: "Virtual event", title: "AI Security and Safety: The Agent State Has Arrived", body: "Join our researchers for a look at how autonomous agents change attack and defense.", cta: "Register now", href: "/resources/webinars" },
  { cls: "hero-slide-c", cat: "AI Detection & Response", title: "Secure AI agents where they execute", body: "Runtime guardrails and an instant kill switch for agents on endpoints and in the cloud.", cta: "Learn more", href: "/platform/ai-detection-response" },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i];
  return (
    <section className={`${s.cls} relative min-h-[420px] overflow-hidden text-white transition-colors`} aria-roledescription="carousel">
      <div className="mx-auto flex min-h-[420px] max-w-[1280px] flex-col justify-center px-6 pb-16 pt-12" key={i}>
        <p className="fade-up text-sm font-bold uppercase tracking-widest text-white/80">{s.cat}</p>
        <h1 className="fade-up mt-3 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">{s.title}</h1>
        <p className="fade-up mt-5 max-w-xl text-lg text-white/85">{s.body}</p>
        <div className="fade-up mt-8">
          <Link href={s.href} className="btn-red inline-flex items-center gap-3 px-6 py-3">
            {s.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-5">
        {SLIDES.map((_, n) => (
          <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={`h-2 w-2 rounded-full ${n === i ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
    </section>
  );
}
