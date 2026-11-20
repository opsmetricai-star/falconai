import { notFound } from "next/navigation";
import { PublicShell } from "@/components/ui";

const DOCS: Record<string, { title: string; body: string[] }> = {
  privacy: { title: "Privacy Notice", body: ["We collect account details, workspace data you submit and usage metrics to operate FalconAI.", "Workspace data is isolated per account using row-level security. We do not sell personal data.", "AI features send the minimum event context needed to the configured AI provider to generate a result.", "This is a template notice. Have counsel review it before launch."] },
  cookies: { title: "Cookie Notice", body: ["We use essential cookies for authentication sessions. We do not use advertising cookies.", "This is a template notice. Have counsel review it before launch."] },
  terms: { title: "Terms of Use", body: ["By using FalconAI you agree to use it lawfully and only on systems you are authorized to monitor.", "Plans are activated after verified payment. Service is provided as-is during early access.", "This is a template. Have counsel review it before launch."] },
  accessibility: { title: "Accessibility", body: ["We aim to meet WCAG 2.1 AA. Contact us if you encounter a barrier."] },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}
export const dynamicParams = false;

export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const d = DOCS[(await params).doc];
  if (!d) notFound();
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-6 py-20" id="choices">
        <h1 className="display text-4xl font-extrabold">{d.title}</h1>
        {d.body.map((p) => <p key={p} className="mt-5 text-lg text-muted">{p}</p>)}
      </article>
    </PublicShell>
  );
}
