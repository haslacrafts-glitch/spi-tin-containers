import { NextResponse } from "next/server";
import { getSupabasePublic, supabaseConfigured } from "@/lib/supabase/public";
import { recordKeepalive } from "@/lib/keepalive";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  try {
    const db = getSupabasePublic();
    const ping = await recordKeepalive(db, "site-cron", "auto keepalive");
    return NextResponse.json({ ok: true, ...ping });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Keepalive failed." }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
