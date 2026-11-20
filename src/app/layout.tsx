import type { Metadata } from "next";
import { Kumbh_Sans, Figtree } from "next/font/google";
import "./globals.css";

const display = Kumbh_Sans({ subsets: ["latin"], variable: "--f-display", weight: ["400", "600", "700", "800"] });
const body = Figtree({ subsets: ["latin"], variable: "--f-body" });

export const metadata: Metadata = {
  title: { default: "FalconAI: AI-native security operations to stop breaches", template: "%s | FalconAI" },
  description:
    "FalconAI unifies detection, investigation and response in one AI-native platform for the agentic enterprise.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
