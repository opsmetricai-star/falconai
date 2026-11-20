import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hashKey, newKey } from "@/lib/keys";

export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: p } = await sb.from("profiles").select("plan").eq("id", user.id).single();
  if (!p || !["pro", "enterprise"].includes(p.plan)) return NextResponse.json({ error: "API keys are available on Pro and Enterprise." }, { status: 403 });
  const body = z.object({ name: z.string().trim().min(1).max(80) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Name required." }, { status: 400 });
  const key = newKey();
  const { error } = await sb.from("api_keys").insert({ user_id: user.id, name: body.data.name, prefix: key.slice(0, 10), key_hash: hashKey(key) });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ key });
}
