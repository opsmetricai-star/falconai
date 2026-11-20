import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/supabase/env";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(200).optional(),
  topic: z.string().trim().max(60).optional(),
  message: z.string().trim().min(5).max(4000),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete all required fields with valid values." }, { status: 400 });
  if (!isConfigured()) return NextResponse.json({ error: "Messaging is not configured yet." }, { status: 503 });
  const sb = await createClient();
  const { error } = await sb.from("contact_messages").insert(parsed.data);
  if (error) return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
