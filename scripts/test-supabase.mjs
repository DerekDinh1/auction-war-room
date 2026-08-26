#!/usr/bin/env node
/** Verify Supabase URL, anon key, and season_sync RPCs. Requires .env.local */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const env = { ...process.env, ...loadEnvLocal() };
const url = env.VITE_SUPABASE_URL || "";
const anon = env.VITE_SUPABASE_ANON_KEY || "";

if (!url || !anon || url.includes("YOUR_PROJECT")) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local");
  console.error("Copy .env.example → .env.local and fill values from Supabase → Settings → API");
  process.exit(1);
}

const sb = createClient(url, anon, { auth: { persistSession: false } });
const testHash = "a".repeat(64);
const testPayload = { version: 1, seasonId: "test-connection", draft: { players: [], board: {}, nextPick: 1 } };

console.log("Testing:", url.replace(/^(https:\/\/[^.]+).*/, "$1…"));

const { error: upErr } = await sb.rpc("upsert_season_sync", {
  p_hash: testHash,
  p_season_id: "test-connection",
  p_payload: testPayload,
});
if (upErr) {
  console.error("upsert_season_sync FAILED:", upErr.message);
  if (/function|schema cache/i.test(upErr.message)) console.error("→ Run supabase/schema.sql in Supabase SQL editor");
  process.exit(1);
}
console.log("upsert_season_sync OK");

const { data: row, error: fetchErr } = await sb.rpc("fetch_season_sync", { p_hash: testHash });
if (fetchErr || !row?.payload) {
  console.error("fetch_season_sync FAILED:", fetchErr?.message || "empty response");
  process.exit(1);
}
console.log("fetch_season_sync OK");
console.log("\nSupabase sync is ready. Restart npm run dev → Settings → Enable sync.");
