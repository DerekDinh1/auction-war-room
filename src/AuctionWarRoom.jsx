import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { CommandHeader, ViewNav, Modal, Icon, SeasonsPanel } from "./components/index.js";
import { money } from "./lib/format.js";
import { storageGet, storageSet } from "./lib/storage.js";
import {
  CATALOG_KEY,
  LEGACY_STORAGE_KEY,
  createCatalog,
  createSeason,
  createNextSeason,
  migrateLegacy,
  listSeasons,
  getActiveSeason,
  upsertSeason,
  setActiveSeasonId,
  seasonDraftSlice,
  applyDraftToSeason,
} from "./lib/seasons.js";

const Ic = Icon; // legacy alias used throughout panels

/* ============================================================
   NFL AUCTION WAR ROOM — 12-team, $200, 1.5 PPR, 16-man roster
   ============================================================ */

const DEFAULT_SETTINGS = {
  budget: 200,
  teams: 12,
  starters: { QB: 1, RB: 2, WR: 3, TE: 1, FLEX: 1, K: 1, DEF: 1 },
  bench: 6,
  flexEligible: { RB: true, WR: true, TE: true, QB: false, K: false, DEF: false },
  onlyOne: { QB: true, K: true, DEF: true, RB: false, WR: false, TE: false }, // warn on a 2nd
};
const clampInt = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));
function normalizeSettings(raw) {
  const s = { ...DEFAULT_SETTINGS, ...(raw || {}) };
  s.starters = { ...DEFAULT_SETTINGS.starters, ...(raw?.starters || {}) };
  s.flexEligible = { ...DEFAULT_SETTINGS.flexEligible, ...(raw?.flexEligible || {}) };
  s.onlyOne = { ...DEFAULT_SETTINGS.onlyOne, ...(raw?.onlyOne || {}) };
  s.budget = clampInt(s.budget, 1, 10000);
  s.teams = clampInt(s.teams, 2, 32);
  s.bench = clampInt(s.bench, 0, 20);
  Object.keys(s.starters).forEach((k) => { s.starters[k] = clampInt(s.starters[k], 0, 10); });
  return s;
}

// 2026 bye weeks (official schedule, released May 2026)
const TEAM_BYES = {
  ARI: 14, ATL: 11, BAL: 13, BUF: 7, CAR: 5, CHI: 10, CIN: 6, CLE: 11,
  DAL: 14, DEN: 10, DET: 6, GB: 11, HOU: 8, IND: 13, JAX: 7, KC: 5,
  LV: 13, LAC: 7, LAR: 11, MIA: 6, MIN: 6, NE: 11, NO: 8, NYG: 8,
  NYJ: 13, PHI: 10, PIT: 9, SF: 8, SEA: 11, TB: 10, TEN: 9, WAS: 7,
};
const TEAMS = Object.keys(TEAM_BYES).sort();
const TEAM_ALIASES = { JAC: "JAX", WSH: "WAS", ARZ: "ARI", LA: "LAR", OAK: "LV", SD: "LAC", STL: "LAR" };

const POSITIONS = ["QB", "RB", "WR", "TE", "K", "DEF"];
const POS_ORDER = ["QB", "RB", "WR", "TE", "K", "DEF"]; // display order

// Built-in player list [name, pos, team]
// Top 300 by average FantasyPros expert consensus rank (PPR + Half-PPR + Standard), updated Jul 26, 2026
// Sources: FantasyPros partners API — ~89–92 experts per scoring format; avg of rank_ave across formats
const RAW_DB = [
  // QB (32)
  ["Josh Allen","QB","BUF"],["Lamar Jackson","QB","BAL"],["Drake Maye","QB","NE"],
  ["Joe Burrow","QB","CIN"],["Jayden Daniels","QB","WAS"],["Jalen Hurts","QB","PHI"],
  ["Caleb Williams","QB","CHI"],["Justin Herbert","QB","LAC"],["Trevor Lawrence","QB","JAX"],
  ["Dak Prescott","QB","DAL"],["Jaxson Dart","QB","NYG"],["Brock Purdy","QB","SF"],
  ["Patrick Mahomes II","QB","KC"],["Bo Nix","QB","DEN"],["Matthew Stafford","QB","LAR"],
  ["Jared Goff","QB","DET"],["Kyler Murray","QB","MIN"],["Jordan Love","QB","GB"],
  ["Baker Mayfield","QB","TB"],["Tyler Shough","QB","NO"],["Malik Willis","QB","MIA"],
  ["C.J. Stroud","QB","HOU"],["Sam Darnold","QB","SEA"],["Cam Ward","QB","TEN"],
  ["Daniel Jones","QB","IND"],["Bryce Young","QB","CAR"],["Jacoby Brissett","QB","ARI"],
  ["Aaron Rodgers","QB","PIT"],["Geno Smith","QB","NYJ"],["Fernando Mendoza","QB","LV"],
  ["Tua Tagovailoa","QB","ATL"],["Michael Penix Jr.","QB","ATL"],
  // RB (91)
  ["Bijan Robinson","RB","ATL"],["Jahmyr Gibbs","RB","DET"],["Christian McCaffrey","RB","SF"],
  ["Jonathan Taylor","RB","IND"],["James Cook III","RB","BUF"],["Ashton Jeanty","RB","LV"],
  ["Saquon Barkley","RB","PHI"],["De'Von Achane","RB","MIA"],["Chase Brown","RB","CIN"],
  ["Omarion Hampton","RB","LAC"],["Derrick Henry","RB","BAL"],["Kenneth Walker III","RB","KC"],
  ["Kyren Williams","RB","LAR"],["Jeremiyah Love","RB","ARI"],["Josh Jacobs","RB","GB"],
  ["Breece Hall","RB","NYJ"],["Javonte Williams","RB","DAL"],["Travis Etienne Jr.","RB","NO"],
  ["Cam Skattebo","RB","NYG"],["Bucky Irving","RB","TB"],["Quinshon Judkins","RB","CLE"],
  ["D'Andre Swift","RB","CHI"],["TreVeyon Henderson","RB","NE"],["David Montgomery","RB","HOU"],
  ["Bhayshul Tuten","RB","JAX"],["Jadarian Price","RB","SEA"],["Jaylen Warren","RB","PIT"],
  ["Tony Pollard","RB","TEN"],["Rhamondre Stevenson","RB","NE"],["Chuba Hubbard","RB","CAR"],
  ["Rico Dowdle","RB","PIT"],["RJ Harvey","RB","DEN"],["Kyle Monangai","RB","CHI"],
  ["J.K. Dobbins","RB","DEN"],["Blake Corum","RB","LAR"],["Kenny Gainwell","RB","TB"],
  ["Rachaad White","RB","WAS"],["Aaron Jones Sr.","RB","MIN"],["Jacory Croskey-Merritt","RB","WAS"],
  ["Jonathon Brooks","RB","CAR"],["Jordan Mason","RB","MIN"],["Tyrone Tracy Jr.","RB","NYG"],
  ["Chris Rodriguez Jr.","RB","JAX"],["Woody Marks","RB","HOU"],["Tyler Allgeier","RB","ARI"],
  ["Zach Charbonnet","RB","SEA"],["Isiah Pacheco","RB","DET"],["Tyjae Spears","RB","TEN"],
  ["Dylan Sampson","RB","CLE"],["Alvin Kamara","RB","NO"],["Keaton Mitchell","RB","LAC"],
  ["Jonah Coleman","RB","DEN"],["Brian Robinson Jr.","RB","ATL"],["Tank Bigsby","RB","PHI"],
  ["Braelon Allen","RB","NYJ"],["Emanuel Wilson","RB","SEA"],["James Conner","RB","ARI"],
  ["Emmett Johnson","RB","KC"],["Mike Washington Jr.","RB","LV"],["Kimani Vidal","RB","LAC"],
  ["Ray Davis","RB","BUF"],["Sean Tucker","RB","TB"],["Nicholas Singleton","RB","TEN"],
  ["Kaytron Allen","RB","WAS"],["Jaylen Wright","RB","MIA"],["MarShawn Lloyd","RB","GB"],
  ["Ollie Gordon II","RB","MIA"],["Justice Hill","RB","BAL"],["Demond Claiborne","RB","MIN"],
  ["Jaydon Blue","RB","DAL"],["Devin Neal","RB","NO"],["Ty Johnson","RB","BUF"],
  ["Kaleb Johnson","RB","PIT"],["Chris Brooks","RB","GB"],["Jordan James","RB","SF"],
  ["Isaiah Davis","RB","NYJ"],["DJ Giddens","RB","IND"],["Malik Davis","RB","DAL"],
  ["George Holani","RB","SEA"],["Trey Benson","RB","ARI"],["Samaje Perine","RB","CIN"],
  ["Kaelon Black","RB","SF"],["Kendre Miller","RB","NO"],["Najee Harris","RB","LAC"],
  ["Seth McGowan","RB","IND"],["LeQuint Allen Jr.","RB","JAX"],["Jerome Ford","RB","WAS"],
  ["Brashard Smith","RB","KC"],["Adam Randall","RB","BAL"],["Emari Demercado","RB","KC"],
  ["Devin Singletary","RB","NYG"],
  // WR (110)
  ["Ja'Marr Chase","WR","CIN"],["Puka Nacua","WR","LAR"],["Jaxon Smith-Njigba","WR","SEA"],
  ["Amon-Ra St. Brown","WR","DET"],["CeeDee Lamb","WR","DAL"],["Justin Jefferson","WR","MIN"],
  ["Drake London","WR","ATL"],["A.J. Brown","WR","NE"],["Nico Collins","WR","HOU"],
  ["George Pickens","WR","DAL"],["Rashee Rice","WR","KC"],["Chris Olave","WR","NO"],
  ["DeVonta Smith","WR","PHI"],["Tee Higgins","WR","CIN"],["Zay Flowers","WR","BAL"],
  ["Tetairoa McMillan","WR","CAR"],["Emeka Egbuka","WR","TB"],["Garrett Wilson","WR","NYJ"],
  ["Ladd McConkey","WR","LAC"],["Malik Nabers","WR","NYG"],["Jaylen Waddle","WR","DEN"],
  ["Terry McLaurin","WR","WAS"],["Davante Adams","WR","LAR"],["Luther Burden III","WR","CHI"],
  ["Jameson Williams","WR","DET"],["Mike Evans","WR","SF"],["Christian Watson","WR","GB"],
  ["DJ Moore","WR","BUF"],["Rome Odunze","WR","CHI"],["Marvin Harrison Jr.","WR","ARI"],
  ["Carnell Tate","WR","TEN"],["Alec Pierce","WR","IND"],["DK Metcalf","WR","PIT"],
  ["Brian Thomas Jr.","WR","JAX"],["Courtland Sutton","WR","DEN"],["Chris Godwin Jr.","WR","TB"],
  ["Parker Washington","WR","JAX"],["Jordyn Tyson","WR","NO"],["Michael Wilson","WR","ARI"],
  ["Quentin Johnston","WR","LAC"],["Michael Pittman Jr.","WR","PIT"],["Makai Lemon","WR","PHI"],
  ["Ricky Pearsall","WR","SF"],["Jakobi Meyers","WR","JAX"],["Jordan Addison","WR","MIN"],
  ["Wan'Dale Robinson","WR","TEN"],["Josh Downs","WR","IND"],["Jayden Reed","WR","GB"],
  ["Xavier Worthy","WR","KC"],["Jayden Higgins","WR","HOU"],["Khalil Shakir","WR","BUF"],
  ["Romeo Doubs","WR","NE"],["Jalen Coker","WR","CAR"],["KC Concepcion","WR","CLE"],
  ["Matthew Golden","WR","GB"],["Rashid Shaheed","WR","SEA"],["Jauan Jennings","WR","MIN"],
  ["Jerry Jeudy","WR","CLE"],["Denzel Boston","WR","CLE"],["Stefon Diggs","WR","NE"],
  ["Omar Cooper Jr.","WR","NYJ"],["Jalen McMillan","WR","TB"],["Adonai Mitchell","WR","NYJ"],
  ["Travis Hunter","WR","JAX"],["Tre Tucker","WR","LV"],["Tre' Harris","WR","LAC"],
  ["Kayshon Boutte","WR","NE"],["Ryan Flournoy","WR","DAL"],["Antonio Williams","WR","WAS"],
  ["Deebo Samuel Sr.","WR","WAS"],["Troy Franklin","WR","DEN"],["Isaac TeSlaa","WR","DET"],
  ["Calvin Ridley","WR","TEN"],["Jaylin Noel","WR","HOU"],["Jalen Nailor","WR","LV"],
  ["Darnell Mooney","WR","NYG"],["Brandon Aiyuk","WR","SF"],["Dontayvion Wicks","WR","PHI"],
  ["Pat Bryant","WR","DEN"],["Malik Washington","WR","MIA"],["Rashod Bateman","WR","BAL"],
  ["Tank Dell","WR","HOU"],["Chimere Dike","WR","TEN"],["Tyreek Hill","WR","MIA"],
  ["De'Zhaun Stribling","WR","SF"],["Germie Bernard","WR","PIT"],["Cooper Kupp","WR","SEA"],
  ["Elic Ayomanor","WR","TEN"],["Zachariah Branch","WR","ATL"],["Chris Bell","WR","MIA"],
  ["Keon Coleman","WR","BUF"],["Elijah Sarratt","WR","BAL"],["Jack Bech","WR","LV"],
  ["Ted Hurst III","WR","TB"],["Christian Kirk","WR","SF"],["Malachi Fields","WR","NYG"],
  ["Tory Horton","WR","SEA"],["Marvin Mims Jr.","WR","DEN"],["Chris Brazzell II","WR","CAR"],
  ["Tyquan Thornton","WR","KC"],["Darius Slayton","WR","NYG"],["Kyle Williams","WR","NE"],
  ["Andrei Iosivas","WR","CIN"],["Xavier Legette","WR","CAR"],["Keenan Allen","WR","LAC"],
  ["Devaughn Vele","WR","NO"],["Mack Hollins","WR","NE"],["Ja'Kobi Lane","WR","BAL"],
  ["Skyler Bell","WR","BUF"],["Hollywood Brown","WR","PHI"],
  // TE (37)
  ["Brock Bowers","TE","LV"],["Trey McBride","TE","ARI"],["Colston Loveland","TE","CHI"],
  ["Tyler Warren","TE","IND"],["Tucker Kraft","TE","GB"],["Harold Fannin Jr.","TE","CLE"],
  ["Kyle Pitts Sr.","TE","ATL"],["Sam LaPorta","TE","DET"],["George Kittle","TE","SF"],
  ["Travis Kelce","TE","KC"],["Dalton Kincaid","TE","BUF"],["Jake Ferguson","TE","DAL"],
  ["Isaiah Likely","TE","NYG"],["Dallas Goedert","TE","PHI"],["Mark Andrews","TE","BAL"],
  ["Brenton Strange","TE","JAX"],["Juwan Johnson","TE","NO"],["Hunter Henry","TE","NE"],
  ["Oronde Gadsden II","TE","LAC"],["Chig Okonkwo","TE","WAS"],["Dalton Schultz","TE","HOU"],
  ["AJ Barner","TE","SEA"],["T.J. Hockenson","TE","MIN"],["Kenyon Sadiq","TE","NYJ"],
  ["Greg Dulcich","TE","MIA"],["Gunnar Helm","TE","TEN"],["Terrance Ferguson","TE","LAR"],
  ["Pat Freiermuth","TE","PIT"],["David Njoku","TE","LAC"],["Cade Otton","TE","TB"],
  ["Colby Parkinson","TE","LAR"],["Evan Engram","TE","DEN"],["Mike Gesicki","TE","CIN"],
  ["Eli Stowers","TE","PHI"],["Theo Johnson","TE","NYG"],["Mason Taylor","TE","NYJ"],
  ["Jake Tonges","TE","SF"],
  // K (30)
  ["Brandon Aubrey","K","DAL"],["Ka'imi Fairbairn","K","HOU"],["Cameron Dicker","K","LAC"],
  ["Cam Little","K","JAX"],["Jason Myers","K","SEA"],["Eddy Pineiro","K","SF"],
  ["Tyler Loop","K","BAL"],["Evan McPherson","K","CIN"],["Cairo Santos","K","CHI"],
  ["Andy Borregales","K","NE"],["Chase McLaughlin","K","TB"],["Jake Bates","K","DET"],
  ["Nick Folk","K","ATL"],["Harrison Mevis","K","LAR"],["Brandon McManus","K","GB"],
  ["Blake Grupe","K","IND"],["Daniel Carlson","K","LV"],["Ryan Fitzgerald","K","CAR"],
  ["Harrison Butker","K","KC"],["Chris Boswell","K","PIT"],["Jake Moody","K","WAS"],
  ["Trey Smack","K","GB"],["Ben Sauls","K","NYG"],["Spencer Shrader","K","IND"],
  ["Tyler Bass","K","BUF"],["Will Reichard","K","MIN"],["Wil Lutz","K","DEN"],
  ["Joey Slye","K","TEN"],["Charlie Smyth","K","NO"],["Jake Elliott","K","PHI"],
];
const DEF_NAMES = {
  ARI:"Cardinals", ATL:"Falcons", BAL:"Ravens", BUF:"Bills", CAR:"Panthers", CHI:"Bears",
  CIN:"Bengals", CLE:"Browns", DAL:"Cowboys", DEN:"Broncos", DET:"Lions", GB:"Packers",
  HOU:"Texans", IND:"Colts", JAX:"Jaguars", KC:"Chiefs", LV:"Raiders", LAC:"Chargers",
  LAR:"Rams", MIA:"Dolphins", MIN:"Vikings", NE:"Patriots", NO:"Saints", NYG:"Giants",
  NYJ:"Jets", PHI:"Eagles", PIT:"Steelers", SF:"49ers", SEA:"Seahawks", TB:"Buccaneers",
  TEN:"Titans", WAS:"Commanders",
};
const PLAYER_DB = [
  ...RAW_DB,
  ...TEAMS.map((t) => [`${DEF_NAMES[t]} D/ST`, "DEF", t]),
].map(([name, pos, team], i) => ({ id: `db${i}`, name, pos, team, bye: TEAM_BYES[team] }));

const norm = (s) => (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[.\-]/g, "").trim();

/* ---------- estimated auction values (12-team, $200; DB is roughly rank-ordered) ---------- */
const POS_LISTS = {};
PLAYER_DB.forEach((p) => { (POS_LISTS[p.pos] = POS_LISTS[p.pos] || []).push(p); });
const POS_RANK = {};
Object.values(POS_LISTS).forEach((list) => list.forEach((p, i) => { POS_RANK[norm(p.name)] = i + 1; }));
function estValue(pos, name) {
  const r = POS_RANK[norm(name)];
  if (!r) return null;
  let v;
  if (pos === "RB" || pos === "WR") v = 62 * Math.exp(-0.085 * (r - 1));
  else if (pos === "QB") v = 26 * Math.exp(-0.2 * (r - 1));
  else if (pos === "TE") v = 30 * Math.exp(-0.3 * (r - 1));
  else v = r <= 3 ? 2 : 1;
  return Math.max(1, Math.round(v));
}
const tierOf = (name) => { const r = POS_RANK[norm(name)]; return r ? Math.ceil(r / 6) : null; };

/* ---------- fuzzy player matching ---------- */
function editDist(a, b, cap) {
  if (a === b) return 0;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > cap) return cap + 1;
  let prev = []; for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    const cur = [i]; let rowMin = i;
    for (let j = 1; j <= lb; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > cap) return cap + 1;
    prev = cur;
  }
  return prev[lb];
}
function fuzzyScore(query, name) {
  const q = norm(query), n = norm(name);
  if (!q) return 0;
  if (n === q) return 100;
  if (n.startsWith(q)) return 90;
  if (n.includes(q)) return 82;
  const qs = q.replace(/\s+/g, ""), ns = n.replace(/\s+/g, "");
  if (qs.length >= 4 && ns.includes(qs)) return 80;
  if (qs.length >= 6 && editDist(qs, ns, 2) <= 2) return 85;
  const qT = q.split(" ").filter(Boolean);
  const nT = n.split(" ").filter(Boolean);
  let matched = 0, near = 0;
  for (const qt of qT) {
    let best = 0;
    for (const nt of nT) {
      if (nt === qt) best = Math.max(best, 3);
      else if (qt.length >= 2 && nt.startsWith(qt)) best = Math.max(best, 2.5);
      else {
        const cap = qt.length >= 6 ? 2 : qt.length >= 4 ? 1 : 0;
        if (cap > 0 && editDist(qt, nt, cap) <= cap) best = Math.max(best, 2);
      }
    }
    if (best >= 2.5) matched++;
    else if (best > 0) near++;
    else return 0; // a query word that matches nothing rules the player out
  }
  const cov = (matched + near * 0.7) / qT.length;
  return Math.round(40 + cov * 40);
}
function fuzzySearch(query, { pos = null, limit = 8 } = {}) {
  const scored = [];
  for (const p of PLAYER_DB) {
    if (pos && p.pos !== pos) continue;
    const s = fuzzyScore(query, p.name);
    if (s >= 55) scored.push([s, p]);
  }
  scored.sort((x, y) => y[0] - x[0] || (POS_RANK[norm(x[1].name)] || 999) - (POS_RANK[norm(y[1].name)] || 999));
  return scored.slice(0, limit).map((x) => x[1]);
}
const PLAN_CATS = ["QB", "RB", "WR", "TE", "K", "DEF", "Bench"];
const DEFAULT_PLAN = { QB: 15, RB: 75, WR: 80, TE: 12, K: 1, DEF: 2, Bench: 15 };
const EMPTY_ASST = { name: "", pos: "", team: "", bye: "", proj: "", presetMax: "", bid: "" };

// ---------- roster slots (built from settings) ----------
function buildRoster(settings) {
  const st = settings.starters;
  const flexAccepts = POSITIONS.filter((p) => settings.flexEligible[p]);
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
  for (let i = 1; i <= st.FLEX; i++) {
    slots.push({ id: st.FLEX === 1 ? "FLEX" : `FLEX${i}`, label: st.FLEX === 1 ? "FLEX" : `FLEX${i}`,
      accepts: flexAccepts.length ? flexAccepts : POSITIONS, starter: true, pos: "FLEX" });
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
      .concat(slots.filter((x) => x.starter && x.pos === "FLEX" && x.accepts.includes(pos)).map((x) => x.id));
  });
  const benchIds = slots.filter((x) => !x.starter).map((x) => x.id);
  const size = slots.length;
  return { slots, byId, autoOrder, benchIds, size };
}
function autoSlot(pos, occupied, roster) {
  for (const id of roster.autoOrder[pos] || []) if (!occupied.has(id)) return id;
  for (const id of roster.benchIds) if (!occupied.has(id)) return id;
  return null;
}
// rough $ each open starting slot should command, by position
const SLOT_COST_EST = { QB: 8, RB: 13, WR: 12, TE: 6, FLEX: 8, K: 1, DEF: 1 };

const BOARD_FILTERS = ["ALL", "QB", "RB", "WR", "TE", "K", "DEF"];
const boardKey = (name) => norm(name);

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/* ---------- quick-add parser ---------- */
function parseQuick(raw) {
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
function matchPlayers(query, pos) {
  const res = fuzzyMatch(query, pos, 8);
  const exact = res.filter((p) => loose(p.name) === loose(query));
  if (exact.length === 1) return exact;
  const q = loose(query);
  const lastName = res.filter((p) => loose(p.name).split(" ").includes(q));
  if (lastName.length === 1) return lastName;
  return res;
}

/* ---------- fuzzy name matching ("Jamarr Chase" → "Ja'Marr Chase") ---------- */
const loose = (s) => norm(s).replace(/[^a-z0-9 ]+/g, "").replace(/\s+/g, " ").trim();
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
function fuzzyMatch(query, pos, limit = 8) {
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

function NameAutocomplete({ value, onChange, onSelect, placeholder, inputRef, posFilter, ariaLabel, listId = "asst-ac-list" }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const sugg = useMemo(() => {
    if (!value || value.length < 2) return [];
    return fuzzyMatch(value, posFilter, 8);
  }, [value, posFilter]);
  const expanded = open && sugg.length > 0;
  const activeId = expanded && activeIdx >= 0 && sugg[activeIdx] ? `${listId}-opt-${sugg[activeIdx].id}` : undefined;

  useEffect(() => { setActiveIdx(-1); }, [value, posFilter]);

  const pick = (p) => {
    onSelect(p);
    setOpen(false);
    setActiveIdx(-1);
  };

  return (
    <div className="ac-wrap">
      <input
        ref={inputRef}
        className="field"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={activeId}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={(e) => {
          if (!sugg.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIdx((i) => (i + 1) % sugg.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            setActiveIdx((i) => (i <= 0 ? sugg.length - 1 : i - 1));
          } else if (e.key === "Enter" && activeIdx >= 0 && sugg[activeIdx]) {
            e.preventDefault();
            pick(sugg[activeIdx]);
          } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIdx(-1);
          }
        }}
        autoComplete="off"
      />
      {expanded && (
        <div className="ac-list" id={listId} role="listbox" aria-label="Player suggestions">
          {sugg.map((p, i) => (
            <button
              key={p.id}
              id={`${listId}-opt-${p.id}`}
              type="button"
              role="option"
              aria-selected={i === activeIdx}
              className={`ac-item${i === activeIdx ? " active" : ""}`}
              onMouseDown={(e) => { e.preventDefault(); pick(p); }}
            >
              <span>{p.name}</span>
              <span className="ac-meta">{p.pos} · {p.team} · Bye {p.bye}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================ */
export default function AuctionWarRoom() {
  const [players, setPlayers] = useState([]);   // {id,name,pos,team,bye,price,proj,slot,pick}
  const [board, setBoard] = useState({});       // { normName: {status:'mine'|'gone', price, star, pos, team, bye, name} }
  const [boardFilter, setBoardFilter] = useState("ALL");
  const [boardShowGone, setBoardShowGone] = useState(false);
  const [boardStarsOnly, setBoardStarsOnly] = useState(false);
  const [nextPick, setNextPick] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmBox, setConfirmBox] = useState(null); // {message, detail, onYes}
  const [disamb, setDisamb] = useState(null);   // {candidates, price}
  const [priceAsk, setPriceAsk] = useState(null); // {player, mode:'mine'|'gone'}
  const [editRow, setEditRow] = useState(null); // player being edited
  const [view, setView] = useState("room");
  const [assistant, setAssistant] = useState(EMPTY_ASST);
  const presetTouchedRef = useRef(false);
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [catalog, setCatalog] = useState(null);
  const [activeSeasonId, setActiveSeasonIdState] = useState(null);
  const [draftConfirm, setDraftConfirm] = useState(null); // pseudo-target for assistant "Draft Player"

  // form state
  const emptyForm = { name: "", pos: "", team: "", bye: "", price: "", proj: "" };
  const [form, setForm] = useState(emptyForm);
  const [quick, setQuick] = useState("");
  const quickRef = useRef(null);
  const fileRef = useRef(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const changeView = useCallback((next) => {
    setView(next);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ------- seasons catalog + persistence ------- */
  const applySeasonDraft = useCallback((season) => {
    const d = seasonDraftSlice(season);
    // migrate old target list → board entries if needed
    let boardData = d.board;
    if (Array.isArray(season.targets)) {
      boardData = {};
      season.targets.forEach((t) => {
        boardData[boardKey(t.name)] = {
          name: t.name, pos: t.pos, team: t.team, bye: t.bye,
          star: (t.priority || 0) >= 4,
          status: t.status === "mine" ? "mine" : t.status === "opponent" ? "gone" : "available",
          price: null,
        };
      });
    }
    setPlayers(Array.isArray(d.players) ? d.players : []);
    setBoard(boardData && typeof boardData === "object" ? boardData : {});
    setNextPick(typeof d.nextPick === "number" ? d.nextPick : 1);
    setAssistant(d.assistant);
    setPlan(d.plan);
    setView(d.view);
    setSettings(normalizeSettings(d.settings || DEFAULT_SETTINGS));
    setActiveSeasonIdState(season.id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let cat = null;
        const raw = await storageGet(CATALOG_KEY);
        if (raw) {
          cat = JSON.parse(raw);
        } else {
          const legacy = await storageGet(LEGACY_STORAGE_KEY);
          if (legacy) {
            const flat = JSON.parse(legacy);
            cat = migrateLegacy(flat);
            await storageSet(CATALOG_KEY, JSON.stringify(cat));
          } else {
            cat = createCatalog(createSeason({ startYear: 2026, settings: DEFAULT_SETTINGS, name: "2026–27 Season" }));
          }
        }
        if (!cat.seasons || !Object.keys(cat.seasons).length) {
          cat = createCatalog(createSeason({ startYear: 2026, settings: DEFAULT_SETTINGS, name: "2026–27 Season" }));
        }
        setCatalog(cat);
        const active = getActiveSeason(cat);
        if (active) applySeasonDraft(active);
      } catch (e) {
        const cat = createCatalog(createSeason({ startYear: 2026, settings: DEFAULT_SETTINGS, name: "2026–27 Season" }));
        setCatalog(cat);
        applySeasonDraft(getActiveSeason(cat));
      }
      setLoaded(true);
    })();
  }, [applySeasonDraft]);

  useEffect(() => {
    if (!loaded || !activeSeasonId) return;
    const t = setTimeout(() => {
      setCatalog((prev) => {
        if (!prev?.seasons?.[activeSeasonId]) return prev;
        const updated = applyDraftToSeason(prev.seasons[activeSeasonId], {
          players, board, nextPick, assistant, plan, view, settings,
        });
        const nextCat = {
          ...prev,
          activeSeasonId,
          seasons: { ...prev.seasons, [activeSeasonId]: updated },
        };
        storageSet(CATALOG_KEY, JSON.stringify(nextCat));
        return nextCat;
      });
    }, 500);
    return () => clearTimeout(t);
  }, [players, board, nextPick, assistant, plan, view, settings, loaded, activeSeasonId]);

  const seasonList = useMemo(() => (catalog ? listSeasons(catalog) : []), [catalog]);
  const activeSeason = catalog && activeSeasonId ? catalog.seasons[activeSeasonId] : null;

  const switchSeason = useCallback((id) => {
    if (!catalog || id === activeSeasonId) return;
    // flush current draft into catalog synchronously before switching
    const flushed = applyDraftToSeason(catalog.seasons[activeSeasonId], { players, board, nextPick, assistant, plan, view, settings });
    let nextCat = upsertSeason(catalog, flushed);
    nextCat = setActiveSeasonId(nextCat, id);
    setCatalog(nextCat);
    applySeasonDraft(nextCat.seasons[id]);
    storageSet(CATALOG_KEY, JSON.stringify(nextCat));
    showToast(`Switched to ${nextCat.seasons[id].label}`, "ok");
  }, [catalog, activeSeasonId, players, board, nextPick, assistant, plan, view, settings, applySeasonDraft, showToast]);

  const renameSeason = useCallback((id, name) => {
    if (!catalog?.seasons[id]) return;
    const updated = { ...catalog.seasons[id], name };
    const nextCat = upsertSeason(catalog, updated);
    setCatalog(nextCat);
    storageSet(CATALOG_KEY, JSON.stringify(nextCat));
    showToast("Season renamed.", "ok");
  }, [catalog, showToast]);

  const startNextSeason = useCallback(() => {
    if (!catalog || !activeSeasonId) return;
    const from = catalog.seasons[activeSeasonId];
    const next = createNextSeason(from);
    if (catalog.seasons[next.id]) {
      setConfirmBox({
        message: `${next.label} already exists`,
        detail: "Switch to that season instead of creating a duplicate?",
        onYes: () => { setConfirmBox(null); switchSeason(next.id); },
      });
      return;
    }
    setConfirmBox({
      message: `Start ${next.label}?`,
      detail: "League settings copy from the current season. Roster, board, and budget history start empty. You can switch back anytime.",
      onYes: () => {
        const flushed = applyDraftToSeason(from, { players, board, nextPick, assistant, plan, view, settings });
        let nextCat = upsertSeason(catalog, flushed);
        nextCat = upsertSeason(nextCat, next);
        nextCat = setActiveSeasonId(nextCat, next.id);
        setCatalog(nextCat);
        applySeasonDraft(next);
        storageSet(CATALOG_KEY, JSON.stringify(nextCat));
        setConfirmBox(null);
        showToast(`${next.label} ready — empty board, settings copied.`, "ok");
      },
    });
  }, [catalog, activeSeasonId, players, board, nextPick, assistant, plan, view, settings, applySeasonDraft, switchSeason, showToast]);

  /* ------- roster shape derived from settings ------- */
  const roster = useMemo(() => buildRoster(settings), [settings]);
  const SLOTS = roster.slots;
  const SLOT_BY_ID = roster.byId;
  const ROSTER_SIZE = roster.size;
  const BUDGET = settings.budget;
  const onlyOnePositions = useMemo(() => POSITIONS.filter((p) => settings.onlyOne[p]), [settings.onlyOne]);
  // required count per position: dedicated starters (FLEX counted separately)
  const posNeed = useMemo(() => {
    const n = {};
    POSITIONS.forEach((p) => { n[p] = settings.starters[p] || 0; });
    return n;
  }, [settings.starters]);

  // if settings change the roster shape, re-home anyone in a slot that no longer exists
  useEffect(() => {
    if (!loaded) return;
    setPlayers((ps) => {
      if (!ps.some((p) => !roster.byId[p.slot] || !roster.byId[p.slot].accepts.includes(p.pos))) return ps;
      const taken = new Set();
      const keep = [], move = [];
      ps.forEach((p) => {
        if (roster.byId[p.slot] && roster.byId[p.slot].accepts.includes(p.pos) && !taken.has(p.slot)) {
          taken.add(p.slot); keep.push(p);
        } else move.push(p);
      });
      const moved = move.map((p) => {
        const slot = autoSlot(p.pos, taken, roster);
        if (slot) { taken.add(slot); return { ...p, slot }; }
        return { ...p, slot: "__overflow" };
      });
      return [...keep, ...moved].sort((a, b) => a.pick - b.pick);
    });
  }, [roster, loaded]);

  /* ------- derived numbers ------- */
  const spent = players.reduce((s, p) => s + (p.price || 0), 0);
  const remaining = BUDGET - spent;
  const drafted = players.length;
  const spotsLeft = ROSTER_SIZE - drafted;
  const maxBid = spotsLeft > 0 ? remaining - (spotsLeft - 1) : 0;
  const avgPerSpot = spotsLeft > 0 ? remaining / spotsLeft : 0;
  const occupied = useMemo(() => new Map(players.map((p) => [p.slot, p])), [players]);
  const openStarters = SLOTS.filter((s) => s.starter && !occupied.has(s.id));
  const flexOpen = openStarters.filter((s) => s.pos === "FLEX").length;

  const posCounts = useMemo(() => {
    const c = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DEF: 0 };
    players.forEach((p) => { c[p.pos] = (c[p.pos] || 0) + 1; });
    return c;
  }, [players]);

  /* ------- bye analysis ------- */
  const byeInfo = useMemo(() => {
    const groups = {};
    players.forEach((p) => {
      if (!p.bye) return;
      (groups[p.bye] = groups[p.bye] || []).push(p);
    });
    const qb = players.find((p) => p.slot === "QB");
    const te = players.find((p) => p.slot === "TE");
    const issues = [];
    const weekMeta = {}; // wk -> { severity, samePos, starterCount }
    let level = 0; // 0 green, 1 yellow, 2 red
    if (qb && te && qb.bye && qb.bye === te.bye) {
      issues.push(`QB and TE share the Week ${qb.bye} bye`);
      level = Math.max(level, 1);
    }
    Object.entries(groups).forEach(([wk, list]) => {
      const starters = list.filter((p) => SLOT_BY_ID[p.slot]?.starter);
      const starterPos = {};
      starters.forEach((p) => { starterPos[p.pos] = (starterPos[p.pos] || 0) + 1; });
      const samePos = Object.entries(starterPos).filter(([, n]) => n >= 2);
      const shared = list.length >= 2;
      let severity = "";
      if (starters.length >= 3 || list.length >= 4 || samePos.length > 0) {
        severity = "danger";
        level = Math.max(level, 2);
      } else if (starters.length === 2 || list.length >= 3) {
        severity = "warn";
        level = Math.max(level, 1);
      } else if (shared) {
        severity = "shared"; // stands out, but mixed positions are usually fine
      }
      weekMeta[wk] = { severity, samePos: samePos.map(([pos]) => pos), starterCount: starters.length, shared };

      if (starters.length >= 3) {
        issues.push(`${starters.length} starters off in Week ${wk}: ${starters.map((p) => `${p.name} (${p.pos})`).join(", ")}`);
      } else if (samePos.length > 0) {
        issues.push(`Week ${wk} stacks ${samePos.map(([pos, n]) => `${n} ${pos}s`).join(" & ")} — harder to fill that week`);
      } else if (starters.length === 2) {
        const posLabel = starters.map((p) => p.pos).join(" + ");
        issues.push(`Week ${wk}: ${posLabel} starters overlap — usually manageable`);
      }
      if (list.length >= 4) {
        issues.push(`${list.length} total players off in Week ${wk}`);
      }
    });
    return { groups, issues, level, weekMeta };
  }, [players]);

  /* ------- value totals ------- */
  const projected = players.filter((p) => p.proj != null && p.proj !== "");
  const totalProj = projected.reduce((s, p) => s + Number(p.proj), 0);
  const totalPaidProj = projected.reduce((s, p) => s + p.price, 0);
  const totalValue = totalProj - totalPaidProj;

  /* ------- health grade ------- */
  const health = useMemo(() => {
    const completion = (drafted / ROSTER_SIZE) * 100;
    let budgetScore;
    if (spotsLeft === 0) budgetScore = Math.min(100, (spent / (BUDGET - 5)) * 100);
    else {
      const need = openStarters.length * 8 + Math.max(0, spotsLeft - openStarters.length);
      budgetScore = need <= 0 ? 100 : Math.max(0, Math.min(100, (maxBid / need) * 100));
    }
    const startersFilled = SLOTS.filter((s) => s.starter && occupied.has(s.id)).length;
    const starterTotal = SLOTS.filter((s2) => s2.starter).length || 1;
    let balance = Math.max(0, Math.min(100, (startersFilled / starterTotal) * 100 + (drafted > 0 ? 20 : 0)));
    onlyOnePositions.forEach((pos) => { if (posCounts[pos] > 1) balance -= 15; });
    balance = Math.max(0, Math.min(100, balance));
    const byeScore = byeInfo.level === 0 ? 100 : byeInfo.level === 1 ? 65 : 30;
    const valueScore = projected.length === 0 ? 75 : Math.max(0, Math.min(100, 50 + totalValue));
    const overall = drafted === 0 ? null :
      0.2 * completion + 0.25 * budgetScore + 0.25 * balance + 0.15 * byeScore + 0.15 * valueScore;
    const letter = overall == null ? "—" : overall >= 90 ? "A" : overall >= 80 ? "B" : overall >= 68 ? "C" : overall >= 55 ? "D" : "F";
    return { completion, budgetScore, balance, byeScore, valueScore, overall, letter };
  }, [drafted, spotsLeft, spent, maxBid, occupied, posCounts, byeInfo, projected.length, totalValue, openStarters.length]);

  /* ------- budget health & plan ------- */
  const benchOpen = Math.max(0, spotsLeft - openStarters.length);
  const fillCost = openStarters.reduce((s, sl) => s + (SLOT_COST_EST[sl.pos] || 5), 0) + benchOpen;
  const budgetHealth = spotsLeft === 0 ? "done" : remaining >= fillCost * 1.5 ? "strong" : remaining >= fillCost ? "moderate" : "tight";
  const avgPerStarter = openStarters.length > 0 ? Math.max(0, (remaining - benchOpen)) / openStarters.length : 0;
  const planSpend = useMemo(() => {
    const c = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DEF: 0, Bench: 0 };
    players.forEach((p) => { c[p.slot.startsWith("B") ? "Bench" : p.pos] += p.price; });
    return c;
  }, [players]);
  const planOverruns = PLAN_CATS.filter((c) => planSpend[c] > (Number(plan[c]) || 0));

  /* ------- draft assistant engine ------- */
  const analysis = useMemo(() => {
    if (!assistant.name || !assistant.pos) return null;
    const pos = assistant.pos;
    const est = estValue(pos, assistant.name);
    const projIn = assistant.proj !== "" && Number.isFinite(Number(assistant.proj)) ? Number(assistant.proj) : null;
    const V = projIn != null ? projIn : est;
    const preset = assistant.presetMax !== "" && Number.isFinite(Number(assistant.presetMax)) ? Number(assistant.presetMax) : null;
    const hasBid = assistant.bid !== "";
    const bid = hasBid ? Math.max(0, Math.round(Number(assistant.bid)) || 0) : 0;
    const slot = autoSlot(pos, new Set(players.map((p) => p.slot)), roster);
    const slotLabel = slot ? SLOT_BY_ID[slot].label : null;
    const fillsDedicated = !!slot && slot !== "FLEX" && !slot.startsWith("B");
    const fillsFlex = slot === "FLEX";
    const dup = !!settings.onlyOne[pos] && posCounts[pos] >= 1;
    const depthTargets = { QB: posNeed.QB, RB: posNeed.RB + 3, WR: posNeed.WR + 3, TE: posNeed.TE, K: posNeed.K, DEF: posNeed.DEF };
    const deep = posCounts[pos] >= (depthTargets[pos] || 1) && !fillsDedicated && !fillsFlex;

    // bye impact if added
    const byeNum = assistant.bye ? Number(assistant.bye) : null;
    let byeIssue = null;
    if (byeNum) {
      const same = players.filter((p) => p.bye === byeNum);
      const sameStarters = same.filter((p) => SLOT_BY_ID[p.slot]?.starter);
      const qb = players.find((p) => p.slot === "QB"), te = players.find((p) => p.slot === "TE");
      if ((fillsDedicated || fillsFlex) && sameStarters.length >= 2) byeIssue = `would put ${sameStarters.length + 1} starters on the Week ${byeNum} bye`;
      else if (same.length >= 3) byeIssue = `would stack ${same.length + 1} players on the Week ${byeNum} bye`;
      else if (pos === "TE" && qb && qb.bye === byeNum) byeIssue = `shares the Week ${byeNum} bye with your QB`;
      else if (pos === "QB" && te && te.bye === byeNum) byeIssue = `shares the Week ${byeNum} bye with your TE`;
    }

    // need weighting
    let mult;
    if (dup) mult = 0.45;
    else if (fillsDedicated) mult = 1.15;
    else if (fillsFlex) mult = 1.05;
    else if (deep) mult = 0.85;
    else mult = 0.95;
    if ((pos === "RB" || pos === "WR") && posCounts[pos] === 0) mult += 0.05;
    if (byeIssue) mult -= 0.06;

    const otherOpenStarters = openStarters.filter((s) => s.id !== slot);
    const softReserve = otherOpenStarters.length * 3; // keep some powder for other starters
    let suggested = V != null ? Math.round(V * mult) : Math.max(1, maxBid - softReserve);
    suggested = Math.min(suggested, maxBid, Math.max(1, maxBid - softReserve));
    suggested = Math.max(1, suggested);
    let recMax = preset != null ? Math.min(suggested, preset) : suggested;
    if (V == null && preset != null) {
      recMax = Math.min(preset, maxBid, Math.max(1, maxBid - softReserve));
      recMax = Math.max(1, recMax);
    }

    const projLabel = projIn != null ? "your projection" : preset != null && V == null ? "your max" : "estimated value";
    const discount = V != null ? V - bid : null;
    const needList = openStarters.slice(0, 3).map((s) => s.label).join(", ");
    let tier, why = [];

    if (!hasBid) {
      tier = "idle";
      why.push(`${slotLabel ? `Would fill ${slotLabel}. ` : ""}Recommended max ${money(recMax)}${V != null ? `, ${projLabel} ${money(V)}` : ""} — enter the bid for a call.`);
    }
    else if (spotsLeft <= 0) { tier = "pass"; why.push("Your roster is full."); }
    else if (bid > maxBid) { tier = "pass"; why.push(`${money(bid)} breaks your absolute max of ${money(maxBid)} — you couldn't put $1 on every remaining spot.`); }
    else if (bid > recMax) {
      tier = "pass";
      why.push(`Bid tops your ${money(recMax)} recommended max${dup ? ` — you already roster a ${pos}` : ""}.`);
      if (otherOpenStarters.length > 0) why.push(`Save it for ${needList}.`);
    } else if (dup) {
      if (discount != null && discount >= Math.max(5, Math.round(V * 0.3))) { tier = "value"; why.push(`Huge discount, but your plan is one ${pos} — only worth it as a trade chip.`); }
      else { tier = "caution"; why.push(`You already have a ${pos} and your plan skips backups there.`); }
    } else if (recMax - bid <= Math.max(2, Math.round(recMax * 0.08))) {
      tier = "caution";
      why.push(`Only ${money(recMax - bid)} from your recommended max.`);
      if (otherOpenStarters.length > 0) why.push(`Still need ${needList}.`);
    } else if (discount != null && discount >= Math.max(3, Math.round(V * 0.12))) {
      if (mult >= 1.02) { tier = "bid"; why.push(`${money(discount)} below ${projLabel} and fills your open ${slotLabel}.`); }
      else { tier = "value"; why.push(`${money(discount)} below ${projLabel}, but ${pos} is already a strength. Fine if it stays under ${money(recMax)}.`); }
    } else if (discount != null && discount >= 0) {
      if (mult >= 1.1) { tier = "bid"; why.push(`Fair price${discount > 0 ? ` (${money(discount)} under ${projLabel})` : ""} for your open ${slotLabel}.`); }
      else { tier = "value"; why.push(`Right at ${projLabel} — no rush, but a fair buy${slot && slot.startsWith("B") ? " for bench depth" : ""}.`); }
    } else if (discount != null) {
      tier = "caution"; why.push(`${money(-discount)} above ${projLabel}. Room left, but you're paying up.`);
    } else {
      tier = "caution"; why.push(`No projection available — anchor on your ${money(recMax)} cap.`);
    }
    if (byeIssue && tier !== "pass" && tier !== "idle") why.push(`Bye note: ${byeIssue}.`);
    if (budgetHealth === "tight" && tier === "bid") { tier = "value"; why.push("Budget is tight — don't stretch past the number."); }

    return { pos, V, est, projIn, preset, bid, hasBid, suggested, recMax, absMax: maxBid, tier, why: why.join(" "), slot, slotLabel, discount };
  }, [assistant, players, posCounts, openStarters, maxBid, spotsLeft, budgetHealth]);

  /* ------- market inflation from off-the-board prices ------- */
  const market = useMemo(() => {
    const sales = [];
    players.forEach((p) => { const e = estValue(p.pos, p.name); if (e != null && e >= 3) sales.push([e, p.price]); });
    Object.values(board).forEach((b) => {
      if (b.status !== "gone" || b.price == null) return;
      const e = estValue(b.pos, b.name);
      if (e != null && e >= 3) sales.push([e, b.price]);
    });
    if (sales.length < 3) return { factor: 1, pct: 0, n: sales.length };
    const totalEst = sales.reduce((s, x) => s + x[0], 0);
    const totalPaid = sales.reduce((s, x) => s + x[1], 0);
    const factor = Math.max(0.6, Math.min(1.6, totalPaid / Math.max(1, totalEst)));
    return { factor, pct: Math.round((factor - 1) * 100), n: sales.length };
  }, [players, board]);
  const adjEst = useCallback((pos, name) => {
    const e = estValue(pos, name);
    if (e == null) return null;
    return Math.max(1, Math.round(e * market.factor));
  }, [market.factor]);

  const alternatives = useMemo(() => {
    if (!assistant.pos) return [];
    const taken = new Set(players.map((p) => norm(p.name)));
    const myRank = POS_RANK[norm(assistant.name)] || 1;
    return (POS_LISTS[assistant.pos] || [])
      .filter((p) => {
        const k = boardKey(p.name);
        if (norm(p.name) === norm(assistant.name) || taken.has(norm(p.name))) return false;
        return !board[k] || board[k].status === "available";
      })
      .map((p) => ({ ...p, rank: POS_RANK[norm(p.name)], est: adjEst(p.pos, p.name), tier: tierOf(p.name), star: !!board[boardKey(p.name)]?.star }))
      .sort((a, b) => Math.abs(a.rank - myRank) - Math.abs(b.rank - myRank))
      .slice(0, 5)
      .sort((a, b) => a.rank - b.rank);
  }, [assistant.pos, assistant.name, players, board, adjEst]);

  /* ------- assistant handlers ------- */
  const pickAssistantPlayer = (p) => {
    const e = adjEst(p.pos, p.name);
    presetTouchedRef.current = false;
    setAssistant((a) => ({
      ...a, name: p.name, pos: p.pos, team: p.team, bye: String(p.bye || TEAM_BYES[p.team] || ""),
      proj: e != null ? String(e) : "",
      presetMax: "",
      bid: "",
    }));
  };
  // typing a name that resolves confidently fills in pos / team / bye / value automatically
  useEffect(() => {
    const nm = assistant.name.trim();
    if (nm.length < 3) return;
    if (assistant.pos && assistant.team) return;
    const hits = fuzzyMatch(nm, assistant.pos || null, 3);
    if (hits.length !== 1) return;
    const p = hits[0];
    const e = adjEst(p.pos, p.name);
    setAssistant((a) => {
      if (a.name.trim() !== nm) return a;
      if (a.pos && a.team) return a;
      return { ...a, pos: a.pos || p.pos, team: a.team || p.team,
        bye: a.bye || String(p.bye || TEAM_BYES[p.team] || ""),
        proj: a.proj || (e != null ? String(e) : "") };
    });
  }, [assistant.name, assistant.pos, assistant.team, adjEst]);

  // Prefill Suggested max from the engine; keep syncing until you edit the field
  useEffect(() => {
    if (!analysis || presetTouchedRef.current) return;
    const next = String(analysis.suggested);
    setAssistant((a) => {
      if (!a.name || a.presetMax === next) return a;
      return { ...a, presetMax: next };
    });
  }, [assistant.name, analysis?.suggested]);

  const bumpBid = (d) => setAssistant((a) => {
    const cur = a.bid === "" ? 0 : Math.round(Number(a.bid)) || 0;
    return { ...a, bid: String(Math.max(0, cur + d)) };
  });
  const clearAssistant = () => {
    presetTouchedRef.current = false;
    setAssistant(EMPTY_ASST);
  };
  const assistantDraft = () => {
    if (!analysis) { showToast("Search for the player on the block first.", "err"); return; }
    const currentBid = analysis.hasBid ? analysis.bid : null;
    setDraftConfirm({
      name: assistant.name, pos: assistant.pos, team: assistant.team,
      bye: assistant.bye, targetPrice: analysis.V != null ? analysis.V : null,
      // Confirmation price defaults to the live bid; fall back to recommended max if none entered
      maxBid: currentBid != null ? currentBid : (analysis.recMax || null),
      proj: assistant.proj,
      est: analysis.V != null ? analysis.V : analysis.est,
    });
  };
  const toggleStar = (name, meta) => {
    const k = boardKey(name);
    setBoard((b) => ({ ...b, [k]: { ...(b[k] || { status: "available", price: null, ...meta }), ...meta, name, star: !b[k]?.star } }));
  };
  const assistantGone = () => {
    if (!assistant.name || !assistant.pos) { clearAssistant(); return; }
    const currentBid = analysis?.hasBid ? analysis.bid : null;
    setPriceAsk({
      mode: "gone",
      player: {
        name: assistant.name, pos: assistant.pos, team: assistant.team, bye: assistant.bye,
        maxBid: currentBid,
        est: analysis?.V != null ? analysis.V : analysis?.est,
      },
    });
  };

  /* ------- big board actions ------- */
  const markGone = (p, price) => {
    const k = boardKey(p.name);
    setBoard((b) => ({
      ...b,
      [k]: { ...(b[k] || {}), name: p.name, pos: p.pos, team: p.team, bye: p.bye ? Number(p.bye) : (TEAM_BYES[p.team] || null),
        status: "gone", price: price == null ? null : Math.round(price), star: !!b[k]?.star },
    }));
    showToast(`${p.name} off the board${price != null ? ` for ${money(price)}` : ""}.`, "info");
  };
  const restoreToBoard = (name) => {
    const k = boardKey(name);
    setBoard((b) => ({ ...b, [k]: { ...(b[k] || {}), status: "available", price: null } }));
  };


  const commitAdd = useCallback((data, after) => {
    const slot = autoSlot(data.pos, new Set(players.map((p) => p.slot)), roster);
    if (!slot) { showToast(`Roster is full at ${ROSTER_SIZE}. Delete a pick on My Team to make room.`, "err"); return false; }
    const player = {
      id: uid(), name: data.name.trim(), pos: data.pos, team: data.team || "",
      bye: data.bye ? Number(data.bye) : (TEAM_BYES[data.team] || null),
      price: Math.round(Number(data.price)), proj: data.proj === "" || data.proj == null ? null : Number(data.proj),
      slot, pick: nextPick,
    };
    setPlayers((ps) => [...ps, player]);
    setNextPick((n) => n + 1);
    // sync big board
    setBoard((b) => {
      const k = boardKey(player.name);
      return { ...b, [k]: { ...(b[k] || {}), name: player.name, pos: player.pos, team: player.team, bye: player.bye, status: "mine", price: player.price, star: !!b[k]?.star } };
    });
    // whatever route the pick came from, reset the assistant for the next nomination
    setAssistant(EMPTY_ASST);
    showToast(`${player.name} → ${SLOT_BY_ID[slot].label} for ${money(player.price)}`, "ok");
    setForm(emptyForm); setQuick("");
    if (after) after();
    if (quickRef.current) quickRef.current.focus();
    return true;
  }, [players, nextPick, showToast, roster, ROSTER_SIZE]);

  const tryAdd = useCallback((data, after) => {
    if (!data.name || !data.name.trim()) { showToast("Enter a player name first.", "err"); return; }
    if (!data.pos) { showToast("Pick a position.", "err"); return; }
    const price = Math.round(Number(data.price));
    if (!Number.isFinite(price) || price < 0) { showToast("Enter the auction price.", "err"); return; }
    if (spotsLeft <= 0) { showToast(`Roster is full at ${ROSTER_SIZE}. Delete a pick on My Team to make room.`, "err"); return; }
    if (price > remaining) { showToast(`Only ${money(remaining)} left — can't pay ${money(price)}.`, "err"); return; }

    const checks = [];
    if (settings.onlyOne[data.pos] && posCounts[data.pos] >= 1) {
      checks.push(`You already roster ${posCounts[data.pos]} ${data.pos}. Your plan is one ${data.pos} only — draft another anyway?`);
    }
    if (price > maxBid) {
      checks.push(`${money(price)} is over your max bid of ${money(maxBid)}. You won't have $1 for every remaining spot. Proceed?`);
    }
    if (checks.length) {
      setConfirmBox({ message: "Confirm this pick", detail: checks.join(" "), onYes: () => { setConfirmBox(null); commitAdd({ ...data, price }, after); } });
      return;
    }
    commitAdd({ ...data, price }, after);
  }, [spotsLeft, remaining, maxBid, posCounts, commitAdd, showToast, settings.onlyOne, ROSTER_SIZE]);

  const deletePlayer = (id) => {
    const p = players.find((x) => x.id === id);
    if (!p) return;
    setPlayers((ps) => ps.filter((x) => x.id !== id));
    setBoard((b) => {
      const k = boardKey(p.name);
      if (!b[k] || b[k].status !== "mine") return b;
      return { ...b, [k]: { ...b[k], status: "available", price: null } };
    });
    showToast(`${p.name} removed — ${money(p.price)} refunded.`, "ok");
  };

  const movePlayer = (id, targetSlot) => {
    const p = players.find((x) => x.id === id);
    if (!p || targetSlot === p.slot) return;
    const slotDef = SLOT_BY_ID[targetSlot];
    if (!slotDef.accepts.includes(p.pos)) { showToast(`${p.pos} can't play ${slotDef.label}.`, "err"); return; }
    const occ = players.find((x) => x.slot === targetSlot);
    if (!occ) {
      setPlayers((ps) => ps.map((x) => (x.id === id ? { ...x, slot: targetSlot } : x)));
    } else {
      const backDef = SLOT_BY_ID[p.slot];
      if (!backDef.accepts.includes(occ.pos)) { showToast(`Can't swap: ${occ.name} isn't eligible for ${backDef.label}.`, "err"); return; }
      setPlayers((ps) => ps.map((x) => x.id === id ? { ...x, slot: targetSlot } : x.id === occ.id ? { ...x, slot: p.slot } : x));
      showToast(`Swapped ${p.name} and ${occ.name}.`, "ok");
    }
  };

  const saveEdit = (upd) => {
    const price = Math.round(Number(upd.price));
    if (!Number.isFinite(price) || price < 0) { showToast("Price must be a number.", "err"); return; }
    setPlayers((ps) => {
      let next = ps.map((x) => (x.id === upd.id ? {
        ...x, name: upd.name, pos: upd.pos, team: upd.team,
        bye: upd.bye ? Number(upd.bye) : null, price,
        proj: upd.proj === "" ? null : Number(upd.proj),
      } : x));
      const me = next.find((x) => x.id === upd.id);
      const wantSlot = upd.slot && SLOT_BY_ID[upd.slot]?.accepts.includes(me.pos) ? upd.slot : null;
      if (wantSlot && wantSlot !== me.slot) {
        const occ = next.find((x) => x.slot === wantSlot && x.id !== me.id);
        if (!occ) {
          next = next.map((x) => (x.id === me.id ? { ...x, slot: wantSlot } : x));
        } else if (SLOT_BY_ID[me.slot].accepts.includes(occ.pos)) {
          next = next.map((x) => x.id === me.id ? { ...x, slot: wantSlot } : x.id === occ.id ? { ...x, slot: me.slot } : x);
        }
      } else if (!SLOT_BY_ID[me.slot].accepts.includes(me.pos)) {
        const slot = autoSlot(me.pos, new Set(next.filter((x) => x.id !== me.id).map((x) => x.slot)), roster);
        next = next.map((x) => (x.id === me.id ? { ...x, slot: slot || me.slot } : x));
      }
      return next;
    });
    setEditRow(null);
    showToast("Pick updated.", "ok");
  };

  /* ------- quick add ------- */
  const [quickOpen, setQuickOpen] = useState(false);
  const quickParsed = useMemo(() => parseQuick(quick), [quick]);
  const quickSugg = useMemo(() => {
    if (!quickParsed || !quickParsed.name || quickParsed.name.length < 2) return [];
    const list = fuzzyMatch(quickParsed.name, quickParsed.pos, 6);
    if (list.length === 1 && loose(list[0].name) === loose(quickParsed.name)) return []; // already exact — nothing to offer
    return list;
  }, [quickParsed]);
  const selectQuick = (p) => {
    setQuickOpen(false);
    if (quickParsed && quickParsed.price != null) {
      tryAdd({ name: p.name, pos: quickParsed.pos || p.pos, team: quickParsed.team || p.team, bye: quickParsed.bye || p.bye, price: quickParsed.price, proj: "" });
    } else {
      setQuick(`${p.name}, ${p.pos}, ${p.team}, `);
      if (quickRef.current) quickRef.current.focus();
    }
  };
  const runQuickAdd = () => {
    setQuickOpen(false);
    const parsed = parseQuick(quick);
    if (!parsed) return;
    if (parsed.price == null) { showToast("Include a price, e.g. “Chase 52”.", "err"); return; }
    const cands = matchPlayers(parsed.name, parsed.pos);
    if (cands.length === 1) {
      const c = cands[0];
      tryAdd({ name: c.name, pos: parsed.pos || c.pos, team: parsed.team || c.team,
        bye: parsed.bye || TEAM_BYES[parsed.team || c.team], price: parsed.price, proj: "" });
    } else if (cands.length > 1) {
      setDisamb({ candidates: cands, price: parsed.price });
    } else if (parsed.pos) {
      tryAdd({ name: parsed.name, pos: parsed.pos, team: parsed.team || "", bye: parsed.bye || (parsed.team ? TEAM_BYES[parsed.team] : ""), price: parsed.price, proj: "" });
    } else {
      setForm({ ...emptyForm, name: parsed.name, price: String(parsed.price) });
      showToast("Couldn't identify that player — finish the details below.", "warn");
    }
  };

  /* ------- big board ------- */
  const boardRows = useMemo(() => {
    const draftedNames = new Set(players.map((p) => norm(p.name)));
    const rows = PLAYER_DB.map((p) => {
      const k = boardKey(p.name);
      const b = board[k] || {};
      const status = draftedNames.has(norm(p.name)) ? "mine" : (b.status || "available");
      return { ...p, key: k, status, price: b.price ?? null, star: !!b.star,
        est: adjEst(p.pos, p.name), tier: tierOf(p.name), rank: POS_RANK[norm(p.name)] || 999 };
    });
    // custom players tracked off-board that aren't in the built-in DB
    Object.entries(board).forEach(([k, b]) => {
      if (!b.name || rows.some((r) => r.key === k)) return;
      rows.push({ id: `x-${k}`, name: b.name, pos: b.pos || "", team: b.team || "", bye: b.bye || null, key: k,
        status: b.status || "available", price: b.price ?? null, star: !!b.star, est: adjEst(b.pos, b.name), tier: null, rank: 999 });
    });
    return rows
      .filter((r) => (boardFilter === "ALL" ? true : r.pos === boardFilter))
      .filter((r) => (boardStarsOnly ? r.star : true))
      .filter((r) => (boardShowGone ? true : r.status === "available"))
      .sort((a, b) =>
        (b.star ? 1 : 0) - (a.star ? 1 : 0) ||
        (a.status === "available" ? 0 : 1) - (b.status === "available" ? 0 : 1) ||
        (b.est || 0) - (a.est || 0) || a.rank - b.rank)
      .slice(0, 120);
  }, [board, players, boardFilter, boardShowGone, boardStarsOnly, adjEst]);

  const boardCounts = useMemo(() => {
    const vals = Object.values(board);
    return { gone: vals.filter((b) => b.status === "gone").length, star: vals.filter((b) => b.star).length };
  }, [board]);

  const setBoardStatus = (row, status) => {
    if (status === "available") {
      if (row.status === "mine") { showToast("Delete the pick from your roster to undo it.", "warn"); return; }
      restoreToBoard(row.name); return;
    }
    if (status === "mine") { setPriceAsk({ mode: "mine", player: row }); return; }
    if (status === "gone") { setPriceAsk({ mode: "gone", player: row }); return; }
  };

  /* ------- export / import / reset ------- */
  const exportDraft = () => {
    const label = (activeSeason?.label || "draft").replace(/[–—]/g, "-");
    const blob = new Blob([JSON.stringify({
      version: 4,
      seasonId: activeSeasonId,
      seasonLabel: activeSeason?.label,
      exported: new Date().toISOString(),
      players, board, nextPick, plan, settings,
    }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `auction-draft-${label}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importDraft = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (!Array.isArray(d.players)) throw new Error("bad file");
        setConfirmBox({
          message: "Import this draft file?",
          detail: `It contains ${d.players.length} drafted players and ${Object.keys(d.board || {}).length} tracked board entries. This replaces everything currently on screen.`,
          onYes: () => {
            setPlayers(d.players); setBoard(d.board || {});
            setNextPick(d.nextPick || d.players.length + 1);
            if (d.plan && typeof d.plan === "object") setPlan({ ...DEFAULT_PLAN, ...d.plan });
            if (d.settings) setSettings(normalizeSettings(d.settings));
            setAssistant(EMPTY_ASST);
            setConfirmBox(null); showToast("Draft imported.", "ok");
          },
        });
      } catch { showToast("That file isn't a valid draft export.", "err"); }
    };
    reader.readAsText(file);
  };
  const resetDraft = () => {
    setConfirmBox({
      message: `Reset ${activeSeason?.label || "this season"}?`,
      detail: "All picks, board tracking and budget history for this season will be cleared. Other seasons stay untouched. Export first if you want a backup.",
      onYes: () => {
        setPlayers([]); setBoard({}); setNextPick(1); setAssistant(EMPTY_ASST); setConfirmBox(null);
        showToast("Board reset. Budget restored.", "ok");
      },
    });
  };

  /* ------- display helpers ------- */
  const budgetTone = maxBid <= 3 && spotsLeft > 0 ? "danger" : (avgPerSpot < 6 && spotsLeft > 0 ? "warn" : "good");
  const valueTone = (v) => (v >= 3 ? "pos" : v <= -3 ? "neg" : "neu");
  const byeToneClass = byeInfo.level === 0 ? "good" : byeInfo.level === 1 ? "warn" : "danger";
  const historyRows = [...players].sort((a, b) => a.pick - b.pick);


  if (!loaded) {
    return (<div className="root"><div className="loading">Loading your board…</div></div>);
  }

  const navItems = [
    { id: "room", label: "Draft Room", icon: "stopwatch", fb: "◷", badge: null },
    { id: "team", label: "My Team", icon: "shield", fb: "▣", badge: `${drafted}/${ROSTER_SIZE}` },
    { id: "board", label: "Board", icon: "list-check", fb: "☰", badge: boardCounts.gone ? String(boardCounts.gone) : null },
    { id: "plan", label: "Plan", icon: "dollar", fb: "$", badge: planOverruns.length ? String(planOverruns.length) : null },
    { id: "settings", label: "Settings", icon: "settings", fb: "✦", badge: null },
  ];
  const settingsLabel = `${activeSeason?.label || "2026–27"} · ${settings.teams}-team · $${settings.budget} · 1.5 PPR`;

  /* ------- composable panels ------- */
  const assistantPanel = (
        <section className="panel wide asst-panel">
          <div className="panel-head">
            <div className="asst-title-block">
              <span className="eyebrow">Player on the block</span>
              <span className="asst-sub">Enter the name and current bid — the call updates live.</span>
            </div>
            <div className="health-line">
              <span className={`pill ${budgetHealth === "strong" || budgetHealth === "done" ? "good" : budgetHealth === "moderate" ? "warn" : "danger"}`}>
                Budget {budgetHealth === "done" ? "Done" : budgetHealth === "strong" ? "Strong" : budgetHealth === "moderate" ? "Moderate" : "Tight"}
              </span>
              <span className="health-avg">{spotsLeft > 0 ? `${money(avgPerSpot)}/player` : "—"}{openStarters.length > 0 ? ` · ${money(avgPerStarter)}/starter` : ""}</span>
            </div>
          </div>

          <div className="asst-grid">
            <div className="asst-inputs">
              <label className="field-label">
                <span>Player</span>
                <NameAutocomplete
                  value={assistant.name}
                  onChange={(v) => setAssistant((a) => ({ ...a, name: v }))}
                  onSelect={pickAssistantPlayer}
                  placeholder="Search name…"
                />
              </label>

              <div className="asst-row meta-row">
                <label className="field-label">
                  <span>Pos</span>
                  <select className="field" aria-label="Position" value={assistant.pos} onChange={(e) => setAssistant((a) => ({ ...a, pos: e.target.value }))}>
                    <option value="">—</option>{POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </label>
                <label className="field-label">
                  <span>Team</span>
                  <select className="field" aria-label="NFL team" value={assistant.team} onChange={(e) => setAssistant((a) => ({ ...a, team: e.target.value, bye: e.target.value ? String(TEAM_BYES[e.target.value]) : a.bye }))}>
                    <option value="">—</option>{TEAMS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="field-label">
                  <span>Bye</span>
                  <input className="field" inputMode="numeric" aria-label="Bye week" value={assistant.bye} onChange={(e) => setAssistant((a) => ({ ...a, bye: e.target.value }))} />
                </label>
              </div>

              <div className="asst-row value-row">
                <label className="field-label">
                  <span>Proj value</span>
                  <input className="field" inputMode="numeric" aria-label="Projected auction value in dollars" placeholder="$" onFocus={(e) => e.target.select()} value={assistant.proj} onChange={(e) => setAssistant((a) => ({ ...a, proj: e.target.value }))} />
                </label>
                <label className="field-label">
                  <span>Suggested max</span>
                  <input className="field" inputMode="numeric" aria-label="Suggested maximum bid in dollars" placeholder="$" onFocus={(e) => e.target.select()} value={assistant.presetMax} onChange={(e) => {
                    const v = e.target.value;
                    presetTouchedRef.current = v.trim() !== "";
                    setAssistant((a) => ({ ...a, presetMax: v }));
                  }} />
                </label>
              </div>

              <div className="bid-row">
                <button className="btn bid-step" onClick={() => bumpBid(-1)} aria-label="Lower bid by one dollar">−$1</button>
                <div className="bid-box">
                  <label htmlFor="asst-bid">Current bid</label>
                  <input id="asst-bid" className="bid-input" inputMode="numeric" aria-label="Current auction bid in dollars" value={assistant.bid} placeholder="—"
                          onChange={(e) => setAssistant((a) => ({ ...a, bid: e.target.value.replace(/[^0-9]/g, "") }))} />
                </div>
                <button className="btn bid-step" onClick={() => bumpBid(1)} aria-label="Raise bid by one dollar">+$1</button>
              </div>

              <div className="asst-actions">
                <button className="btn primary big" onClick={assistantDraft}>Draft player</button>
                <button className="btn" onClick={assistantGone}>Went elsewhere</button>
              </div>
            </div>

            <div className="asst-decision">
              <div className="asst-verdict">
                {analysis ? (
                  <>
                    <div className="call-head">
                      <div
                        className={`verdict ${analysis.tier}`}
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {analysis.tier === "idle" ? "READY" : analysis.tier === "bid" ? "BID" : analysis.tier === "value" ? "VALUE" : analysis.tier === "caution" ? "CAUTION" : "PASS"}
                      </div>
                      <div className="call-hero">
                        <span className="call-hero-label">Recommended max</span>
                        <span className="call-hero-num">{money(analysis.recMax)}</span>
                      </div>
                    </div>
                    <p className="verdict-why">{analysis.why}</p>
                    <dl className="verdict-nums" aria-label="Bid context">
                      <div><dt>Bid</dt><dd className="vn">{analysis.hasBid ? money(analysis.bid) : "—"}</dd></div>
                      <div><dt>Proj</dt><dd className="vn">{analysis.V != null ? money(analysis.V) : "—"}{analysis.projIn == null && analysis.V != null ? <em> est</em> : null}</dd></div>
                      <div><dt>Abs max</dt><dd className="vn">{money(analysis.absMax)}</dd></div>
                      <div><dt>Fills</dt><dd className="vn">{analysis.slotLabel || "—"}</dd></div>
                    </dl>
                    <PriceMeter bid={analysis.hasBid ? analysis.bid : null} V={analysis.V} recMax={analysis.recMax} absMax={analysis.absMax} tier={analysis.tier} />
                  </>
                ) : (
                  <div className="verdict-empty">Search a player to see the bid call and value meter.</div>
                )}

                <div className="asst-alt">
                  <div className="asst-alt-head">
                    <span className="eyebrow small">Still available{assistant.pos ? ` at ${assistant.pos}` : ""}</span>
                    {alternatives.length > 0 && <span className="asst-alt-count">{alternatives.length}</span>}
                  </div>
                  {alternatives.length === 0 ? (
                    <div className="empty-note compact">Load a player to compare next-best options.</div>
                  ) : (
                    <div className="alt-table">
                      <table className="alt-table-el">
                        <caption className="sr-only">Still available{assistant.pos ? ` at ${assistant.pos}` : ""}</caption>
                        <thead>
                          <tr>
                            <th scope="col">Tier</th>
                            <th scope="col">Player name</th>
                            <th scope="col">Team</th>
                            <th scope="col">Bye</th>
                            <th scope="col" className="num">Max price</th>
                            <th scope="col" className="sr-only">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alternatives.map((p) => (
                            <tr key={p.id}>
                              <td className="alt-tier">T{p.tier}</td>
                              <td className="alt-name">
                                <button type="button" className="linklike" onClick={() => pickAssistantPlayer(p)} aria-label={`Load ${p.name} into assistant`}>
                                  {p.name}
                                </button>
                              </td>
                              <td className="alt-team">{p.team || "—"}</td>
                              <td className="alt-bye">{p.bye ?? "—"}</td>
                              <td className="alt-est num">{p.est != null ? money(p.est) : "—"}</td>
                              <td>
                                <button className="icon-btn alt-gone" title="Mark off the board" aria-label={`Mark ${p.name} off the board`} onClick={() => setPriceAsk({ mode: "gone", player: p })}><Ic name="cross-small" fb="✕" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
  );

  const rosterPanel = (
        <section className="panel roster-panel">
          <div className="panel-head">
            <span className="eyebrow">My roster</span>
            <span className="panel-side">{openStarters.length > 0 ? `${openStarters.length} starting spots open` : "Starters set"}</span>
          </div>
          <div className="table-scroll roster-scroll">
          <table className="roster">
            <thead>
              <tr>
                <th scope="col" className="col-slot">Slot</th>
                <th scope="col" className="col-player">Player</th>
                <th scope="col" className="col-team">Team</th>
                <th scope="col" className="col-bye">Bye</th>
                <th scope="col" className="num col-paid">Paid</th>
                <th scope="col" className="num hide-xs col-value">Value</th>
                <th scope="col" className="sr-only col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((s) => {
                const p = occupied.get(s.id);
                const benchDivider = s.id === "B1";
                const rows = [];
                if (benchDivider) rows.push(
                  <tr key="bench-div" className="divider-row">
                    <td className="col-slot" aria-hidden="true"></td>
                    <td className="col-player">Bench</td>
                    <td className="col-team" aria-hidden="true"></td>
                    <td className="col-bye" aria-hidden="true"></td>
                    <td className="col-paid" aria-hidden="true"></td>
                    <td className="hide-xs col-value" aria-hidden="true"></td>
                    <td className="col-actions" aria-hidden="true"></td>
                  </tr>
                );
                if (!p) {
                  rows.push(
                    <tr key={s.id} className={`empty-row ${s.starter ? "need" : ""}`}>
                      <td className="slot col-slot">
                        <span className="slot-full">{s.label}</span>
                        <span className="slot-short">{s.starter ? s.label : s.id.replace(/^B/, "BN")}</span>
                      </td>
                      <td className="empty-cell col-player">
                        {s.starter ? (
                          <>
                            <span className="empty-full">Open — needs {s.accepts.join("/")}</span>
                            <span className="empty-short">Needs {s.accepts.join("/")}</span>
                          </>
                        ) : "Open"}
                      </td>
                      <td className="col-team" aria-hidden="true"></td>
                      <td className="col-bye" aria-hidden="true"></td>
                      <td className="num col-paid" aria-hidden="true"></td>
                      <td className="num hide-xs col-value" aria-hidden="true"></td>
                      <td className="actions col-actions" aria-hidden="true"></td>
                    </tr>
                  );
                } else {
                  const v = p.proj != null ? Number(p.proj) - p.price : null;
                  const meta = [p.team || null, p.bye ? `Bye ${p.bye}` : null].filter(Boolean).join(" · ");
                  rows.push(
                    <tr key={s.id}>
                      <td className="slot col-slot">
                        <span className="slot-full">{s.label}</span>
                        <span className="slot-short">{s.starter ? s.label : s.id.replace(/^B/, "BN")}</span>
                      </td>
                      <td className="pname col-player">
                        <span className="pname-main">{p.name}</span>
                        <span className={`pos-chip p-${p.pos}`}>{p.pos}</span>
                        {p.bye && byeInfo.groups[p.bye]?.length >= 3 ? <span className="bye-flag" title="Bye-week pileup"><Ic name="flag" fb="⚑" /></span> : null}
                        {meta ? <span className="pname-meta">{meta}</span> : null}
                      </td>
                      <td className="col-team">{p.team || "—"}</td>
                      <td className="col-bye">{p.bye || "—"}</td>
                      <td className="num money col-paid">{money(p.price)}</td>
                      <td className={`num val hide-xs col-value ${v == null ? "" : valueTone(v)}`}>{v == null ? "—" : v > 0 ? `+$${v}` : money(v)}</td>
                      <td className="actions col-actions">
                        <select className="move" value="" aria-label={`Move ${p.name} to another slot`} onChange={(e) => { movePlayer(p.id, e.target.value); e.target.value = ""; }} title="Move player">
                          <option value="" disabled>Move</option>
                          {SLOTS.filter((t2) => t2.id !== s.id && t2.accepts.includes(p.pos)).map((t2) => (
                            <option key={t2.id} value={t2.id}>{t2.label}{occupied.has(t2.id) ? " (swap)" : ""}</option>
                          ))}
                        </select>
                        <button className="icon-btn" title="Edit" aria-label={`Edit ${p.name}`} onClick={() => setEditRow({ ...p, proj: p.proj == null ? "" : String(p.proj) })}><Ic name="pencil" fb="✎" /></button>
                        <button className="icon-btn danger" title="Delete and refund" aria-label={`Delete ${p.name} and refund`} onClick={() => deletePlayer(p.id)}><Ic name="cross-small" fb="✕" /></button>
                      </td>
                    </tr>
                  );
                }
                return rows;
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className="col-slot" aria-hidden="true"></td>
                <td className="tfoot-label col-player">Total spent</td>
                <td className="col-team" aria-hidden="true"></td>
                <td className="col-bye" aria-hidden="true"></td>
                <td className="num money col-paid">{money(spent)}</td>
                <td className={`num val hide-xs col-value ${projected.length ? valueTone(totalValue) : ""}`}>{projected.length ? (totalValue > 0 ? `+$${totalValue}` : money(totalValue)) : "—"}</td>
                <td className="col-actions" aria-hidden="true"></td>
              </tr>
            </tfoot>
          </table>
          </div>

          {/* full add form */}
          <div className="add-form">
            <div className="eyebrow small">Full entry</div>
            <div className="add-grid">
              <NameAutocomplete
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                onSelect={(p) => setForm((f) => ({ ...f, name: p.name, pos: p.pos, team: p.team, bye: String(p.bye) }))}
                placeholder="Player name"
              />
              <select className="field" aria-label="Position" value={form.pos} onChange={(e) => setForm((f) => ({ ...f, pos: e.target.value }))}>
                <option value="">Pos</option>{POSITIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <select className="field" aria-label="NFL team" value={form.team} onChange={(e) => setForm((f) => ({ ...f, team: e.target.value, bye: e.target.value ? String(TEAM_BYES[e.target.value]) : f.bye }))}>
                <option value="">Team</option>{TEAMS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <input className="field" inputMode="numeric" placeholder="Bye" aria-label="Bye week" value={form.bye} onChange={(e) => setForm((f) => ({ ...f, bye: e.target.value }))} />
              <input className="field" inputMode="numeric" placeholder="Price $" aria-label="Auction price paid in dollars" onFocus={(e) => e.target.select()} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") tryAdd(form); }} />
              <input className="field" inputMode="numeric" placeholder="Proj $ (opt)" aria-label="Projected value in dollars, optional" onFocus={(e) => e.target.select()} value={form.proj} onChange={(e) => setForm((f) => ({ ...f, proj: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") tryAdd(form); }} />
              <button className="btn primary" onClick={() => tryAdd(form)}>Add player</button>
            </div>
          </div>
        </section>
  );

  const needsPanel = (
          <section className="panel needs-panel">
            <div className="panel-head">
              <span className="eyebrow">Position needs</span>
              <span className="panel-side">{flexOpen > 0 ? `+${flexOpen} FLEX open` : "starters / required"}</span>
            </div>
            <div className="pos-grid">
              {POS_ORDER.map((pos) => {
                const have = posCounts[pos] || 0;
                const need = posNeed[pos] || 0;
                const short = have < need;
                const over = !!settings.onlyOne[pos] && have > need;
                const note = short ? `need ${need - have}`
                  : over ? `${have - need} extra`
                  : need === 0 ? "not required"
                  : flexOpen > 0 && settings.flexEligible[pos] ? "✓ flex-able"
                  : "✓";
                return (
                  <div key={pos} className={`pos-cell ${short ? "short" : over ? "over" : "ok"}`}>
                    <span className={`pos-name p-${pos}`}>{pos}</span>
                    <span className="pos-count">{have}<em>/{need}</em></span>
                    <span className="pos-note">{note}</span>
                  </div>
                );
              })}
            </div>
            {openStarters.length > 0 ? (
              <div className="open-slots">Open starters: {openStarters.map((s) => s.label).join(" · ")}</div>
            ) : (
              <div className="open-slots done">All starting spots filled · {benchOpen} bench {benchOpen === 1 ? "spot" : "spots"} left</div>
            )}
          </section>
  );

  const byePanel = (
          <section className={`panel bye-panel ${byeToneClass}`}>
            <div className="panel-head">
              <span className="eyebrow">Bye weeks</span>
              <span className={`pill ${byeToneClass}`}>{byeInfo.level === 0 ? "Clean" : byeInfo.level === 1 ? "Minor overlap" : "Conflict"}</span>
            </div>
            {byeInfo.issues.length > 0 && (
              <ul className="issues">{byeInfo.issues.map((m, i) => <li key={i}>{m}</li>)}</ul>
            )}
            {Object.keys(byeInfo.groups).length === 0 ? (
              <div className="empty-note">Bye weeks appear here as you draft — you\u2019ll get a warning if too many starters share a week.</div>
            ) : (
              <div className="bye-list">
                {Object.entries(byeInfo.groups).sort((a, b) => a[0] - b[0]).map(([wk, list]) => {
                  const meta = byeInfo.weekMeta[wk] || {};
                  const rowClass = meta.severity || "";
                  const note = meta.samePos?.length
                    ? `Same-position stack (${meta.samePos.join(", ")})`
                    : meta.starterCount >= 2
                      ? "Mixed positions — usually fine"
                      : meta.shared
                        ? `${list.length} on this bye`
                        : null;
                  return (
                    <div key={wk} className={`bye-row ${rowClass}`}>
                      <span className="bye-wk">Wk {wk}</span>
                      <div className="bye-body">
                        <div className="bye-players">
                          {list.map((p) => (
                            <span key={p.id} className={`bye-chip${SLOT_BY_ID[p.slot]?.starter ? " starter" : ""}`} title={`${p.name} · ${p.pos}${SLOT_BY_ID[p.slot]?.starter ? " · starter" : " · bench"}`}>
                              <span className={`bye-pos p-${p.pos}`}>{p.pos}</span>
                              <span className="bye-pname">{p.name}</span>
                            </span>
                          ))}
                        </div>
                        {note && <span className="bye-note">{note}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
  );

  const healthPanel = (
          <section className="panel">
            <div className="panel-head"><span className="eyebrow">Value & health</span></div>
            <div className="value-line">
              <div><label>Projected</label><span>{projected.length ? money(totalProj) : "—"}</span></div>
              <div><label>Paid</label><span>{projected.length ? money(totalPaidProj) : "—"}</span></div>
              <div><label>Net value</label><span className={`val ${projected.length ? valueTone(totalValue) : ""}`}>{projected.length ? (totalValue > 0 ? `+$${totalValue}` : money(totalValue)) : "—"}</span></div>
            </div>
            <div className="bars">
              {[["Budget", health.budgetScore], ["Balance", health.balance], ["Byes", health.byeScore], ["Value", health.valueScore], ["Complete", health.completion]].map(([l, v]) => (
                <div key={l} className="bar-row">
                  <label>{l}</label>
                  <div className="bar"><div className={`bar-fill ${v >= 70 ? "good" : v >= 45 ? "warn" : "danger"}`} style={{ transform: `scaleX(${Math.max(0, Math.min(100, v)) / 100})` }} /></div>
                </div>
              ))}
            </div>
          </section>
  );

  const boardPanel = (
    <section className="panel wide">
      <div className="panel-head">
        <span className="eyebrow">Player board</span>
        <span className="panel-side">tap a name to load the assistant</span>
      </div>
            <div>
              <div className="board-controls">
                <div className="filter-row">
                  {BOARD_FILTERS.map((f) => (
                    <button key={f} className={`chip ${boardFilter === f ? "on" : ""}`} aria-pressed={boardFilter === f} onClick={() => setBoardFilter(f)}>{f === "ALL" ? "All" : f}</button>
                  ))}
                </div>
                <div className="filter-row">
                  <button className={`chip ${boardStarsOnly ? "on" : ""}`} aria-pressed={boardStarsOnly} onClick={() => setBoardStarsOnly((v) => !v)}>★ Starred{boardCounts.star ? ` (${boardCounts.star})` : ""}</button>
                  <button className={`chip ${boardShowGone ? "on" : ""}`} aria-pressed={boardShowGone} onClick={() => setBoardShowGone((v) => !v)}>{boardShowGone ? "Showing drafted" : "Hiding drafted"}</button>
                  {market.n >= 3 && (
                    <span className={`chip static ${market.pct > 8 ? "hot" : market.pct < -8 ? "cold" : ""}`}>
                      Market {market.pct > 0 ? `+${market.pct}%` : `${market.pct}%`} · {market.n} sales
                    </span>
                  )}
                </div>
              </div>
              {boardRows.length === 0 ? (
                <div className="empty-note">No players match these filters. Clear a position chip, or turn off ★ Starred / Hiding drafted to widen the list.</div>
              ) : (
                <div className="table-scroll board-scroll">
                <table className="flat">
                  <thead><tr><th></th><th>Player</th><th>Pos</th><th className="hide-xs">Team</th><th className="hide-xs">Bye</th><th className="num">Est $</th><th className="num hide-tiny">Paid</th><th>Status</th></tr></thead>
                  <tbody>
                    {boardRows.map((r) => (
                      <tr key={r.key} className={r.status !== "available" ? "dim" : ""}>
                        <td><button className={`star-btn ${r.star ? "on" : ""}`} title="Star player" aria-pressed={r.star} aria-label={`Star ${r.name}`}
                          onClick={() => toggleStar(r.name, { pos: r.pos, team: r.team, bye: r.bye })}><Ic name="star" solid={r.star} fb={r.star ? "★" : "☆"} /></button></td>
                        <td className="pname"><button className="linklike" onClick={() => { pickAssistantPlayer(r); setView("room"); window.scrollTo({ top: 0, behavior: "smooth" }); }} title="Load into Draft Assistant">{r.name}</button></td>
                        <td><span className={`posb p-${r.pos}`}>{r.pos}</span></td>
                        <td className="hide-xs">{r.team || "—"}</td>
                        <td className="hide-xs">{r.bye || "—"}</td>
                        <td className="num">{r.est != null ? money(r.est) : "—"}</td>
                        <td className={`num hide-tiny ${r.status === "mine" ? "money" : ""}`}>{r.price != null ? money(r.price) : "—"}</td>
                        <td>
                          <div className="seg">
                            <button className={`seg-btn ${r.status === "available" ? "on" : ""}`} aria-pressed={r.status === "available"} onClick={() => setBoardStatus(r, "available")}>Open</button>
                            <button className={`seg-btn mine ${r.status === "mine" ? "on" : ""}`} aria-pressed={r.status === "mine"} onClick={() => setBoardStatus(r, "mine")}>Mine</button>
                            <button className={`seg-btn gone ${r.status === "gone" ? "on" : ""}`} aria-pressed={r.status === "gone"} onClick={() => setBoardStatus(r, "gone")}>Gone</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
    </section>
  );

  const historyPanel = (
    <section className="panel wide">
      <div className="panel-head"><span className="eyebrow">Draft history ({historyRows.length})</span></div>
      {historyRows.length === 0 ? <div className="empty-note">No picks yet. Your first buy starts the clock.</div> : (
              <div className="table-scroll">
              <table className="flat">
                <thead><tr><th>Pick</th><th>Player</th><th>Pos</th><th className="hide-xs">Team</th><th className="num">Price</th><th className="num hide-xs">Value</th><th></th></tr></thead>
                <tbody>
                  {historyRows.map((p, i) => {
                    const v = p.proj != null ? Number(p.proj) - p.price : null;
                    return (
                      <tr key={p.id}>
                        <td className="slot">#{i + 1}</td>
                        <td className="pname">{p.name}</td>
                        <td><span className={`posb p-${p.pos}`}>{p.pos}</span></td><td className="hide-xs">{p.team || "—"}</td>
                        <td className="num money">{money(p.price)}</td>
                        <td className={`num val hide-xs ${v == null ? "" : valueTone(v)}`}>{v == null ? "—" : v > 0 ? `+$${v}` : money(v)}</td>
                        <td className="actions">
                          <button className="icon-btn" title="Edit" aria-label={`Edit ${p.name}`} onClick={() => setEditRow({ ...p, proj: p.proj == null ? "" : String(p.proj) })}><Ic name="pencil" fb="✎" /></button>
                          <button className="icon-btn danger" title="Undo pick" aria-label={`Undo pick: ${p.name}`} onClick={() => deletePlayer(p.id)}><Ic name="cross-small" fb="✕" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            )}
    </section>
  );

  const planPanel = (
    <section className="panel wide">
      <div className="panel-head">
        <span className="eyebrow">Budget plan</span>
        <span className="panel-side">{planOverruns.length ? `Over at ${planOverruns.join(", ")}` : "Guidelines only"}</span>
      </div>
            <div className="table-scroll">
              <table className="flat">
                <thead><tr><th>Category</th><th className="num">Target $</th><th className="num">Spent</th><th className="num plan-derived">Left in plan</th><th className="num">Over / under</th></tr></thead>
                <tbody>
                  {PLAN_CATS.map((c) => {
                    const tgt = Number(plan[c]) || 0;
                    const sp = planSpend[c];
                    const diff = tgt - sp;
                    return (
                      <tr key={c}>
                        <td className="slot">{c}</td>
                        <td className="num"><input className="field plan-input" inputMode="numeric" aria-label={`${c} target budget in dollars`} value={plan[c]}
                          onChange={(e) => setPlan((pl) => ({ ...pl, [c]: e.target.value.replace(/[^0-9]/g, "") }))} /></td>
                        <td className="num money">{money(sp)}</td>
                        <td className="num plan-derived">{money(Math.max(0, diff))}</td>
                        <td className={`num val ${diff < 0 ? "neg" : sp > 0 ? "pos" : "neu"}`}>{diff < 0 ? `${money(diff)} over` : sp > 0 ? `${money(diff)} under` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="tfoot-label">Totals</td>
                    <td className="num money">{money(PLAN_CATS.reduce((s, c) => s + (Number(plan[c]) || 0), 0))}</td>
                    <td className="num money">{money(spent)}</td>
                    <td colSpan={2} className="plan-note">
                      {PLAN_CATS.reduce((s, c) => s + (Number(plan[c]) || 0), 0) !== BUDGET ? `Plan totals ${money(PLAN_CATS.reduce((s, c) => s + (Number(plan[c]) || 0), 0))} — a ${money(BUDGET)} plan keeps the math honest. ` : ""}
                      {planOverruns.length > 0 ? `Over plan at ${planOverruns.join(", ")} — trim ${money(planOverruns.reduce((s, c) => s + (planSpend[c] - (Number(plan[c]) || 0)), 0))} elsewhere.` : "Guidelines only — nothing here blocks a pick."}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
    </section>
  );

  const setStarter = (pos, delta) => setSettings((st) => normalizeSettings({
    ...st, starters: { ...st.starters, [pos]: clampInt((st.starters[pos] || 0) + delta, 0, 10) },
  }));

  const settingsPanel = (
    <section className="panel wide">
      <div className="panel-head">
        <span className="eyebrow">League & roster settings</span>
        <span className="panel-side">{ROSTER_SIZE} total spots · {SLOTS.filter((x) => x.starter).length} starters · {settings.bench} bench</span>
      </div>

      <div className="set-grid">
        <div className="set-block">
          <div className="eyebrow small">Starting lineup</div>
          {["QB", "RB", "WR", "TE", "FLEX", "K", "DEF"].map((pos) => (
            <div key={pos} className="stepper-row">
              <span className="stepper-label">{pos}</span>
              <div className="stepper">
                <button className="btn step" onClick={() => setStarter(pos, -1)} aria-label={`Fewer ${pos}`}>−</button>
                <span className="stepper-val">{settings.starters[pos]}</span>
                <button className="btn step" onClick={() => setStarter(pos, 1)} aria-label={`More ${pos}`}>+</button>
              </div>
            </div>
          ))}
          <div className="stepper-row">
            <span className="stepper-label">Bench</span>
            <div className="stepper">
              <button className="btn step" onClick={() => setSettings((st) => normalizeSettings({ ...st, bench: st.bench - 1 }))} aria-label="Fewer bench">−</button>
              <span className="stepper-val">{settings.bench}</span>
              <button className="btn step" onClick={() => setSettings((st) => normalizeSettings({ ...st, bench: st.bench + 1 }))} aria-label="More bench">+</button>
            </div>
          </div>
        </div>

        <div className="set-block">
          <div className="eyebrow small">League</div>
          <label className="set-field">Budget per team
            <input className="field" inputMode="numeric" value={settings.budget}
              onChange={(e) => setSettings((st) => ({ ...st, budget: e.target.value.replace(/[^0-9]/g, "") || 0 }))}
              onBlur={() => setSettings((st) => normalizeSettings(st))} />
          </label>
          <label className="set-field">Teams in league
            <input className="field" inputMode="numeric" value={settings.teams}
              onChange={(e) => setSettings((st) => ({ ...st, teams: e.target.value.replace(/[^0-9]/g, "") || 0 }))}
              onBlur={() => setSettings((st) => normalizeSettings(st))} />
          </label>
          <div className="eyebrow small mt">FLEX accepts</div>
          <div className="toggle-row">
            {POSITIONS.map((pos) => (
              <button key={pos} className={`chip ${settings.flexEligible[pos] ? "on" : ""}`} aria-pressed={settings.flexEligible[pos]}
                onClick={() => setSettings((st) => ({ ...st, flexEligible: { ...st.flexEligible, [pos]: !st.flexEligible[pos] } }))}>{pos}</button>
            ))}
          </div>
        </div>

        <div className="set-block">
          <div className="eyebrow small">Warn on a second…</div>
          <div className="toggle-row">
            {POSITIONS.map((pos) => (
              <button key={pos} className={`chip ${settings.onlyOne[pos] ? "on" : ""}`} aria-pressed={settings.onlyOne[pos]}
                onClick={() => setSettings((st) => ({ ...st, onlyOne: { ...st.onlyOne, [pos]: !st.onlyOne[pos] } }))}>{pos}</button>
            ))}
          </div>
          <div className="empty-note">Highlighted positions trigger a confirm prompt if you draft more than you need — it never blocks the pick.</div>
          <div className="eyebrow small mt">Resulting roster</div>
          <div className="slot-preview">
            {SLOTS.map((sl) => <span key={sl.id} className={`slot-chip ${sl.starter ? "starter" : ""}`}>{sl.label}</span>)}
          </div>
          <button className="btn" onClick={() => setConfirmBox({
            message: "Restore default roster settings?",
            detail: "Back to 12 teams, $200, 1 QB / 2 RB / 3 WR / 1 TE / 1 FLEX / 1 K / 1 DEF and 6 bench. Your picks stay put.",
            onYes: () => { setSettings(DEFAULT_SETTINGS); setConfirmBox(null); showToast("Settings restored to defaults.", "ok"); },
          })}>Restore defaults</button>
        </div>
      </div>

      {players.length > 0 && (
        <div className="set-warn">Changing the lineup re-slots your {players.length} drafted {players.length === 1 ? "player" : "players"} automatically. Shrinking the roster below what you've drafted can leave players unslotted.</div>
      )}
    </section>
  );

  const dataPanel = (
    <section className="panel wide">
      <div className="panel-head"><span className="eyebrow">Draft data</span></div>
      <div className="data-actions">
        <button className="btn" onClick={exportDraft}><Ic name="download" fb="" /> Export JSON</button>
        <button className="btn" onClick={() => fileRef.current && fileRef.current.click()}><Ic name="upload" fb="" /> Import JSON</button>
        <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files[0]; if (f) importDraft(f); e.target.value = ""; }} />
        <button className="btn danger" onClick={resetDraft}><Ic name="refresh" fb="" /> Reset draft</button>
      </div>
      <div className="empty-note">Everything auto-saves as you go. Export before the draft if you want a manual backup.</div>
    </section>
  );

  return (
    <div className={`root view-${view}`} id="awr-root">
      <div id="awr-shell">
      <div className="topbar">
        <CommandHeader
          settingsLabel={settingsLabel}
          seasons={seasonList}
          activeSeasonId={activeSeasonId}
          onSelectSeason={switchSeason}
          onCreateNextSeason={startNextSeason}
          remaining={remaining}
          spent={spent}
          budget={BUDGET}
          maxBid={maxBid}
          spotsLeft={spotsLeft}
          budgetTone={budgetTone}
          drafted={drafted}
          rosterSpots={ROSTER_SIZE}
          avgPerSpot={avgPerSpot}
          healthLetter={health.letter}
          quick={quick}
          quickRef={quickRef}
          quickOpen={quickOpen}
          quickSugg={quickSugg}
          quickParsed={quickParsed}
          onQuickChange={(e) => { setQuick(e.target.value); setQuickOpen(true); }}
          onQuickFocus={(e) => { setQuickOpen(true); e.target.select(); }}
          onQuickBlur={() => setTimeout(() => setQuickOpen(false), 150)}
          onQuickKeyDown={(e) => { if (e.key === "Enter") runQuickAdd(); if (e.key === "Escape") setQuickOpen(false); }}
          onSelectQuick={selectQuick}
          onRunQuickAdd={runQuickAdd}
        />
        <ViewNav
          variant="desktop"
          items={navItems}
          view={view}
          onChange={changeView}
        />
      </div>

      <main className={`layout view-${view}`}>
        {view === "room" && (<>
          {assistantPanel}
          <div className="room-stack">
            {needsPanel}
            {byePanel}
          </div>
        </>)}

        {view === "team" && (<>
          {rosterPanel}
          <aside className="side">
            {needsPanel}
            {byePanel}
            {healthPanel}
          </aside>
          {historyPanel}
        </>)}

        {view === "board" && boardPanel}

        {view === "plan" && (<>
          {planPanel}
          {healthPanel}
        </>)}

        {view === "settings" && (<>
          <SeasonsPanel
            seasons={seasonList}
            activeId={activeSeasonId}
            onSelect={switchSeason}
            onCreateNext={startNextSeason}
            onRename={renameSeason}
          />
          {settingsPanel}
          {dataPanel}
        </>)}
      </main>

      <footer className="foot">
        {activeSeason ? `${activeSeason.name}. ` : ""}
        Bye weeks preloaded from the official 2026 schedule. Rosters move in the offseason — double-check team/bye when a suggestion looks stale. Icons: <a className="foot-link" href="https://www.flaticon.com/uicons" target="_blank" rel="noreferrer">Uicons by Flaticon</a>.
      </footer>
      </div>

      {/* Same items + changeView as desktop; portaled so fixed positioning is never trapped */}
      <ViewNav
        variant="mobile"
        items={navItems}
        view={view}
        onChange={changeView}
      />

      {/* ======= modals & toast ======= */}
      {confirmBox && (
        <Modal title={confirmBox.message} onClose={() => setConfirmBox(null)}>
          <p className="modal-body">{confirmBox.detail}</p>
          <div className="modal-actions">
            <button className="btn" onClick={() => setConfirmBox(null)}>Cancel</button>
            <button className="btn primary" onClick={confirmBox.onYes}>Yes, proceed</button>
          </div>
        </Modal>
      )}

      {disamb && (
        <Modal title={`Which player for ${money(disamb.price)}?`} onClose={() => setDisamb(null)}>
          <div className="disamb-list">
            {disamb.candidates.map((c) => (
              <button key={c.id} className="ac-item big" onClick={() => {
                setDisamb(null);
                tryAdd({ name: c.name, pos: c.pos, team: c.team, bye: c.bye, price: disamb.price, proj: "" });
              }}>
                <span>{c.name}</span><span className="ac-meta">{c.pos} · {c.team} · Bye {c.bye}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {priceAsk && (
        <PricePrompt
          target={priceAsk.player}
          mode={priceAsk.mode}
          onCancel={() => setPriceAsk(null)}
          onSkip={priceAsk.mode === "gone" ? () => { const t = priceAsk.player; setPriceAsk(null); markGone(t, null); if (norm(t.name) === norm(assistant.name)) clearAssistant(); } : null}
          onConfirm={(price) => {
            const t = priceAsk.player; setPriceAsk(null);
            if (priceAsk.mode === "gone") {
              markGone(t, price);
              if (norm(t.name) === norm(assistant.name)) clearAssistant();
            } else {
              tryAdd({ name: t.name, pos: t.pos, team: t.team, bye: t.bye || (t.team ? TEAM_BYES[t.team] : ""), price,
                proj: t.est != null ? String(t.est) : "" });
            }
          }} />
      )}

      {draftConfirm && (
        <PricePrompt target={draftConfirm}
          onCancel={() => setDraftConfirm(null)}
          onConfirm={(price) => {
            const t = draftConfirm; setDraftConfirm(null);
            tryAdd({
              name: t.name, pos: t.pos, team: t.team,
              bye: t.bye || (t.team ? TEAM_BYES[t.team] : ""), price,
              proj: t.proj !== "" && t.proj != null ? String(t.proj) : (t.targetPrice != null ? String(t.targetPrice) : ""),
            }, clearAssistant);
          }} />
      )}

      {editRow && (
        <Modal title={`Edit pick — ${editRow.name}`} onClose={() => setEditRow(null)}>
          <div className="edit-grid">
            <label>Name<input className="field" value={editRow.name} onChange={(e) => setEditRow((r) => ({ ...r, name: e.target.value }))} /></label>
            <label>Pos<select className="field" value={editRow.pos} onChange={(e) => setEditRow((r) => ({ ...r, pos: e.target.value }))}>{POSITIONS.map((p) => <option key={p}>{p}</option>)}</select></label>
            <label>Team<select className="field" value={editRow.team} onChange={(e) => setEditRow((r) => ({ ...r, team: e.target.value, bye: e.target.value ? String(TEAM_BYES[e.target.value]) : r.bye }))}><option value="">—</option>{TEAMS.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label>Bye<input className="field" inputMode="numeric" value={editRow.bye || ""} onChange={(e) => setEditRow((r) => ({ ...r, bye: e.target.value }))} /></label>
            <label>Price $<input className="field" inputMode="numeric" value={editRow.price} onChange={(e) => setEditRow((r) => ({ ...r, price: e.target.value }))} /></label>
            <label>Proj $<input className="field" inputMode="numeric" value={editRow.proj} onChange={(e) => setEditRow((r) => ({ ...r, proj: e.target.value }))} /></label>
            <label>Slot<select className="field" value={editRow.slot} onChange={(e) => setEditRow((r) => ({ ...r, slot: e.target.value }))}>
              {SLOTS.filter((s) => s.accepts.includes(editRow.pos)).map((s) => {
                const occ = occupied.get(s.id);
                return <option key={s.id} value={s.id}>{s.label}{occ && occ.id !== editRow.id ? ` (swap ${occ.name})` : ""}</option>;
              })}
            </select></label>
          </div>
          <div className="modal-actions">
            <button className="btn" onClick={() => setEditRow(null)}>Cancel</button>
            <button className="btn primary" onClick={() => saveEdit(editRow)}>Save changes</button>
          </div>
        </Modal>
      )}

      <div
        className={`toast ${toast?.type || ""}`}
        role={toast?.type === "err" ? "alert" : "status"}
        aria-live={toast?.type === "err" ? "assertive" : "polite"}
        aria-atomic="true"
        aria-hidden={!toast}
      >
        {toast?.msg || ""}
      </div>
    </div>
  );
}

function PricePrompt({ target, onCancel, onConfirm, mode = "mine", onSkip = null }) {
  const gone = mode === "gone";
  const suggest = target.maxBid != null ? Math.round(target.maxBid) : null;
  const [price, setPrice] = useState(() => (suggest != null ? String(suggest) : ""));
  const ok = price !== "" && Number.isFinite(Number(price));
  return (
    <Modal title={gone ? `${target.name} went to another team — final price?` : `You won ${target.name} — for how much?`} onClose={onCancel}>
      <div className="price-ask">
        <input className="field big-field" inputMode="numeric" /* Modal focuses this via effect; autoFocus would fire before the effect captures the opener */ aria-label={gone ? "Final sale price in dollars" : "Winning bid in dollars"}
          placeholder={suggest != null ? `${gone ? "Sold for" : "Winning bid"} — e.g. ${suggest}` : (gone ? "Sold for $" : "Winning bid $")}
          onFocus={(e) => e.target.select()}
          value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => { if (e.key === "Enter" && ok) onConfirm(Math.round(Number(price))); }} />
        {suggest != null && price !== String(suggest) && (
          <button className="btn tiny-fill" onClick={() => setPrice(String(suggest))}>Use {money(suggest)}</button>
        )}
        <span className="hint">
          {target.est != null ? `Estimated value ${money(target.est)}. ` : ""}
          {gone ? "Prices feed your market-inflation read — skip if you didn't catch it." : ""}
        </span>
      </div>
      <div className="modal-actions">
        <button className="btn" onClick={onCancel}>Cancel</button>
        {onSkip && <button className="btn" onClick={onSkip}>Skip price</button>}
        <button className="btn primary" disabled={!ok} onClick={() => onConfirm(Math.round(Number(price)))}>{gone ? "Mark gone" : "Add to roster"}</button>
      </div>
    </Modal>
  );
}

function meterEdge(p) {
  if (p >= 90) return "m-edge-end";
  if (p <= 10) return "m-edge-start";
  return "";
}

function PriceMeter({ bid, V, recMax, absMax, tier }) {
  const hasBid = bid != null;
  // Scale to the decision range — leftover abs budget must not crush Proj/Rec/Bid into a left pile
  const focusMax = Math.max(V || 0, recMax, bid || 0, 1);
  const includeAbsOnBar = absMax <= focusMax * 2.25;
  const scale = Math.max(focusMax * 1.5, includeAbsOnBar ? absMax : 0, 12);
  const pct = (x) => Math.min(100, Math.max(0, (x / scale) * 100));
  const greatEnd = V != null ? V * 0.82 : recMax * 0.6;
  const fairEnd = V != null ? Math.max(V, recMax * 0.8) : recMax * 0.85;

  const projPct = V != null ? pct(V) : null;
  const recPct = pct(recMax);
  const absPct = pct(absMax);
  const bidPct = hasBid ? pct(bid) : null;

  return (
    <div className={`meter-wrap${hasBid ? " has-bid" : ""}`}>
      <div className="meter" role="img" aria-label={`Value meter. Recommended max ${money(recMax)}${V != null ? `, projection ${money(V)}` : ""}, absolute max ${money(absMax)}${hasBid ? `, current bid ${money(bid)}` : ""}.`}>
        <div className="zone great" style={{ width: `${pct(greatEnd)}%` }} />
        <div className="zone fair" style={{ width: `${Math.max(0, pct(fairEnd) - pct(greatEnd))}%` }} />
        <div className="zone caution" style={{ width: `${Math.max(0, pct(recMax) - pct(fairEnd))}%` }} />
        <div className="zone over" style={{ width: `${Math.max(0, 100 - pct(recMax))}%` }} />
        {projPct != null && <div className={`marker m-proj ${meterEdge(projPct)}`} style={{ left: `${projPct}%` }} title={`Proj ${money(V)}`} />}
        <div className={`marker m-rec ${meterEdge(recPct)}`} style={{ left: `${recPct}%` }} title={`Rec ${money(recMax)}`} />
        {includeAbsOnBar && <div className={`marker m-abs ${meterEdge(absPct)}`} style={{ left: `${absPct}%` }} title={`Abs ${money(absMax)}`} />}
        {hasBid && (
          <div className={`bid-marker t-${tier} ${meterEdge(bidPct)}`} style={{ left: `${bidPct}%` }} title={`Bid ${money(bid)}`}>
            <div className="bid-tri" />
          </div>
        )}
      </div>
      <div className="meter-legend">
        <span>Great</span>
        <span>Fair</span>
        <span>Caution</span>
        <span>Overpay</span>
      </div>
    </div>
  );
}

/* ============================================================
   Styles — broadcast-scoreboard dark theme
   ============================================================ */
