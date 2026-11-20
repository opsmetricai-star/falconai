import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

export function RedButton({ href, children, outline = false, external = false }: { href: string; children: React.ReactNode; outline?: boolean; external?: boolean }) {
  const cls = outline
    ? "inline-flex items-center gap-3 rounded-md border-2 border-white px-6 py-3 font-bold text-white hover:bg-white hover:text-ink transition"
    : "btn-red inline-flex items-center gap-3 px-6 py-3";
  const inner = (
    <>
      {children}
      <ArrowRight size={16} />
    </>
  );
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

export function FinalCta() {
  return (
    <section className="red-gradient px-6 py-20 text-center text-white">
      <h2 className="display mx-auto max-w-3xl text-3xl font-extrabold sm:text-5xl">Try FalconAI free for 15 days</h2>
      <p className="mx-auto mt-4 max-w-xl text-white/90">No credit card required. Connect your first assets and see detections in minutes.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/signup" className="inline-flex items-center gap-3 rounded-md bg-white px-6 py-3 font-bold text-red hover:bg-ink hover:text-white transition">
          Start free trial <ArrowRight size={16} />
        </Link>
        <RedButton href="/contact-us" outline>Contact us</RedButton>
        <RedButton href="/pricing" outline>View pricing</RedButton>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, body, center = true, dark = false }: { eyebrow?: string; title: string; body?: string; center?: boolean; dark?: boolean }) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-wider text-red">{eyebrow}</p>}
      <h2 className={`display text-3xl font-extrabold leading-tight sm:text-[42px] ${dark ? "text-white" : ""}`}>{title}</h2>
      {body && <p className={`mt-4 text-lg ${dark ? "text-white/75" : "text-muted"}`}>{body}</p>}
    </div>
  );
}
