/**
 * Season = one auction year / "project" (e.g. 2026–27).
 * Each season owns its own draft state (roster, board, settings, plan, targets).
 * `targets` is the Plan-tab nomination list: [{ name, pos, team, bye }].
 * Older saves used `targets` as the big board (status / priority); those are
 * migrated onto `board` and stripped from this list.
 */

export const LEGACY_STORAGE_KEY = "ffad-2026-v1";
export const CATALOG_KEY = "awr-seasons-v1";

export const EMPTY_ASST = { name: "", pos: "", team: "", bye: "", proj: "", presetMax: "", bid: "" };
export const DEFAULT_PLAN = { QB: 45, RB: 70, WR: 55, TE: 12, K: 1, DEF: 2, Bench: 15 }; // 2QB superflex

/** "2026" → "2026–27" */
export function seasonLabel(startYear) {
  const y = Number(startYear);
  const end = String((y + 1) % 100).padStart(2, "0");
  return `${y}–${end}`;
}

export function seasonId(startYear) {
  return `${Number(startYear)}-${String((Number(startYear) + 1) % 100).padStart(2, "0")}`;
}

export function emptyDraftState(settings) {
  return {
    players: [],
    board: {},
    nextPick: 1,
    assistant: { ...EMPTY_ASST },
    plan: { ...DEFAULT_PLAN },
    targets: [],
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
  if (Array.isArray(flat?.targets)) season.targets = flat.targets;
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

/** Old board-as-targets rows used `status` and/or `priority`. */
export function isLegacyBoardTargets(targets) {
  return Array.isArray(targets) && targets.some((t) => t && (typeof t.status === "string" || t.priority != null));
}

/** Plan-tab target list. Drops legacy board rows and nameless entries. */
export function normalizePlanTargets(targets) {
  if (!Array.isArray(targets)) return [];
  const seen = new Set();
  const out = [];
  for (const t of targets) {
    if (!t?.name) continue;
    if (typeof t.status === "string" || t.priority != null) continue;
    const key = String(t.name).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name: t.name,
      pos: t.pos || "",
      team: t.team || "",
      bye: t.bye ?? null,
    });
  }
  return out;
}


/** Keep board stars and Plan targets in sync (bidirectional). */
export function syncStarsAndTargets(board, targets, keyFn = (name) => String(name || "").toLowerCase()) {
  const syncedTargets = normalizePlanTargets(targets);
  const targetKeys = new Set(syncedTargets.map((t) => keyFn(t.name)));
  const syncedBoard = { ...(board || {}) };

  Object.values(syncedBoard).forEach((b) => {
    if (!b?.star || !b?.name) return;
    const k = keyFn(b.name);
    if (targetKeys.has(k)) return;
    syncedTargets.push({ name: b.name, pos: b.pos || "", team: b.team || "", bye: b.bye ?? null });
    targetKeys.add(k);
  });

  syncedTargets.forEach((t) => {
    const k = keyFn(t.name);
    const cur = syncedBoard[k];
    syncedBoard[k] = {
      ...(cur || {}),
      name: t.name,
      pos: t.pos || cur?.pos || "",
      team: t.team || cur?.team || "",
      bye: t.bye ?? cur?.bye ?? null,
      star: true,
      status: cur?.status || "available",
      price: cur?.price ?? null,
      injuryNote: cur?.injuryNote,
    };
  });

  return { board: syncedBoard, targets: normalizePlanTargets(syncedTargets) };
}

export function seasonDraftSlice(season) {
  return {
    players: season.players || [],
    board: season.board || {},
    nextPick: typeof season.nextPick === "number" ? season.nextPick : 1,
    assistant: { ...EMPTY_ASST, ...(season.assistant || {}) },
    plan: { ...DEFAULT_PLAN, ...(season.plan || {}) },
    targets: normalizePlanTargets(season.targets),
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
    targets: Array.isArray(draft.targets) ? normalizePlanTargets(draft.targets) : normalizePlanTargets(season.targets),
    view: draft.view,
    settings: draft.settings,
  };
}
