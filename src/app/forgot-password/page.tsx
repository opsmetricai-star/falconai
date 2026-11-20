import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Forgot password" };

export default function Forgot() {
  return <AuthForm mode="forgot" />;
}
