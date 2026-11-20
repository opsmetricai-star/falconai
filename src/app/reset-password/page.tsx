import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Reset password" };

export default function Reset() {
  return <AuthForm mode="reset" />;
}
