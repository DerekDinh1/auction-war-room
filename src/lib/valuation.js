import { norm } from "./names.js";
import { isSuperflexLeague } from "./league.js";
import { RAW_DB, POS_RANK, OVERALL_RANK } from "../data/players.js";

/* ---------- estimated auction values (12-team, $200; DB is roughly rank-ordered) ---------- */

/** Auction $ estimate; pass league settings for 2QB/superflex QB premium. */
export function estValue(pos, name, settings = null) {
  const r = POS_RANK[norm(name)];
  if (!r) return null;
  const sf = isSuperflexLeague(settings);
  let v;
  if (pos === "RB" || pos === "WR") {
    v = (sf ? 58 : 62) * Math.exp(-0.085 * (r - 1));
  } else if (pos === "QB") {
    v = sf
      ? 62 * Math.exp(-0.095 * (r - 1))   // 2QB: Allen ~$62, QB12 ~$23, QB24 ~$8
      : 26 * Math.exp(-0.2 * (r - 1));
  } else if (pos === "TE") {
    v = 30 * Math.exp(-0.3 * (r - 1));
  } else {
    v = r <= 3 ? 2 : 1;
  }
  return Math.max(1, Math.round(v));
}

/** Value-based draft order for superflex; falls back to consensus overall rank in 1QB. */
export function buildDraftRank(settings) {
  if (!isSuperflexLeague(settings)) return OVERALL_RANK;
  const entries = RAW_DB.map(([name, pos]) => ({
    key: norm(name),
    est: estValue(pos, name, settings) || 0,
    consensus: OVERALL_RANK[norm(name)] || 9999,
  }));
  entries.sort((a, b) => b.est - a.est || a.consensus - b.consensus || a.key.localeCompare(b.key));
  const map = {};
  entries.forEach((e, i) => { map[e.key] = i + 1; });
  return map;
}

export const tierOf = (name) => { const r = POS_RANK[norm(name)]; return r ? Math.ceil(r / 6) : null; };
