/* League settings, teams, roster slots, and bye-week helpers. */

export const DEFAULT_SETTINGS = {
  budget: 200,
  teams: 12,
  starters: { QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1, SUPERFLEX: 1, K: 1, DEF: 1 },
  bench: 4,
  flexEligible: { RB: true, WR: true, TE: true, QB: false, K: false, DEF: false },
  superflexEligible: { QB: true, RB: true, WR: true, TE: true, K: false, DEF: false },
  onlyOne: { QB: false, K: true, DEF: true, RB: false, WR: false, TE: false }, // 2QB: second QB fills SUPERFLEX
};
export const clampInt = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));
export function normalizeSettings(raw) {
  const s = { ...DEFAULT_SETTINGS, ...(raw || {}) };
  s.starters = { ...DEFAULT_SETTINGS.starters, ...(raw?.starters || {}) };
  s.flexEligible = { ...DEFAULT_SETTINGS.flexEligible, ...(raw?.flexEligible || {}) };
  s.superflexEligible = { ...DEFAULT_SETTINGS.superflexEligible, ...(raw?.superflexEligible || {}) };
  s.onlyOne = { ...DEFAULT_SETTINGS.onlyOne, ...(raw?.onlyOne || {}) };
  s.budget = clampInt(s.budget, 1, 10000);
  s.teams = clampInt(s.teams, 2, 32);
  s.bench = clampInt(s.bench, 0, 20);
  Object.keys(s.starters).forEach((k) => { s.starters[k] = clampInt(s.starters[k], 0, 10); });
  return s;
}

// 2026 bye weeks (official schedule, released May 2026)
export const TEAM_BYES = {
  ARI: 14, ATL: 11, BAL: 13, BUF: 7, CAR: 5, CHI: 10, CIN: 6, CLE: 11,
  DAL: 14, DEN: 10, DET: 6, GB: 11, HOU: 8, IND: 13, JAX: 7, KC: 5,
  LV: 13, LAC: 7, LAR: 11, MIA: 6, MIN: 6, NE: 11, NO: 8, NYG: 8,
  NYJ: 13, PHI: 10, PIT: 9, SF: 8, SEA: 11, TB: 10, TEN: 9, WAS: 7,
};
export const TEAMS = Object.keys(TEAM_BYES).sort();
export const TEAM_ALIASES = { JAC: "JAX", WSH: "WAS", ARZ: "ARI", LA: "LAR", OAK: "LV", SD: "LAC", STL: "LAR" };

/** Canonical position list — also the display order. */
export const POSITIONS = ["QB", "RB", "WR", "TE", "K", "DEF"];
export const NEED_POS_PRIORITY = ["RB", "WR", "QB", "TE", "K", "DEF"];

export const PLAN_CATS = ["QB", "RB", "WR", "TE", "K", "DEF", "Bench"];
export const DEFAULT_PLAN = { QB: 45, RB: 70, WR: 55, TE: 12, K: 1, DEF: 2, Bench: 15 }; // 2QB superflex budget split
export const EMPTY_ASST = { name: "", pos: "", team: "", bye: "", proj: "", presetMax: "", bid: "" };
export const EMPTY_FORM = { name: "", pos: "", team: "", bye: "", price: "", proj: "" };
export const BOARD_FILTERS = ["ALL", "QB", "RB", "WR", "TE", "K", "DEF"];

export function isSuperflexLeague(settings) {
  return (settings?.starters?.SUPERFLEX || 0) > 0 && settings?.superflexEligible?.QB !== false;
}

// rough $ each open starting slot should command, by position
export function slotCostEst(settings) {
  const sf = isSuperflexLeague(settings);
  return {
    QB: sf ? 14 : 8,
    RB: 13,
    WR: 12,
    TE: 6,
    FLEX: sf ? 10 : 8,
    SUPERFLEX: 14,
    K: 1,
    DEF: 1,
  };
}

// ---------- roster slots (built from settings) ----------
export function buildRoster(settings) {
  const st = settings.starters;
  const flexAccepts = POSITIONS.filter((p) => settings.flexEligible[p]);
  const superflexAccepts = POSITIONS.filter((p) => settings.superflexEligible?.[p]);
  const slots = [];
  const addMany = (pos, n) => {
    for (let i = 1; i <= n; i++) {
      slots.push({ id: n === 1 ? pos : `${pos}${i}`, label: n === 1 ? pos : `${pos}${i}`, accepts: [pos], starter: true, pos });
    }
  };
  addMany("QB", st.QB);
  addMany("RB", st.RB);
  addMany("WR", st.WR);
  addMany("TE", st.TE);
  for (let i = 1; i <= (st.FLEX || 0); i++) {
    slots.push({ id: st.FLEX === 1 ? "FLEX" : `FLEX${i}`, label: st.FLEX === 1 ? "FLEX" : `FLEX${i}`,
      accepts: flexAccepts.length ? flexAccepts : POSITIONS, starter: true, pos: "FLEX" });
  }
  for (let i = 1; i <= (st.SUPERFLEX || 0); i++) {
    slots.push({ id: st.SUPERFLEX === 1 ? "SUPERFLEX" : `SUPERFLEX${i}`, label: st.SUPERFLEX === 1 ? "SUPERFLEX" : `SUPERFLEX${i}`,
      accepts: superflexAccepts.length ? superflexAccepts : POSITIONS, starter: true, pos: "SUPERFLEX" });
  }
  addMany("K", st.K);
  addMany("DEF", st.DEF);
  for (let i = 1; i <= settings.bench; i++) {
    slots.push({ id: `B${i}`, label: `Bench ${i}`, accepts: POSITIONS, starter: false, pos: "BENCH" });
  }
  const byId = Object.fromEntries(slots.map((x) => [x.id, x]));
  const autoOrder = {};
  POSITIONS.forEach((pos) => {
    autoOrder[pos] = slots.filter((x) => x.starter && x.accepts.includes(pos) && x.pos === pos).map((x) => x.id)
      .concat(slots.filter((x) => x.starter && x.pos === "FLEX" && x.accepts.includes(pos)).map((x) => x.id))
      .concat(slots.filter((x) => x.starter && x.pos === "SUPERFLEX" && x.accepts.includes(pos)).map((x) => x.id));
  });
  const benchIds = slots.filter((x) => !x.starter).map((x) => x.id);
  const size = slots.length;
  return { slots, byId, autoOrder, benchIds, size };
}
/** Compact slot label for narrow columns: SUPERFLEX → SFLX, Bench 3 → BN3. */
export function shortSlotLabel(slot) {
  if (!slot.starter) return slot.id.replace(/^B/, "BN");
  return slot.label.replace(/^SUPERFLEX/, "SFLX");
}
export function autoSlot(pos, occupied, roster) {
  for (const id of roster.autoOrder[pos] || []) if (!occupied.has(id)) return id;
  for (const id of roster.benchIds) if (!occupied.has(id)) return id;
  return null;
}

export function resolveBye(player) {
  if (player?.bye != null && player.bye !== "") {
    const n = Number(player.bye);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return TEAM_BYES[player?.team] || null;
}

/** Bye overlap if `candidate` were added to `roster`. null when clean. */
export function assessByeConflict(roster, candidate, slotById = {}) {
  const week = resolveBye(candidate);
  if (!week) return null;
  const mates = (roster || []).filter((p) => resolveBye(p) === week);
  if (!mates.length) return null;

  const starterMates = mates.filter((p) => slotById[p.slot]?.starter);
  const samePosStarters = starterMates.filter((p) => p.pos === candidate.pos);
  const qb = roster.find((p) => p.slot === "QB");
  const te = roster.find((p) => p.slot === "TE");
  const short = (p) => (p.name || "").split(/\s+/).filter(Boolean).pop() || p.name;
  const qbTeClash =
    (candidate.pos === "TE" && qb && resolveBye(qb) === week) ||
    (candidate.pos === "QB" && te && resolveBye(te) === week);

  let level = 1;
  if (starterMates.length >= 2 || mates.length >= 3 || samePosStarters.length >= 1 || qbTeClash) level = 2;

  let message;
  if (starterMates.length >= 2) {
    message = `Week ${week} bye with ${starterMates.length} starters (${starterMates.map(short).join(", ")})`;
  } else if (samePosStarters.length >= 1) {
    message = `Week ${week} stacks another ${candidate.pos} starter (${short(samePosStarters[0])})`;
  } else if (candidate.pos === "TE" && qb && resolveBye(qb) === week) {
    message = `Same Week ${week} bye as your QB`;
  } else if (candidate.pos === "QB" && te && resolveBye(te) === week) {
    message = `Same Week ${week} bye as your TE`;
  } else if (mates.length >= 3) {
    message = `Week ${week} already has ${mates.length} players`;
  } else if (starterMates.length === 1) {
    message = `Week ${week} bye with ${starterMates[0].pos} ${short(starterMates[0])}`;
  } else {
    message = `Week ${week} bye with ${mates.map(short).join(", ")}`;
  }

  const chip = starterMates.length
    ? `Bye ${week} · ${starterMates.map(short).join(", ")}`
    : `Bye ${week} · overlap`;

  return { level, message, chip, week, mates, starterMates };
}
