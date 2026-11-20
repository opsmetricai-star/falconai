import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string; email: string | null; full_name: string | null; company: string | null;
  plan: "trial" | "go" | "pro" | "enterprise"; trial_ends_at: string; plan_activated_at: string | null;
  ai_credits_used: number; credits_period_start: string; is_admin: boolean;
};

export async function requireUser() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login?error=auth");
  return { sb, user, profile: profile as Profile };
}

export function trialDaysLeft(p: Profile) {
  return Math.max(0, Math.ceil((new Date(p.trial_ends_at).getTime() - Date.now()) / 86_400_000));
}
