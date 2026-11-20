"use client";
import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("busy");
    const body = Object.fromEntries(new FormData(form));
    const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) {
      setState("ok");
      form.reset();
    } else {
      setErr((await r.json().catch(() => ({}))).error ?? "Could not send your message.");
      setState("err");
    }
  }
  const input = "w-full rounded-md border border-line px-4 py-3 outline-none focus:border-red focus:ring-2 focus:ring-red/20";
  if (state === "ok") return <p role="status" className="rounded-lg bg-green-50 p-6 text-green-800">Thanks. Your message has been received and we will reply by email.</p>;
  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="name" required placeholder="Full name" className={input} />
      <input name="email" type="email" required placeholder="Work email" className={input} />
      <input name="company" placeholder="Company" className={input} />
      <select name="topic" className={input} defaultValue="Sales"><option>Sales</option><option>Demo</option><option>Support</option><option>Incident response</option><option>Partnerships</option></select>
      <textarea name="message" required rows={5} placeholder="How can we help?" className={input} />
      {state === "err" && <p role="alert" className="text-sm text-red">{err}</p>}
      <button disabled={state === "busy"} className="btn-red px-8 py-3 disabled:opacity-60">{state === "busy" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
