import { norm, loose, lev } from "./names.js";
import { POSITIONS, TEAM_ALIASES, TEAM_BYES } from "./league.js";
import { PLAYER_DB, POS_RANK } from "../data/players.js";

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* ---------- quick-add parser ---------- */
export function parseQuick(raw) {
  const input = raw.trim();
  if (!input) return null;
  const out = { name: "", pos: null, team: null, bye: null, price: null };
  const takeNum = (tok) => {
    const m = tok.replace(/^\$/, "");
    return /^\d+(\.\d+)?$/.test(m) ? parseFloat(m) : null;
  };
  if (input.includes(",")) {
    const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
    out.name = parts[0];
    const nums = [];
    for (const p of parts.slice(1)) {
      const n = takeNum(p);
      if (n !== null) { nums.push(n); continue; }
      const up = p.toUpperCase();
      const posGuess = up === "DST" || up === "D/ST" ? "DEF" : up;
      if (POSITIONS.includes(posGuess)) { out.pos = posGuess; continue; }
      const team = TEAM_ALIASES[up] || up;
      if (TEAM_BYES[team]) { out.team = team; continue; }
    }
    if (nums.length === 1) out.price = nums[0];
    else if (nums.length >= 2) { out.bye = nums[0]; out.price = nums[nums.length - 1]; }
  } else {
    const toks = input.split(/\s+/);
    const last = takeNum(toks[toks.length - 1]);
    if (last !== null && toks.length > 1) { out.price = last; out.name = toks.slice(0, -1).join(" "); }
    else out.name = input;
  }
  return out;
}

export function matchPlayers(query, pos) {
  const res = fuzzyMatch(query, pos, 8);
  const exact = res.filter((p) => loose(p.name) === loose(query));
  if (exact.length === 1) return exact;
  const q = loose(query);
  const lastName = res.filter((p) => loose(p.name).split(" ").includes(q));
  if (lastName.length === 1) return lastName;
  return res;
}

/* ---------- fuzzy name matching ("Jamarr Chase" → "Ja'Marr Chase") ---------- */
export function fuzzyMatch(query, pos, limit = 8) {
  const q = loose(query);
  if (!q || q.length < 2) return [];
  const qToks = q.split(" ");
  const scored = [];
  for (const p of PLAYER_DB) {
    if (pos && p.pos !== pos) continue;
    const n = loose(p.name);
    let score = -1;
    if (n === q) score = 100;
    else if (n.startsWith(q)) score = 85;
    else if (n.includes(q)) score = 75;
    else {
      const nToks = n.split(" ");
      let ok = true, s = 0;
      for (const qt of qToks) {
        let best = 0;
        for (const nt of nToks) {
          if (nt === qt) best = Math.max(best, 20);
          else if (qt.length >= 2 && nt.startsWith(qt)) best = Math.max(best, 14);
          else if (qt.length >= 4 && lev(qt, nt) <= (qt.length >= 6 ? 2 : 1)) best = Math.max(best, 9);
        }
        if (!best) { ok = false; break; }
        s += best;
      }
      if (ok) score = s;
    }
    if (score >= 0) scored.push([score, p]);
  }
  scored.sort((a, b) => b[0] - a[0] || (POS_RANK[norm(a[1].name)] || 99) - (POS_RANK[norm(b[1].name)] || 99));
  return scored.slice(0, limit).map((x) => x[1]);
}
