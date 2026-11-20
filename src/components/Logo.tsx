import Link from "next/link";

export function LogoMark({ className = "h-6 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 28" className={className} fill="currentColor" aria-hidden>
      <path d="M0 4c6 0 10 2 14 6l6 6c3 3 7 4 12 4-2 2-5 4-9 4-5 0-8-2-11-5L4 11C3 9 2 6 0 4z" />
      <path d="M12 2c5-1 10 0 14 3l8 7c-5-1-9-1-13-4-3-2-6-5-9-6z" opacity=".75" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${light ? "text-white" : "text-ink"}`} aria-label="FalconAI home">
      <LogoMark className="h-6 w-7 text-red" />
      <span className="display text-[17px] font-extrabold tracking-[0.04em]">
        FALCON<span className="text-red">AI</span>
      </span>
    </Link>
  );
}
