"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isConfigured } from "@/lib/supabase/env";
import { Logo } from "./Logo";

type Mode = "login" | "signup" | "forgot" | "reset";
const COPY: Record<Mode, { title: string; cta: string }> = {
  login: { title: "Log in to FalconAI", cta: "Log in" },
  signup: { title: "Start your 15-day free trial", cta: "Create account" },
  forgot: { title: "Reset your password", cta: "Send reset link" },
  reset: { title: "Choose a new password", cta: "Update password" },
};

export function AuthForm({ mode, next = "/dashboard", notice }: { mode: Mode; next?: string; notice?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const configured = isConfigured();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!configured) return setErr("Supabase is not configured. Add the keys from .env.example.");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    setBusy(true);
    const sb = createClient();
    const origin = window.location.origin;
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
        router.refresh();
      } else if (mode === "signup") {
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: String(f.get("name") ?? ""), company: String(f.get("company") ?? "") },
            emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
          },
        });
        if (error) throw error;
        if (data.session) {
          router.replace("/dashboard");
          router.refresh();
        } else setMsg("Check your email to confirm your account, then log in.");
      } else if (mode === "forgot") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
        if (error) throw error;
        setMsg("If that email has an account, a reset link is on its way.");
      } else {
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { error } = await sb.auth.updateUser({ password });
        if (error) throw error;
        router.replace("/dashboard");
      }
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-line px-4 py-3 outline-none focus:border-red focus:ring-2 focus:ring-red/20";
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hex-bg hidden flex-col justify-between p-12 text-white lg:flex">
        <Logo light />
        <div>
          <h2 className="display text-5xl font-extrabold leading-tight">One unified platform to secure the agentic enterprise.</h2>
          <p className="mt-5 max-w-md text-lg text-white/75">Ingest events, catch threats with deterministic rules and let Analyst AI explain what matters.</p>
        </div>
        <p className="text-sm text-white/50">© {new Date().getFullYear()} FalconAI</p>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="display text-3xl font-extrabold">{COPY[mode].title}</h1>
          {notice && <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}
          {!configured && <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">Supabase environment variables are not set, so authentication is disabled in this build.</p>}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <input name="name" required placeholder="Full name" autoComplete="name" className={input} />
                <input name="company" placeholder="Company" autoComplete="organization" className={input} />
              </>
            )}
            {mode !== "reset" && <input name="email" type="email" required placeholder="Work email" autoComplete="email" className={input} />}
            {mode !== "forgot" && <input name="password" type="password" required minLength={mode === "login" ? 1 : 8} placeholder={mode === "reset" ? "New password" : "Password"} autoComplete={mode === "login" ? "current-password" : "new-password"} className={input} />}
            {err && <p role="alert" className="text-sm text-red">{err}</p>}
            {msg && <p role="status" className="text-sm text-green-700">{msg}</p>}
            <button disabled={busy} className="btn-red w-full py-3 disabled:opacity-60">{busy ? "Please wait…" : COPY[mode].cta}</button>
          </form>
          <div className="mt-6 space-y-2 text-sm text-muted">
            {mode === "login" && (<><p><Link href="/forgot-password" className="text-red underline">Forgot password?</Link></p><p>New here? <Link href="/signup" className="text-red underline">Start free trial</Link></p></>)}
            {mode === "signup" && <p>Already have an account? <Link href="/login" className="text-red underline">Log in</Link></p>}
            {(mode === "forgot" || mode === "reset") && <p><Link href="/login" className="text-red underline">Back to log in</Link></p>}
          </div>
        </div>
      </div>
    </div>
  );
}
