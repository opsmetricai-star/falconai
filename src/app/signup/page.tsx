import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Start free trial" };

export default function Signup() {
  return <AuthForm mode="signup" />;
}
