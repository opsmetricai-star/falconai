"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Search, CalendarDays, User, ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, UTILITY } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [banner, setBanner] = useState(true);
  const [mAcc, setMAcc] = useState<string | null>(null);

  return (
    <header className="relative z-50 bg-white" onMouseLeave={() => setOpen(null)}>
      {banner && (
        <div className="relative flex min-h-[34px] items-center justify-center bg-red px-10 py-1.5 text-center text-[13px] font-bold text-white sm:text-sm">
          <span>
            Agentic SOC is here: See how AI triage cuts investigation time |{" "}
            <Link href="/resources/webinars" className="underline">
              Register now
            </Link>
          </span>
          <button aria-label="Dismiss banner" onClick={() => setBanner(false)} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="hidden justify-end gap-0 px-6 pt-3 text-[13px] xl:flex">
        {UTILITY.map((u, i) => (
          <span key={u.href} className="flex items-center">
            {i > 0 && <span className="mx-4 text-ink/70">|</span>}
            <Link href={u.href} className="hover:text-red">
              {u.label}
            </Link>
          </span>
        ))}
      </div>

      <div className="flex h-[74px] items-center justify-between gap-4 px-5 xl:px-6">
        <div className="flex items-center gap-8 xl:gap-10">
          <Logo />
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {NAV.map((n) => (
              <div key={n.label} onMouseEnter={() => setOpen(n.label)} className="relative">
                <button
                  className={`flex items-center gap-1 whitespace-nowrap px-2 py-6 text-[14px] xl:px-3 xl:text-[15px] hover:text-red ${open === n.label ? "text-red" : ""}`}
                  aria-expanded={open === n.label}
                  onClick={() => setOpen(open === n.label ? null : n.label)}
                >
                  {n.label}
                  <ChevronDown size={15} className={`transition ${open === n.label ? "rotate-180" : ""}`} />
                </button>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/resources" aria-label="Search" className="hidden xl:block"><Search size={20} /></Link>
          <Link href="/resources/webinars" aria-label="Events" className="hidden xl:block"><CalendarDays size={20} /></Link>
          <Link href="/login" aria-label="Login" className="hidden xl:block"><User size={20} /></Link>
          <Link href="/pricing" aria-label="Pricing" className="hidden xl:block"><ShoppingCart size={20} /></Link>
          <Link href="/signup" className="btn-red hidden items-center gap-6 px-4 py-2.5 text-[15px] leading-tight sm:flex">
            <span>Start free<br />trial</span>
            <ArrowRight size={16} />
          </Link>
          <button className="xl:hidden" aria-label="Menu" onClick={() => setMobile(!mobile)}>
            {mobile ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* mega menu */}
      {open && (
        <div className="drop-in absolute left-0 right-0 top-full hidden border-t border-line bg-white shadow-xl xl:block">
          {NAV.filter((n) => n.label === open).map((n) => (
            <div key={n.label} className="mx-auto flex max-w-[1280px] gap-12 px-10 py-9">
              {n.groups.map((g) => (
                <div key={g.title} className="min-w-[200px] flex-1">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{g.title}</p>
                  <ul className="space-y-2.5">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} onClick={() => setOpen(null)} className="text-[15px] hover:text-red">
                          {l.label}
                          {l.badge && <span className="ml-2 rounded bg-red px-1.5 py-0.5 text-[10px] font-bold text-white">{l.badge}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {n.href && (
                <div className="hidden w-60 shrink-0 rounded-lg bg-ink p-5 text-white xl:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-red">Explore</p>
                  <p className="display mt-2 text-lg font-bold leading-snug">See everything in {n.label}</p>
                  <Link href={n.href} onClick={() => setOpen(null)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline">
                    View overview <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* mobile drawer */}
      {mobile && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-5 pb-6 xl:hidden">
          {NAV.map((n) => (
            <div key={n.label} className="border-b border-line">
              <button className="flex w-full items-center justify-between py-4 text-left text-lg" onClick={() => setMAcc(mAcc === n.label ? null : n.label)}>
                {n.label}
                <ChevronDown className={mAcc === n.label ? "rotate-180" : ""} size={18} />
              </button>
              {mAcc === n.label && (
                <div className="pb-4">
                  {n.groups.map((g) => (
                    <div key={g.title} className="mb-3">
                      <p className="mb-1 text-xs font-bold uppercase text-muted">{g.title}</p>
                      {g.links.map((l) => (
                        <Link key={l.href} href={l.href} onClick={() => setMobile(false)} className="block py-1.5 text-[15px]">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-5 flex gap-3">
            <Link href="/login" className="flex-1 rounded border border-ink py-3 text-center font-bold">Login</Link>
            <Link href="/signup" className="btn-red flex-1 py-3 text-center">Start free trial</Link>
          </div>
        </div>
      )}
    </header>
  );
}
