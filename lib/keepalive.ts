import type { SupabaseClient } from "@supabase/supabase-js";

export async function recordKeepalive(db: SupabaseClient, source: string, message = "auto ping") {
  const now = new Date().toISOString();
  const { data: current } = await db.from("db_keepalive").select("ping_count").eq("id", 1).maybeSingle();
  const ping_count = Number(current?.ping_count || 0) + 1;

  const { error: upErr } = await db
    .from("db_keepalive")
    .upsert({
      id: 1,
      message,
      source,
      ping_count,
      last_ping_at: now,
    });
  if (upErr) throw new Error(upErr.message);

  const { error: logErr } = await db.from("db_keepalive_log").insert({ message, source });
  if (logErr) throw new Error(logErr.message);

  await db
    .from("db_keepalive_log")
    .delete()
    .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  return { ping_count, last_ping_at: now, source, message };
}
