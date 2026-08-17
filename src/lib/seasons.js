/**
 * Season = one auction year / "project" (e.g. 2026–27).
 * Each season owns its own draft state (roster, board, settings, plan, watchlist).
 */

export const LEGACY_STORAGE_KEY = "ffad-2026-v1";
export const CATALOG_KEY = "awr-seasons-v1";

export const EMPTY_ASST = { name: "", pos: "", team: "", bye: "", proj: "", presetMax: "", bid: "" };
export const DEFAULT_PLAN = { QB: 15, RB: 75, WR: 80, TE: 12, K: 1, DEF: 2, Bench: 15 };

/** "2026" → "2026–27" */
export function seasonLabel(startYear) {
  const y = Number(startYear);
  const end = String((y + 1) % 100).padStart(2, "0");
  return `${y}–${end}`;
}

export function seasonId(startYear) {
  return `${Number(startYear)}-${String((Number(startYear) + 1) % 100).padStart(2, "0")}`;
}

/** Shortlist of players to chase in the auction. Not the legacy board `targets` list. */
export function normalizeWatchlist(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    if (item == null) continue;
    const name = (typeof item === "string" ? item : item.name || "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (typeof item === "string") {
      out.push({ name });
      continue;
    }
    out.push({
      name,
      pos: item.pos || "",
      team: item.team || "",
      bye: item.bye ?? null,
    });
  }
  return out;
}

export function emptyDraftState(settings) {
  return {
    players: [],
    board: {},
    nextPick: 1,
    assistant: { ...EMPTY_ASST },
    plan: { ...DEFAULT_PLAN },
    watchlist: [],
    view: "room",
    settings: settings || null,
  };
}

export function createSeason({ startYear, settings, name } = {}) {
  const y = Number(startYear) || new Date().getFullYear();
  const id = seasonId(y);
  const draft = emptyDraftState(settings);
  return {
    id,
    name: name || `${seasonLabel(y)} Season`,
    startYear: y,
    label: seasonLabel(y),
    createdAt: new Date().toISOString(),
    ...draft,
    settings: settings || draft.settings,
  };
}

export function createCatalog(seedSeason) {
  const season = seedSeason || createSeason({ startYear: 2026 });
  return {
    version: 1,
    activeSeasonId: season.id,
    seasons: { [season.id]: season },
  };
}

/** Wrap a flat legacy save into a 2026–27 season catalog. */
export function migrateLegacy(flat) {
  const season = createSeason({
    startYear: 2026,
    name: "2026–27 Season",
    settings: flat?.settings || null,
  });
  if (Array.isArray(flat?.players)) season.players = flat.players;
  if (flat?.board && typeof flat.board === "object") season.board = flat.board;
  if (typeof flat?.nextPick === "number") season.nextPick = flat.nextPick;
  if (flat?.assistant && typeof flat.assistant === "object") {
    season.assistant = { ...EMPTY_ASST, ...flat.assistant };
  }
  if (flat?.plan && typeof flat.plan === "object") {
    season.plan = { ...DEFAULT_PLAN, ...flat.plan };
  }
  season.watchlist = normalizeWatchlist(flat?.watchlist);
  if (typeof flat?.view === "string") season.view = flat.view;
  return createCatalog(season);
}

export function listSeasons(catalog) {
  return Object.values(catalog.seasons || {}).sort((a, b) => b.startYear - a.startYear);
}

export function getActiveSeason(catalog) {
  if (!catalog?.seasons) return null;
  return catalog.seasons[catalog.activeSeasonId] || listSeasons(catalog)[0] || null;
}

/** Copy league settings into a fresh empty season for the next year. */
export function createNextSeason(fromSeason) {
  const nextYear = (fromSeason?.startYear || 2026) + 1;
  return createSeason({
    startYear: nextYear,
    settings: fromSeason?.settings ? structuredClone(fromSeason.settings) : null,
    name: `${seasonLabel(nextYear)} Season`,
  });
}

export function upsertSeason(catalog, season) {
  return {
    ...catalog,
    seasons: { ...catalog.seasons, [season.id]: season },
  };
}

export function setActiveSeasonId(catalog, id) {
  if (!catalog.seasons[id]) return catalog;
  return { ...catalog, activeSeasonId: id };
}

export function seasonDraftSlice(season) {
  return {
    players: season.players || [],
    board: season.board || {},
    nextPick: typeof season.nextPick === "number" ? season.nextPick : 1,
    assistant: { ...EMPTY_ASST, ...(season.assistant || {}) },
    plan: { ...DEFAULT_PLAN, ...(season.plan || {}) },
    watchlist: normalizeWatchlist(season.watchlist),
    view: season.view || "room",
    settings: season.settings || null,
  };
}

export function applyDraftToSeason(season, draft) {
  return {
    ...season,
    players: draft.players,
    board: draft.board,
    nextPick: draft.nextPick,
    assistant: draft.assistant,
    plan: draft.plan,
    watchlist: normalizeWatchlist(draft.watchlist),
    view: draft.view,
    settings: draft.settings,
  };
}
