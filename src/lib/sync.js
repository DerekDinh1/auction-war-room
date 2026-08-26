import { getSupabase, isSupabaseConfigured } from "./supabase.js";
import { storageGet, storageSet, storageDelete } from "./storage.js";
import { normalizePlanTargets, DEFAULT_PLAN } from "./seasons.js";

export const SYNC_CODE_KEY = "awr-sync-code";
export const SYNC_META_KEY = "awr-sync-meta"; // { lastPulledAt, lastPushedAt, lastRemoteUpdatedAt }

const PAYLOAD_VERSION = 1;

export { isSupabaseConfigured };

function bytesToHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashSyncCode(code) {
  const cleaned = normalizeSyncCode(code);
  const data = new TextEncoder().encode(`awr-sync-v1:${cleaned}`);
  const dig = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(dig);
}

export function normalizeSyncCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function formatSyncCode(code) {
  const c = normalizeSyncCode(code);
  if (c.length !== 16) return c;
  return `AWR-${c.slice(0, 4)}-${c.slice(4, 8)}-${c.slice(8, 12)}-${c.slice(12, 16)}`;
}

export function generateSyncCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let out = "";
  for (let i = 0; i < 16; i++) out += alphabet[bytes[i] % alphabet.length];
  return formatSyncCode(out);
}

export async function loadStoredSyncCode() {
  const raw = await storageGet(SYNC_CODE_KEY);
  return raw ? formatSyncCode(raw) : null;
}

export async function saveStoredSyncCode(code) {
  await storageSet(SYNC_CODE_KEY, normalizeSyncCode(code));
}

export async function clearStoredSyncCode() {
  await storageDelete(SYNC_CODE_KEY);
  await storageDelete(SYNC_META_KEY);
}

export async function loadSyncMeta() {
  try {
    const raw = await storageGet(SYNC_META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveSyncMeta(patch) {
  const prev = await loadSyncMeta();
  const next = { ...prev, ...patch };
  await storageSet(SYNC_META_KEY, JSON.stringify(next));
  return next;
}

export function buildActiveSeasonPayload({ season, draft }) {
  return {
    version: PAYLOAD_VERSION,
    seasonId: season?.id || null,
    seasonLabel: season?.label || null,
    seasonName: season?.name || null,
    startYear: season?.startYear || null,
    exportedAt: new Date().toISOString(),
    draft: {
      players: draft.players || [],
      board: draft.board || {},
      nextPick: draft.nextPick ?? 1,
      assistant: draft.assistant || {},
      plan: draft.plan || { ...DEFAULT_PLAN },
      settings: draft.settings || null,
      targets: normalizePlanTargets(draft.targets),
      view: draft.view || "room",
    },
  };
}

export function archiveSeasonFilename(season) {
  const label = (season?.label || "season").replace(/[–—]/g, "-");
  const day = new Date().toISOString().slice(0, 10);
  return `auction-war-room-archive-${label}-${day}.json`;
}

/** Download a reference backup of a finished season (local file only). */
export function downloadSeasonArchive(season, draft) {
  const payload = {
    version: 5,
    kind: "season-archive",
    archivedAt: new Date().toISOString(),
    season: {
      id: season?.id || null,
      name: season?.name || null,
      label: season?.label || null,
      startYear: season?.startYear || null,
      createdAt: season?.createdAt || null,
    },
    players: draft.players || [],
    board: draft.board || {},
    nextPick: draft.nextPick ?? 1,
    assistant: draft.assistant || {},
    plan: draft.plan || { ...DEFAULT_PLAN },
    settings: draft.settings || null,
    targets: normalizePlanTargets(draft.targets),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = archiveSeasonFilename(season);
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function pushActiveSeason({ code, season, draft }) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured on this deploy.");
  const hash = await hashSyncCode(code);
  const payload = buildActiveSeasonPayload({ season, draft });
  const { data, error } = await sb.rpc("upsert_season_sync", {
    p_hash: hash,
    p_season_id: season?.id || "",
    p_payload: payload,
  });
  if (error) throw error;
  const updatedAt = data?.updated_at || new Date().toISOString();
  await saveSyncMeta({ lastPushedAt: new Date().toISOString(), lastRemoteUpdatedAt: updatedAt });
  return { updatedAt, payload };
}

export async function pullActiveSeason(code) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured on this deploy.");
  const hash = await hashSyncCode(code);
  const { data, error } = await sb.rpc("fetch_season_sync", { p_hash: hash });
  if (error) throw error;
  if (!data) return null;
  await saveSyncMeta({
    lastPulledAt: new Date().toISOString(),
    lastRemoteUpdatedAt: data.updated_at,
  });
  return {
    seasonId: data.season_id,
    updatedAt: data.updated_at,
    payload: data.payload,
  };
}
