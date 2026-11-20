import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Log in" };

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; setup?: string; error?: string }> }) {
  const sp = await searchParams;
  return <AuthForm mode="login" next={sp.next} notice={sp.error ? "Authentication failed. Please try again." : undefined} />;
}
