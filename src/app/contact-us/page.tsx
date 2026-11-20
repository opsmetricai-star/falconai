import type { Metadata } from "next";
import { PublicShell } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact us" };

export default function Contact() {
  return (
    <PublicShell>
      <section className="hex-bg px-6 py-20 text-white">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="display text-4xl font-extrabold sm:text-6xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-xl text-white/80">Questions about plans, a demo, or a security incident? Tell us how we can help.</p>
        </div>
      </section>
      <section className="mx-auto max-w-2xl px-6 py-16"><ContactForm /></section>
    </PublicShell>
  );
}
