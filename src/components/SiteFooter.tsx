import Link from "next/link";
import { FOOTER } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Logo light />
            <p className="mt-4 text-sm text-white/70">AI-native security operations for the agentic enterprise.</p>
            <div className="mt-5 flex gap-4 text-sm text-white/70">
              {["LinkedIn", "X", "Instagram", "YouTube"].map((s) => (
                <span key={s} className="cursor-default hover:text-white">{s}</span>
              ))}
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:pl-12">
            {FOOTER.map((c) => (
              <div key={c.title}>
                <h3 className="mb-4 text-sm font-bold">{c.title}</h3>
                <ul className="space-y-2.5 text-sm text-white/70">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <span>Copyright © {new Date().getFullYear()} FalconAI. All rights reserved.</span>
          <div className="flex flex-wrap gap-5">
            <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/legal/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/legal/privacy#choices" className="hover:text-white">Your Privacy Choices</Link>
            <Link href="/legal/terms" className="hover:text-white">Terms of Use</Link>
            <Link href="/legal/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
