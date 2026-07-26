import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

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

// Built-in player list [name, pos, team] — verify team/bye for offseason movers
const RAW_DB = [
  // QB
  ["Josh Allen","QB","BUF"],["Lamar Jackson","QB","BAL"],["Jalen Hurts","QB","PHI"],
  ["Patrick Mahomes","QB","KC"],["Joe Burrow","QB","CIN"],["Jayden Daniels","QB","WAS"],
  ["Justin Herbert","QB","LAC"],["Baker Mayfield","QB","TB"],["Jared Goff","QB","DET"],
  ["Bo Nix","QB","DEN"],["Caleb Williams","QB","CHI"],["Drake Maye","QB","NE"],
  ["Jordan Love","QB","GB"],["Kyler Murray","QB","ARI"],["Brock Purdy","QB","SF"],
  ["Dak Prescott","QB","DAL"],["Justin Fields","QB","NYJ"],["C.J. Stroud","QB","HOU"],
  ["Trevor Lawrence","QB","JAX"],["Tua Tagovailoa","QB","MIA"],["Matthew Stafford","QB","LAR"],
  ["Bryce Young","QB","CAR"],["Michael Penix Jr.","QB","ATL"],["J.J. McCarthy","QB","MIN"],
  ["Jaxson Dart","QB","NYG"],["Cam Ward","QB","TEN"],["Geno Smith","QB","LV"],
  ["Sam Darnold","QB","SEA"],["Daniel Jones","QB","IND"],["Aaron Rodgers","QB","PIT"],
  // RB
  ["Bijan Robinson","RB","ATL"],["Saquon Barkley","RB","PHI"],["Jahmyr Gibbs","RB","DET"],
  ["Christian McCaffrey","RB","SF"],["Derrick Henry","RB","BAL"],["Jonathan Taylor","RB","IND"],
  ["Ashton Jeanty","RB","LV"],["De'Von Achane","RB","MIA"],["Josh Jacobs","RB","GB"],
  ["Bucky Irving","RB","TB"],["Chase Brown","RB","CIN"],["Kyren Williams","RB","LAR"],
  ["James Cook","RB","BUF"],["Breece Hall","RB","NYJ"],["Chuba Hubbard","RB","CAR"],
  ["Kenneth Walker III","RB","SEA"],["James Conner","RB","ARI"],["Alvin Kamara","RB","NO"],
  ["David Montgomery","RB","DET"],["Aaron Jones","RB","MIN"],["Omarion Hampton","RB","LAC"],
  ["TreVeyon Henderson","RB","NE"],["Quinshon Judkins","RB","CLE"],["RJ Harvey","RB","DEN"],
  ["Kaleb Johnson","RB","PIT"],["D'Andre Swift","RB","CHI"],["Tony Pollard","RB","TEN"],
  ["Rhamondre Stevenson","RB","NE"],["Joe Mixon","RB","HOU"],["Nick Chubb","RB","HOU"],
  ["Zach Charbonnet","RB","SEA"],["Tyrone Tracy Jr.","RB","NYG"],["Cam Skattebo","RB","NYG"],
  ["Javonte Williams","RB","DAL"],["Jaylen Warren","RB","PIT"],["Isiah Pacheco","RB","KC"],
  ["Brian Robinson Jr.","RB","SF"],["Austin Ekeler","RB","WAS"],["Jordan Mason","RB","MIN"],
  ["Rachaad White","RB","TB"],["Ray Davis","RB","BUF"],["Tank Bigsby","RB","PHI"],
  ["Travis Etienne Jr.","RB","JAX"],["Bhayshul Tuten","RB","JAX"],["Jerome Ford","RB","CLE"],
  ["Najee Harris","RB","LAC"],["J.K. Dobbins","RB","DEN"],["Braelon Allen","RB","NYJ"],
  ["Tyjae Spears","RB","TEN"],["Blake Corum","RB","LAR"],["Kareem Hunt","RB","KC"],
  ["Trey Benson","RB","ARI"],["Jaydon Blue","RB","DAL"],["Dylan Sampson","RB","CLE"],
  ["Woody Marks","RB","HOU"],["Devin Neal","RB","NO"],["Kendre Miller","RB","NO"],
  ["Rico Dowdle","RB","CAR"],["Kimani Vidal","RB","LAC"],["Justice Hill","RB","BAL"],
  ["Roschon Johnson","RB","CHI"],["Antonio Gibson","RB","NE"],
  // WR
  ["Ja'Marr Chase","WR","CIN"],["Justin Jefferson","WR","MIN"],["CeeDee Lamb","WR","DAL"],
  ["Puka Nacua","WR","LAR"],["Amon-Ra St. Brown","WR","DET"],["Malik Nabers","WR","NYG"],
  ["Nico Collins","WR","HOU"],["Brian Thomas Jr.","WR","JAX"],["Drake London","WR","ATL"],
  ["A.J. Brown","WR","NE"],["Tyreek Hill","WR","MIA"],["Davante Adams","WR","LAR"],
  ["Mike Evans","WR","TB"],["Terry McLaurin","WR","WAS"],["Garrett Wilson","WR","NYJ"],
  ["Marvin Harrison Jr.","WR","ARI"],["Rome Odunze","WR","CHI"],["Ladd McConkey","WR","LAC"],
  ["Jaxon Smith-Njigba","WR","SEA"],["DK Metcalf","WR","PIT"],["Courtland Sutton","WR","DEN"],
  ["Zay Flowers","WR","BAL"],["DeVonta Smith","WR","PHI"],["Jaylen Waddle","WR","MIA"],
  ["Rashee Rice","WR","KC"],["Xavier Worthy","WR","KC"],["Tee Higgins","WR","CIN"],
  ["Jameson Williams","WR","DET"],["Jordan Addison","WR","MIN"],["Chris Olave","WR","NO"],
  ["Jerry Jeudy","WR","CLE"],["George Pickens","WR","DAL"],["Travis Hunter","WR","JAX"],
  ["Tetairoa McMillan","WR","CAR"],["Emeka Egbuka","WR","TB"],["Matthew Golden","WR","GB"],
  ["Jayden Reed","WR","GB"],["Ricky Pearsall","WR","SF"],["Jauan Jennings","WR","SF"],
  ["Deebo Samuel","WR","WAS"],["Calvin Ridley","WR","TEN"],["Michael Pittman Jr.","WR","IND"],
  ["Josh Downs","WR","IND"],["Keon Coleman","WR","BUF"],["Khalil Shakir","WR","BUF"],
  ["Stefon Diggs","WR","NE"],["Chris Godwin","WR","TB"],["Cooper Kupp","WR","SEA"],
  ["Rashid Shaheed","WR","NO"],["Darnell Mooney","WR","ATL"],["Wan'Dale Robinson","WR","NYG"],
  ["Luther Burden III","WR","CHI"],["Jack Bech","WR","LV"],["Tre Harris","WR","LAC"],
  ["Kyle Williams","WR","NE"],["Jayden Higgins","WR","HOU"],["Marvin Mims Jr.","WR","DEN"],
  ["Quentin Johnston","WR","LAC"],["Brandon Aiyuk","WR","SF"],["Christian Kirk","WR","HOU"],
  ["Hollywood Brown","WR","KC"],["Cedric Tillman","WR","CLE"],["DJ Moore","WR","CHI"],
  ["Romeo Doubs","WR","GB"],["Rashod Bateman","WR","BAL"],["Alec Pierce","WR","IND"],
  ["Jakobi Meyers","WR","JAX"],["Xavier Legette","WR","CAR"],["Keenan Allen","WR","LAC"],
  ["Adam Thielen","WR","MIN"],
  // TE
  ["Brock Bowers","TE","LV"],["Trey McBride","TE","ARI"],["George Kittle","TE","SF"],
  ["Sam LaPorta","TE","DET"],["T.J. Hockenson","TE","MIN"],["David Njoku","TE","CLE"],
  ["Mark Andrews","TE","BAL"],["Evan Engram","TE","DEN"],["Tucker Kraft","TE","GB"],
  ["Dallas Goedert","TE","PHI"],["Jake Ferguson","TE","DAL"],["Tyler Warren","TE","IND"],
  ["Colston Loveland","TE","CHI"],["Dalton Kincaid","TE","BUF"],["Kyle Pitts","TE","ATL"],
  ["Hunter Henry","TE","NE"],["Jonnu Smith","TE","PIT"],["Pat Freiermuth","TE","PIT"],
  ["Zach Ertz","TE","WAS"],["Cade Otton","TE","TB"],["Juwan Johnson","TE","NO"],
  ["Chig Okonkwo","TE","TEN"],["Isaiah Likely","TE","BAL"],["Harold Fannin Jr.","TE","CLE"],
  ["Ja'Tavion Sanders","TE","CAR"],["Brenton Strange","TE","JAX"],["Mason Taylor","TE","NYJ"],
  ["Theo Johnson","TE","NYG"],["Oronde Gadsden II","TE","LAC"],["Travis Kelce","TE","KC"],
  // K
  ["Brandon Aubrey","K","DAL"],["Jake Bates","K","DET"],["Cameron Dicker","K","LAC"],
  ["Chris Boswell","K","PIT"],["Ka'imi Fairbairn","K","HOU"],["Chase McLaughlin","K","TB"],
  ["Tyler Loop","K","BAL"],["Harrison Butker","K","KC"],["Jason Sanders","K","MIA"],
  ["Evan McPherson","K","CIN"],["Wil Lutz","K","DEN"],["Jason Myers","K","SEA"],
  ["Cairo Santos","K","CHI"],["Tyler Bass","K","BUF"],["Matt Gay","K","WAS"],
  ["Will Reichard","K","MIN"],["Daniel Carlson","K","LV"],["Jake Elliott","K","PHI"],
  ["Joshua Karty","K","LAR"],["Spencer Shrader","K","IND"],
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

const STORAGE_KEY = "ffad-2026-v1";
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const money = (n) => (n < 0 ? `-$${Math.abs(Math.round(n))}` : `$${Math.round(n)}`);

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

/* ---------- small UI atoms ---------- */
// Flaticon UIcons, subset + embedded as a data-URI font — no CDN, no fallback needed
const Ic = ({ name, n, solid, fb, className = "" }) => <i className={`fi ic-${name || n}${className ? ` ${className}` : ""}`} aria-hidden="true" />;

function Modal({ title, children, onClose }) {
  const boxRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const opener = document.activeElement;
    const box = boxRef.current;
    // focus the first field if there is one, otherwise the dialog itself
    const first = box && box.querySelector("input, select, textarea, button");
    if (first) first.focus(); else if (box) box.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); closeRef.current(); return; }
      if (e.key !== "Tab" || !box) return;
      const items = [...box.querySelectorAll("button, input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((el) => !el.disabled);
      if (!items.length) return;
      const firstEl = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      // hand focus back to the trigger — unless the action removed it from the page
      if (opener && opener.isConnected && typeof opener.focus === "function") opener.focus();
    };
  }, []); // mount/unmount only — onClose read via ref so effect never re-runs mid-life
  return (
    <div className="modal-veil" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" ref={boxRef} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <div className="modal-head">
          <span className="eyebrow">{title}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog"><Ic name="cross-small" fb="✕" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NameAutocomplete({ value, onChange, onSelect, placeholder, inputRef, posFilter, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const sugg = useMemo(() => {
    if (!value || value.length < 2) return [];
    return fuzzyMatch(value, posFilter, 8);
  }, [value, posFilter]);
  return (
    <div className="ac-wrap">
      <input
        ref={inputRef}
        className="field"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        autoComplete="off"
      />
      {open && sugg.length > 0 && (
        <div className="ac-list">
          {sugg.map((p) => (
            <button key={p.id} className="ac-item" onMouseDown={(e) => { e.preventDefault(); onSelect(p); setOpen(false); }}>
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
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
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
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ------- persistence (artifact storage; survives refresh/close) ------- */
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r && r.value) {
          const d = JSON.parse(r.value);
          if (Array.isArray(d.players)) setPlayers(d.players);
          if (d.board && typeof d.board === "object") setBoard(d.board);
          else if (Array.isArray(d.targets)) {
            // migrate old target list → board entries
            const b = {};
            d.targets.forEach((t) => {
              b[boardKey(t.name)] = {
                name: t.name, pos: t.pos, team: t.team, bye: t.bye,
                star: (t.priority || 0) >= 4,
                status: t.status === "mine" ? "mine" : t.status === "opponent" ? "gone" : "available",
                price: null,
              };
            });
            setBoard(b);
          }
          if (typeof d.nextPick === "number") setNextPick(d.nextPick);
          if (d.assistant && typeof d.assistant === "object") setAssistant({ ...EMPTY_ASST, ...d.assistant });
          if (d.plan && typeof d.plan === "object") setPlan({ ...DEFAULT_PLAN, ...d.plan });
          if (typeof d.view === "string") setView(d.view);
          if (d.settings) setSettings(normalizeSettings(d.settings));
        }
      } catch (e) { /* first run — nothing saved yet */ }
      setLoaded(true);
    })();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({ players, board, nextPick, assistant, plan, view, settings }));
      } catch (e) { /* storage hiccup; will retry on next change */ }
    }, 500);
    return () => clearTimeout(t);
  }, [players, board, nextPick, assistant, plan, view, settings, loaded]);

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
    let level = 0; // 0 green, 1 yellow, 2 red
    if (qb && te && qb.bye && qb.bye === te.bye) {
      issues.push(`QB and TE share the Week ${qb.bye} bye`);
      level = Math.max(level, 1);
    }
    Object.entries(groups).forEach(([wk, list]) => {
      const starters = list.filter((p) => SLOT_BY_ID[p.slot]?.starter);
      if (starters.length >= 3) {
        issues.push(`${starters.length} starters off in Week ${wk}: ${starters.map((p) => p.name).join(", ")}`);
        level = Math.max(level, 2);
      } else if (starters.length === 2) {
        level = Math.max(level, 1);
      }
      if (list.length >= 4) {
        issues.push(`${list.length} total players off in Week ${wk}`);
        level = Math.max(level, 2);
      } else if (list.length === 3) {
        level = Math.max(level, 1);
      }
    });
    return { groups, issues, level };
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
    let recMax = V != null ? Math.round(V * mult) : (preset != null ? preset : Math.max(1, maxBid - softReserve));
    if (preset != null) recMax = Math.min(recMax, preset);
    recMax = Math.min(recMax, maxBid, Math.max(1, maxBid - softReserve));
    recMax = Math.max(1, recMax);

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

    return { pos, V, est, projIn, preset, bid, hasBid, recMax, absMax: maxBid, tier, why: why.join(" "), slot, slotLabel, discount };
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

  const bumpBid = (d) => setAssistant((a) => {
    const cur = a.bid === "" ? 0 : Math.round(Number(a.bid)) || 0;
    return { ...a, bid: String(Math.max(0, cur + d)) };
  });
  const clearAssistant = () => setAssistant(EMPTY_ASST);
  const assistantDraft = () => {
    if (!analysis) { showToast("Search for the player on the block first.", "err"); return; }
    setDraftConfirm({
      name: assistant.name, pos: assistant.pos, team: assistant.team,
      bye: assistant.bye, targetPrice: analysis.V != null ? analysis.V : null,
      maxBid: analysis.bid > 0 ? analysis.bid : (analysis.recMax || null),
      proj: assistant.proj,
    });
  };
  const toggleStar = (name, meta) => {
    const k = boardKey(name);
    setBoard((b) => ({ ...b, [k]: { ...(b[k] || { status: "available", price: null, ...meta }), ...meta, name, star: !b[k]?.star } }));
  };
  const assistantStar = () => {
    if (!assistant.name || !assistant.pos) { showToast("Pick a player first.", "err"); return; }
    toggleStar(assistant.name, { pos: assistant.pos, team: assistant.team, bye: assistant.bye ? Number(assistant.bye) : null });
    showToast(board[boardKey(assistant.name)]?.star ? "Star removed." : `★ ${assistant.name} starred.`, "ok");
  };
  const assistantGone = () => {
    if (!assistant.name || !assistant.pos) { clearAssistant(); return; }
    setPriceAsk({ mode: "gone", player: { name: assistant.name, pos: assistant.pos, team: assistant.team, bye: assistant.bye } });
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
    const blob = new Blob([JSON.stringify({ version: 3, exported: new Date().toISOString(), players, board, nextPick, plan, settings }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "auction-draft-2026.json";
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
      message: "Reset the entire draft?",
      detail: "All picks, board tracking and budget history will be cleared. Export first if you want a backup.",
      onYes: async () => {
        setPlayers([]); setBoard({}); setNextPick(1); setAssistant(EMPTY_ASST); setConfirmBox(null);
        try { await window.storage.delete(STORAGE_KEY); } catch {}
        showToast("Board reset. Budget back to $200.", "ok");
      },
    });
  };

  /* ------- display helpers ------- */
  const budgetTone = maxBid <= 3 && spotsLeft > 0 ? "danger" : (avgPerSpot < 6 && spotsLeft > 0 ? "warn" : "good");
  const valueTone = (v) => (v >= 3 ? "pos" : v <= -3 ? "neg" : "neu");
  const byeToneClass = byeInfo.level === 0 ? "good" : byeInfo.level === 1 ? "warn" : "danger";
  const historyRows = [...players].sort((a, b) => a.pick - b.pick);


  if (!loaded) {
    return (<div className="root"><style>{CSS}</style><div className="loading">Loading your board…</div></div>);
  }

  const navItems = [
    { id: "room", label: "Draft Room", icon: "stopwatch", fb: "◷", badge: null },
    { id: "team", label: "My Team", icon: "shield", fb: "▣", badge: `${drafted}/${ROSTER_SIZE}` },
    { id: "board", label: "Board", icon: "list-check", fb: "☰", badge: boardCounts.gone ? String(boardCounts.gone) : null },
    { id: "plan", label: "Plan", icon: "dollar", fb: "$", badge: planOverruns.length ? String(planOverruns.length) : null },
    { id: "settings", label: "Settings", icon: "settings", fb: "✦", badge: null },
  ];

  /* ------- composable panels ------- */
  const assistantPanel = (
        <section className="panel wide asst-panel">
          <div className="panel-head">
            <span className="eyebrow">Player on the block</span>
            <div className="health-line">
              <span className={`pill ${budgetHealth === "strong" || budgetHealth === "done" ? "good" : budgetHealth === "moderate" ? "warn" : "danger"}`}>
                Budget {budgetHealth === "done" ? "Done" : budgetHealth === "strong" ? "Strong" : budgetHealth === "moderate" ? "Moderate" : "Tight"}
              </span>
              <span className="health-avg">{spotsLeft > 0 ? `${money(avgPerSpot)}/player` : "—"}{openStarters.length > 0 ? ` · ${money(avgPerStarter)}/starter` : ""}</span>
            </div>
          </div>
          <div className="asst-grid">
            {/* inputs */}
            <div className="asst-inputs">
              <NameAutocomplete
                value={assistant.name}
                onChange={(v) => setAssistant((a) => ({ ...a, name: v }))}
                onSelect={pickAssistantPlayer}
                placeholder="Who's on the block?"
              />
              <div className="asst-row">
                <select className="field" aria-label="Position" value={assistant.pos} onChange={(e) => setAssistant((a) => ({ ...a, pos: e.target.value }))}>
                  <option value="">Pos</option>{POSITIONS.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select className="field" aria-label="NFL team" value={assistant.team} onChange={(e) => setAssistant((a) => ({ ...a, team: e.target.value, bye: e.target.value ? String(TEAM_BYES[e.target.value]) : a.bye }))}>
                  <option value="">Team</option>{TEAMS.map((t) => <option key={t}>{t}</option>)}
                </select>
                <input className="field" inputMode="numeric" placeholder="Bye" aria-label="Bye week" value={assistant.bye} onChange={(e) => setAssistant((a) => ({ ...a, bye: e.target.value }))} />
              </div>
              <div className="asst-row">
                <input className="field" inputMode="numeric" placeholder="Proj value $" aria-label="Projected auction value in dollars" onFocus={(e) => e.target.select()} value={assistant.proj} onChange={(e) => setAssistant((a) => ({ ...a, proj: e.target.value }))} />
                <input className="field" inputMode="numeric" placeholder="My preset max $" aria-label="My preset maximum bid in dollars" onFocus={(e) => e.target.select()} value={assistant.presetMax} onChange={(e) => setAssistant((a) => ({ ...a, presetMax: e.target.value }))} />
              </div>
              <div className="bid-row">
                <button className="btn bid-step" onClick={() => bumpBid(-1)} aria-label="Lower bid by one dollar">−$1</button>
                <div className="bid-box">
                  <label>Current bid</label>
                  <input className="bid-input" inputMode="numeric" aria-label="Current auction bid in dollars" value={assistant.bid} placeholder="—"
                          onChange={(e) => setAssistant((a) => ({ ...a, bid: e.target.value.replace(/[^0-9]/g, "") }))} />
                </div>
                <button className="btn bid-step" onClick={() => bumpBid(1)} aria-label="Raise bid by one dollar">+$1</button>
              </div>
              <div className="asst-actions">
                <button className="btn primary big" onClick={assistantDraft}>Draft player</button>
                <button className={`btn ${board[boardKey(assistant.name)]?.star ? "starred" : ""}`} aria-pressed={!!board[boardKey(assistant.name)]?.star} onClick={assistantStar}><Ic name="star" solid={!!board[boardKey(assistant.name)]?.star} fb={board[boardKey(assistant.name)]?.star ? "★" : "☆"} /> {board[boardKey(assistant.name)]?.star ? "Starred" : "Star"}</button>
                <button className="btn" onClick={assistantGone}>Went elsewhere</button>
              </div>
            </div>

            {/* verdict */}
            <div className="asst-verdict">
              {analysis ? (
                <>
                  <div className={`verdict ${analysis.tier}`}>
                    {analysis.tier === "idle" ? "READY" : analysis.tier === "bid" ? "BID" : analysis.tier === "value" ? "VALUE" : analysis.tier === "caution" ? "CAUTION" : "PASS"}
                  </div>
                  <p className="verdict-why">{analysis.why}</p>
                  <div className="verdict-nums">
                    <div><label>Current bid</label><span className="vn">{analysis.hasBid ? money(analysis.bid) : "—"}</span></div>
                    <div><label>Proj value</label><span className="vn">{analysis.V != null ? money(analysis.V) : "—"}{analysis.projIn == null && analysis.V != null ? <em> est</em> : null}</span></div>
                    <div><label>Rec max</label><span className="vn gold">{money(analysis.recMax)}</span></div>
                    <div><label>Abs max</label><span className="vn">{money(analysis.absMax)}</span></div>
                    <div><label>Fills</label><span className="vn">{analysis.slotLabel || "—"}</span></div>
                  </div>
                  <PriceMeter bid={analysis.hasBid ? analysis.bid : null} V={analysis.V} recMax={analysis.recMax} absMax={analysis.absMax} tier={analysis.tier} />
                </>
              ) : (
                <div className="verdict-empty">Search the player being auctioned and set the bid — the call updates live.</div>
              )}
            </div>

            {/* alternatives */}
            <div className="asst-alt">
              <div className="eyebrow small">Still available at {assistant.pos || "position"}</div>
              {alternatives.length === 0 ? (
                <div className="empty-note">Load a player above to compare the next-best options still on the board.</div>
              ) : (
                <table className="flat tiny">
                  <thead><tr><th>Tier</th><th>Player</th><th className="hide-xs">Team</th><th>Bye</th><th className="num">Est $</th><th></th></tr></thead>
                  <tbody>
                    {alternatives.map((p) => (
                      <tr key={p.id}>
                        <td className="slot">T{p.tier}</td>
                        <td className="pname"><button className="linklike" onClick={() => pickAssistantPlayer(p)} title="Load into assistant">{p.star ? <span className="star on"><Ic name="star" solid fb="★" /> </span> : null}{p.name}</button></td>
                        <td className="hide-xs">{p.team}</td><td>{p.bye}</td>
                        <td className="num">{p.est != null ? money(p.est) : "—"}</td>
                        <td className="actions"><button className="icon-btn" title="Mark off the board" aria-label={`Mark ${p.name} off the board`} onClick={() => setPriceAsk({ mode: "gone", player: p })}><Ic name="cross-small" fb="✕" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
          <div className="table-scroll">
          <table className="roster">
            <thead>
              <tr><th>Slot</th><th>Player</th><th>Team</th><th>Bye</th><th className="num">Paid</th><th className="num hide-xs">Value</th><th></th></tr>
            </thead>
            <tbody>
              {SLOTS.map((s) => {
                const p = occupied.get(s.id);
                const benchDivider = s.id === "B1";
                const rows = [];
                if (benchDivider) rows.push(
                  <tr key="bench-div" className="divider-row"><td colSpan={7}>Bench</td></tr>
                );
                if (!p) {
                  rows.push(
                    <tr key={s.id} className={`empty-row ${s.starter ? "need" : ""}`}>
                      <td className="slot">{s.label}</td>
                      <td colSpan={6} className="empty-cell">{s.starter ? `Open — needs ${s.accepts.join("/")}` : "Open"}</td>
                    </tr>
                  );
                } else {
                  const v = p.proj != null ? Number(p.proj) - p.price : null;
                  rows.push(
                    <tr key={s.id}>
                      <td className="slot">{s.label}</td>
                      <td className="pname">{p.name}<span className={`pos-chip p-${p.pos}`}>{p.pos}</span>{p.bye && byeInfo.groups[p.bye]?.length >= 3 ? <span className="bye-flag" title="Bye-week pileup"><Ic name="flag" fb="⚑" /></span> : null}</td>
                      <td>{p.team || "—"}</td>
                      <td>{p.bye || "—"}</td>
                      <td className="num money">{money(p.price)}</td>
                      <td className={`num val hide-xs ${v == null ? "" : valueTone(v)}`}>{v == null ? "—" : v > 0 ? `+$${v}` : money(v)}</td>
                      <td className="actions">
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
                <td colSpan={4} className="tfoot-label">Total spent</td>
                <td className="num money">{money(spent)}</td>
                <td className={`num val hide-xs ${projected.length ? valueTone(totalValue) : ""}`}>{projected.length ? (totalValue > 0 ? `+$${totalValue}` : money(totalValue)) : "—"}</td>
                <td></td>
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
          <section className="panel">
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
                {Object.entries(byeInfo.groups).sort((a, b) => a[0] - b[0]).map(([wk, list]) => (
                  <div key={wk} className={`bye-row ${list.filter((p) => SLOT_BY_ID[p.slot]?.starter).length >= 3 || list.length >= 4 ? "danger" : list.length >= 3 ? "warn" : ""}`}>
                    <span className="bye-wk">Wk {wk}</span>
                    <span className="bye-names">{list.map((p) => p.name).join(", ")}</span>
                  </div>
                ))}
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
    <div className="root">
      <style>{CSS}</style>

      {/* ======= command strip ======= */}
      <div className="topbar">
      <header className="command">
        <div className="brand">
          <div className="brand-title"><Ic name="bolt" solid fb="" className="brand-bolt" /> Auction War Room</div>
          <div className="brand-sub">12-team · $200 · 1.5 PPR · 16 roster spots · 2026</div>
        </div>
        <div className="paddles">
          <div className={`paddle ${budgetTone}`}>
            <span className="paddle-label">Budget left</span>
            <span className="paddle-num">{money(remaining)}</span>
            <span className="paddle-foot">of $200 · spent {money(spent)}</span>
          </div>
          <div className={`paddle prime ${budgetTone}`}>
            <span className="paddle-label">Max bid</span>
            <span className="paddle-num">{spotsLeft > 0 ? money(maxBid) : "—"}</span>
            <span className="paddle-foot">keeps $1 for each open spot</span>
          </div>
          <div className="mini-stats">
            <div className="mini"><span>{drafted}<em>/16</em></span><label>drafted</label></div>
            <div className="mini"><span>{spotsLeft}</span><label>spots left</label></div>
            <div className="mini"><span>{spotsLeft > 0 ? money(avgPerSpot) : "—"}</span><label>avg / spot</label></div>
            <div className="mini"><span className={`grade g${health.letter}`}>{health.letter}</span><label>grade</label></div>
          </div>
        </div>
        <div className="quickbar">
          <div className="ac-wrap quick-ac">
            <input
              ref={quickRef}
              className="quick-input"
              aria-label="Quick add: player name and price"
              value={quick}
              placeholder='Quick add — "Ja&#39;Marr Chase, WR, CIN, 52" or just "Chase 52"'
              onChange={(e) => { setQuick(e.target.value); setQuickOpen(true); }}
              onFocus={(e) => { setQuickOpen(true); e.target.select(); }}
              onBlur={() => setTimeout(() => setQuickOpen(false), 150)}
              onKeyDown={(e) => { if (e.key === "Enter") runQuickAdd(); if (e.key === "Escape") setQuickOpen(false); }}
              autoComplete="off"
            />
            {quickOpen && quickSugg.length > 0 && (
              <div className="ac-list">
                {quickSugg.map((p) => (
                  <button key={p.id} className="ac-item" onMouseDown={(e) => { e.preventDefault(); selectQuick(p); }}>
                    <span>{p.name}</span>
                    <span className="ac-meta">{p.pos} · {p.team} · Bye {p.bye}{quickParsed && quickParsed.price != null ? ` — add for ${money(quickParsed.price)}` : ""}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn primary big" onClick={runQuickAdd}>Add pick</button>
        </div>
        {budgetTone !== "good" && spotsLeft > 0 && (
          <div className={`ticker ${budgetTone}`}>
            {budgetTone === "danger"
              ? `Budget critical — max bid is ${money(maxBid)} with ${spotsLeft} spots to fill.`
              : `Budget getting tight — averaging ${money(avgPerSpot)} per remaining spot.`}
          </div>
        )}
      </header>

      <nav className="viewnav">
        {navItems.map((v) => (
          <button key={v.id} className={`navbtn ${view === v.id ? "on" : ""}`} aria-current={view === v.id ? "page" : undefined} onClick={() => setView(v.id)}>
            <span className="navicon"><Ic name={v.icon} solid={view === v.id} fb={v.fb} /></span>
            <span className="navlabel">{v.label}</span>
            {v.badge ? <span className="navbadge">{v.badge}</span> : null}
          </button>
        ))}
      </nav>
      </div>

      <main className={`layout view-${view}`}>
        {view === "room" && (<>
          {assistantPanel}
          {needsPanel}
          {byePanel}
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
          {settingsPanel}
          {dataPanel}
        </>)}
      </main>

      <footer className="foot">Bye weeks preloaded from the official 2026 schedule. Rosters move in the offseason — double-check team/bye when a suggestion looks stale. Icons: <a className="foot-link" href="https://www.flaticon.com/uicons" target="_blank" rel="noreferrer">Uicons by Flaticon</a>.</footer>

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

      {toast && <div className={`toast ${toast.type}`} key={toast.id}>{toast.msg}</div>}
    </div>
  );
}

function PricePrompt({ target, onCancel, onConfirm, mode = "mine", onSkip = null }) {
  const gone = mode === "gone";
  const suggest = target.maxBid != null ? Math.round(target.maxBid) : null;
  const [price, setPrice] = useState(""); // always blank — nothing to erase mid-auction
  const ok = price !== "" && Number.isFinite(Number(price));
  return (
    <Modal title={gone ? `${target.name} went to another team — final price?` : `You won ${target.name} — for how much?`} onClose={onCancel}>
      <div className="price-ask">
        <input className="field big-field" inputMode="numeric" /* Modal focuses this via effect; autoFocus would fire before the effect captures the opener */ aria-label={gone ? "Final sale price in dollars" : "Winning bid in dollars"}
          placeholder={suggest != null ? `${gone ? "Sold for" : "Winning bid"} — e.g. ${suggest}` : (gone ? "Sold for $" : "Winning bid $")}
          onFocus={(e) => e.target.select()}
          value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => { if (e.key === "Enter" && ok) onConfirm(Math.round(Number(price))); }} />
        {suggest != null && (
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

function PriceMeter({ bid, V, recMax, absMax, tier }) {
  const hasBid = bid != null;
  const scale = Math.max(absMax, (V || 0) * 1.3, recMax * 1.25, (bid || 0) + 4, 10);
  const pct = (x) => Math.min(100, Math.max(0, (x / scale) * 100));
  const greatEnd = V != null ? V * 0.82 : recMax * 0.6;
  const fairEnd = V != null ? Math.max(V, recMax * 0.8) : recMax * 0.85;
  const markers = [
    V != null ? { x: V, label: "Proj", cls: "m-proj" } : null,
    { x: recMax, label: "Rec", cls: "m-rec" },
    { x: absMax, label: "Abs", cls: "m-abs" },
  ].filter(Boolean);
  return (
    <div className="meter-wrap">
      <div className="meter">
        <div className="zone great" style={{ width: `${pct(greatEnd)}%` }} />
        <div className="zone fair" style={{ width: `${Math.max(0, pct(fairEnd) - pct(greatEnd))}%` }} />
        <div className="zone caution" style={{ width: `${Math.max(0, pct(recMax) - pct(fairEnd))}%` }} />
        <div className="zone over" style={{ width: `${Math.max(0, 100 - pct(recMax))}%` }} />
        {markers.map((m) => (
          <div key={m.label} className={`marker ${m.cls}`} style={{ left: `${pct(m.x)}%` }}>
            <span>{m.label} {money(m.x)}</span>
          </div>
        ))}
        {hasBid && (
          <div className={`bid-marker t-${tier}`} style={{ left: `${pct(bid)}%` }}>
            <div className="bid-tri" />
            <span>{money(bid)}</span>
          </div>
        )}
      </div>
      <div className="meter-legend"><span>Great value</span><span>Fair</span><span>Caution</span><span>Overpay</span></div>
    </div>
  );
}

/* ============================================================
   Styles — broadcast-scoreboard dark theme
   ============================================================ */
const CSS = `
/* Flaticon UIcons (subset, embedded) — https://www.flaticon.com/uicons */
@font-face {
  font-family: "uicons";
  src: url(data:font/woff2;base64,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) format("woff2");
  font-display: block;
}
/* Barlow Condensed Bold (OFL), subset + embedded; weight range mapped so 600-800 render without faux-bold */
@font-face {
  font-family: "Barlow Condensed";
  font-weight: 600 800;
  font-style: normal;
  src: url(data:font/woff2;base64,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FyNCILAKQyAuRyNHI2EgYLAgYGawAmIgsABQWLBAYFlmsAFjIyAgPIo4LbBALCMgLkawAiVGsBdDWFAbUllYIDxZLrEwARQrLbBBLCMgLkawAiVGsBdDWFIbUFlYIDxZLrEwARQrLbBCLCMgLkawAiVGsBdDWFAbUllYIDxZIyAuRrACJUawF0NYUhtQWVggPFkusTABFCstsEMssDorIyAuRrACJUawF0NYUBtSWVggPFkusTABFCstsEQssDsriiAgPLAGI0KKOCMgLkawAiVGsBdDWFAbUllYIDxZLrEwARQrsAZDLrAwKy2wRSywABawBCWwBCYgICBGI0dhsAwjQi5HI0cjYbALQysjIDwgLiM4sTABFCstsEYssQoEJUKwABawBCWwBCUgLkcjRyNhILAGI0KxDABCsAtDKyCwYFBYILBAUVizBCAFIBuzBCYFGllCQiMgR7AGQ7ACYiCwAFBYsEBgWWawAWNgILABKyCKimEgsARDYGQjsAVDYWRQWLAEQ2EbsAVDYFmwAyWwAmIgsABQWLBAYFlmsAFjYbACJUZhOCMgPCM4GyEgIEYjR7ABKyNhOCFZsTABFCstsEcssQA6Ky6xMAEUKy2wSCyxADsrISMgIDywBiNCIzixMAEUK7AGQy6wMCstsEkssAAVIEewACNCsgABARUUEy6wNiotsEossAAVIEewACNCsgABARUUEy6wNiotsEsssQABFBOwNyotsEwssDkqLbBNLLAAFkUjIC4gRoojYTixMAEUKy2wTiywCiNCsE0rLbBPLLIAAEYrLbBQLLIAAUYrLbBRLLIBAEYrLbBSLLIBAUYrLbBTLLIAAEcrLbBULLIAAUcrLbBVLLIBAEcrLbBWLLIBAUcrLbBXLLMAAABDKy2wWCyzAAEAQystsFksswEAAEMrLbBaLLMBAQBDKy2wWyyzAAABQystsFwsswABAUMrLbBdLLMBAAFDKy2wXiyzAQEBQystsF8ssgAARSstsGAssgABRSstsGEssgEARSstsGIssgEBRSstsGMssgAASCstsGQssgABSCstsGUssgEASCstsGYssgEBSCstsGcsswAAAEQrLbBoLLMAAQBEKy2waSyzAQAARCstsGosswEBAEQrLbBrLLMAAAFEKy2wbCyzAAEBRCstsG0sswEAAUQrLbBuLLMBAQFEKy2w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REZMVAAObGF0bgASACwAAAAoAAZBWkUgADZDQVQgAEZDUlQgAFZLQVogAGZUQVQgAHZUUksgAIYAAP//AAQAAAABAAIACQAA//8ABQAAAAEAAgADAAkAAP//AAUAAAABAAIABAAJAAD//wAFAAAAAQACAAUACQAA//8ABQAAAAEAAgAGAAkAAP//AAUAAAABAAIABwAJAAD//wAFAAAAAQACAAgACQAKZG5vbQA+ZnJhYwBEbGlnYQBObG9jbABUbG9jbABabG9jbABgbG9jbABmbG9jbABsbG9jbABybnVtcgB4AAAAAQAHAAAAAwAIAAkACgAAAAEACwAAAAEABQAAAAEAAwAAAAEAAAAAAAEAAgAAAAEAAQAAAAEABAAAAAEABgAOAEAAQABAAB4AQABAAHYAVABiAHYAjgDMAUABYAAGAAAAAQAIAAMAAAACASoAFAABASoAAQAAAAwAAQABAGUAAQAAAAEACAABAAYAAgABAAEAJAABAAAAAQAIAAEAKAAKAAEAAAABAAgAAQAG//UAAQABAGkAAQAAAAEACAABAAYAFAACAAEAQABJAAAABgAAAAIACgAiAAMAAQASAAEA1gAAAAEAAAANAAEAAQBeAAMAAQASAAEAvgAAAAEAAAANAAIAAQBKAFMAAAAEAAAAAQAIAAEAXgAFABAAGgBAAEoAVAABAAQAOwACAAsABAAKABIAGgAgADwAAwAhACQAPQADACEAKQA5AAIAJAA6AAIAKQABAAQAPgACACcAAQAEAD8AAgAnAAEABAB4AAIAcQABAAUACgAhACIAJABxAAQAAAABAAgAAQAIAAEADgABAAEAKQABAAQAKgACAGUAAQAAAAEACAABAAb/9gACAAEAVABdAAA=) format("woff2");
  font-display: swap;
}
.fi { font-family: "uicons" !important; font-style: normal; font-weight: normal; line-height: 1;
  display: inline-block; vertical-align: -0.11em; -webkit-font-smoothing: antialiased; }
.ic-stopwatch:before{content:"\\fcd3"} .ic-shield:before{content:"\\fbc2"} .ic-list-check:before{content:"\\f8b3"} .ic-dollar:before{content:"\\f571"} .ic-settings:before{content:"\\fbac"} .ic-bolt:before{content:"\\f26a"} .ic-cross-small:before{content:"\\f4ec"} .ic-download:before{content:"\\f585"} .ic-flag:before{content:"\\f688"} .ic-pencil:before{content:"\\fa17"} .ic-refresh:before{content:"\\fb12"} .ic-star:before{content:"\\fcc1"} .ic-upload:before{content:"\\fe4d"} .ic-plus-small:before{content:"\\fa8b"} .ic-minus-small:before{content:"\\f93d"} .ic-search:before{content:"\\fb98"} .ic-trophy:before{content:"\\fdf1"} .ic-gavel:before{content:"\\f6df"}
:root { color-scheme: dark; }
* { box-sizing: border-box; }
.root {
  --field: #0b0e13;
  --panel: #11151c;
  --panel-2: #171c26;
  --line: #252c39;
  --ink: #eef2f8;
  --muted: #8d99ac;
  --muted-2: #7f8ba0; /* dimmest text still >=4.5:1 on panels */
  --accent: #d2f53c;   /* volt */
  --accent-ink: #141807; /* text on volt */
  --green: #45d97e;
  --amber: #f3b64b;
  --red: #f1655f;
  --font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-disp: 'Barlow Condensed', 'Arial Narrow', 'Helvetica Neue', sans-serif;
  min-height: 100vh; background:
    linear-gradient(115deg, rgba(210,245,60,.05) 0%, transparent 22%),
    radial-gradient(1100px 460px at 75% -220px, #161d2b 0%, transparent 60%),
    var(--field);
  color: var(--ink);
  font-family: var(--font-ui);
  font-size: 14px; line-height: 1.45;
  padding: 0 0 40px;
}
.loading { padding: 60px; text-align: center; color: var(--muted); font-size: 16px; }

.eyebrow { font-size: 14px; letter-spacing: 0; text-transform: none; color: var(--ink); font-weight: 650; }
.eyebrow.small { display: block; margin-bottom: 8px; font-size: 12.5px; color: var(--muted); font-weight: 650; }

/* ---- command strip ---- */
.topbar { position: sticky; top: 0; z-index: 40; background: rgba(13,18,25,.94); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line); }
.command { padding: 12px clamp(12px, 3vw, 28px) 10px; }
.command > * { max-width: 1600px; margin-left: auto; margin-right: auto; }
.brand { display:flex; align-items: baseline; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
.brand-title { font-family: var(--font-disp); font-style: italic; font-size: 21px; font-weight: 800;
  letter-spacing: .03em; text-transform: uppercase; display: flex; align-items: center; gap: 7px; }
.brand-bolt { color: var(--accent); font-size: 17px; }
.brand-sub { color: var(--muted); font-size: 12px; }
.paddles { display: grid; grid-template-columns: auto auto 1fr; gap: 12px; align-items: stretch; margin-bottom: 10px; }
.paddle { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 8px 18px 10px; min-width: 150px;
  display:flex; flex-direction: column; }
.paddle.prime { border-color: var(--accent); box-shadow: 0 6px 20px rgba(0,0,0,.45); background: linear-gradient(180deg, #1a2130, #12161d); }
.paddle-label { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.paddle-num { font-family: var(--font-disp); font-style: italic; font-variant-numeric: tabular-nums;
  font-size: 46px; font-weight: 800; line-height: 1; letter-spacing: .01em; color: var(--green); }
.paddle.warn .paddle-num { color: var(--amber); }
.paddle.danger .paddle-num { color: var(--red); }
.paddle.prime .paddle-num { color: var(--accent); }
.paddle.prime.warn .paddle-num { color: var(--amber); }
.paddle.prime.danger .paddle-num { color: var(--red); }
.paddle-foot { font-size: 11px; color: var(--muted); }
.mini-stats { display: flex; gap: 8px; justify-content: flex-end; align-items: stretch; flex-wrap: wrap; }
.mini { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 6px 14px; text-align: center; min-width: 78px;
  display:flex; flex-direction: column; justify-content: center; }
.mini span { font-family: var(--font-disp); font-style: italic; font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
.mini span em { font-style: normal; color: var(--muted); font-size: 13px; }
.mini label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.grade.gA { color: var(--green); } .grade.gB { color: #9bd96a; } .grade.gC { color: var(--amber); }
.grade.gD { color: #f19a4b; } .grade.gF { color: var(--red); }
.quickbar { display: flex; gap: 8px; }
.quick-ac { flex: 1; }
.quick-ac .quick-input { width: 100%; }
.quick-ac .ac-item { font-size: 14.5px; padding: 11px 14px; }
.quick-input { flex: 1; background: var(--panel-2); border: 1px solid var(--line); border-radius: 10px; color: var(--ink);
  padding: 12px 14px; font-size: 15px; }
.quick-input:focus { outline: 2px solid var(--accent); outline-offset: 0; border-color: transparent; }
.ticker { margin-top: 8px; border-radius: 8px; padding: 7px 12px; font-size: 13px; font-weight: 600; }
.ticker.warn { background: rgba(243,182,75,.12); color: var(--amber); border: 1px solid rgba(243,182,75,.4); }
.ticker.danger { background: rgba(241,101,95,.12); color: var(--red); border: 1px solid rgba(241,101,95,.45); }

/* ---- layout ---- */
.layout { display: grid; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 16px;
  padding: 12px clamp(12px, 3vw, 28px) 0; align-items: start; max-width: 1600px; margin: 0 auto; }
.panel { background: var(--panel); border: 1px solid var(--line); border-radius: 9px; padding: 14px 16px 16px; }
.panel.wide { grid-column: 1 / -1; }
.panel-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; gap: 10px; }
.panel-side { color: var(--muted); font-size: 12px; }
.side { display: grid; gap: 16px; }
/* per-view desktop grids */
.layout.view-room { grid-template-columns: 1fr 1fr; }
.layout.view-board, .layout.view-plan, .layout.view-settings { grid-template-columns: minmax(0, 1fr); }

/* ---- roster table ---- */
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
  padding: 6px 8px; border-bottom: 1px solid var(--line); font-weight: 600; }
td { padding: 7px 8px; border-bottom: 1px solid rgba(39,50,69,.55); vertical-align: middle; }
.num { text-align: right; }
.money { font-family: ui-monospace, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; font-weight: 700; color: var(--green); }
.val { font-family: ui-monospace, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; font-weight: 700; }
.val.pos { color: var(--green); } .val.neg { color: var(--red); } .val.neu { color: var(--muted); }
.slot { font-size: 11px; letter-spacing: .08em; font-weight: 800; color: var(--accent); text-transform: uppercase; white-space: nowrap; }
.pname { font-weight: 650; }
.p-QB { color: #ff7a90; } .p-RB { color: #3ad0ab; } .p-WR { color: #5aa9ff; }
.p-TE { color: #ffab49; } .p-K { color: #c09aff; } .p-DEF { color: #9aa5b4; }
.posb { font-family: var(--font-disp); font-weight: 700; font-size: 12.5px; letter-spacing: .05em; }
.pos-chip { display: inline-block; margin-left: 7px; font-size: 10px; font-weight: 700; color: var(--muted);
  border: 1px solid var(--line); border-radius: 4px; padding: 0 4px; vertical-align: 1px; }
.bye-flag { color: var(--amber); margin-left: 6px; }
.empty-row td { color: var(--muted-2); }
.empty-row.need .empty-cell { color: var(--amber); }
.empty-cell { font-size: 12.5px; font-style: italic; }
.divider-row td { background: var(--panel-2); font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--muted); font-weight: 700; padding: 4px 8px; }
tfoot td { border-top: 2px solid var(--line); border-bottom: none; padding-top: 9px; }
.tfoot-label { text-align: right; color: var(--muted); text-transform: uppercase; font-size: 11px; letter-spacing: .1em; }
.actions { white-space: nowrap; text-align: right; }
.move { background: var(--panel-2); color: var(--muted); border: 1px solid var(--line); border-radius: 6px;
  font-size: 12px; padding: 4px 4px; max-width: 84px; }
.icon-btn { background: transparent; border: 1px solid var(--line); color: var(--muted); border-radius: 6px;
  width: 28px; height: 28px; margin-left: 4px; cursor: pointer; font-size: 13px; }
.icon-btn { transition: color .16s ease, border-color .16s ease; }
.icon-btn:hover { color: var(--ink); border-color: var(--muted); }
.icon-btn:active { transform: translateY(1px); }
.icon-btn.danger:hover { color: var(--red); border-color: var(--red); }

/* ---- forms ---- */
.add-form { margin-top: 14px; border-top: 1px dashed var(--line); padding-top: 12px; }
.add-grid { display: grid; grid-template-columns: minmax(160px, 2fr) 70px 84px 64px 84px 96px auto; gap: 8px; }
.field { background: var(--panel-2); border: 1px solid var(--line); border-radius: 8px; color: var(--ink);
  padding: 10px 10px; font-size: 14px; width: 100%; min-width: 0; }
.field:focus { outline: 2px solid var(--accent); border-color: transparent; }
select.field { appearance: auto; }
.btn { background: var(--panel-2); border: 1px solid var(--line); color: var(--ink); border-radius: 8px;
  padding: 10px 16px; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.btn { transition: background-color .16s ease, border-color .16s ease, color .16s ease; }
.btn:hover { border-color: var(--muted); }
.btn:active { transform: translateY(1px); }
.btn:disabled, .btn[disabled] { opacity: .45; cursor: not-allowed; }
.btn:disabled:hover { border-color: var(--line); }
.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-ink);
  font-family: var(--font-disp); font-style: italic; text-transform: uppercase; letter-spacing: .06em;
  font-weight: 700; font-size: 16px; }
.btn.primary:hover { filter: brightness(1.07); }
.btn.primary:disabled { opacity: .5; cursor: default; }
.btn.big { padding: 12px 22px; font-size: 15px; }
.btn.danger { color: var(--red); border-color: rgba(241,101,95,.5); }
.btn.danger:hover { background: rgba(241,101,95,.12); }

/* autocomplete */
.ac-wrap { position: relative; min-width: 0; }
.ac-list { position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 60; background: var(--panel-2);
  border: 1px solid var(--line); border-radius: 8px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,.5); }
.ac-item { display: flex; justify-content: space-between; gap: 12px; width: 100%; text-align: left; background: none;
  border: none; border-bottom: 1px solid rgba(39,50,69,.55); color: var(--ink); padding: 9px 12px; cursor: pointer; font-size: 13.5px; }
.ac-item:last-child { border-bottom: none; }
.ac-item:hover { background: rgba(210,245,60,.1); }
.ac-item.big { padding: 12px 14px; font-size: 15px; }
.ac-meta { color: var(--muted); font-size: 12px; white-space: nowrap; }

/* ---- position needs ---- */
.pos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pos-cell { border-radius: 8px; padding: 7px 9px; display: flex; flex-direction: column; gap: 1px; }
.pos-cell.ok { background: rgba(139,152,171,.06); }
.pos-cell.short { background: rgba(243,182,75,.1); }
.pos-cell.over { background: rgba(241,101,95,.1); }
.pos-name { font-size: 11px; letter-spacing: .1em; color: var(--muted); font-weight: 700; }
.pos-count { font-family: var(--font-disp); font-style: italic; font-size: 22px; font-weight: 700; line-height: 1.05; }
.pos-note { font-size: 11px; color: var(--muted); }
.pos-cell.short .pos-note { color: var(--amber); font-weight: 700; }
.pos-cell.over .pos-note { color: var(--red); font-weight: 700; }
.pos-cell.ok .pos-note { color: var(--green); }
.open-slots { margin-top: 10px; font-size: 12.5px; color: var(--amber); }

/* ---- byes ---- */
.pill { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; border-radius: 5px; padding: 3px 10px 3px 8px;
  display: inline-flex; align-items: center; gap: 6px; }
.pill::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex: none; }
.pill.good { background: rgba(69,217,126,.14); color: var(--green); }
.pill.warn { background: rgba(243,182,75,.14); color: var(--amber); }
.pill.danger { background: rgba(241,101,95,.15); color: var(--red); }
.bye-panel.warn { border-color: rgba(243,182,75,.45); }
.bye-panel.danger { border-color: rgba(241,101,95,.5); }
.issues { margin: 0 0 10px; padding-left: 18px; color: var(--amber); font-size: 13px; }
.bye-panel.danger .issues { color: var(--red); }
.bye-list { display: grid; gap: 5px; }
.bye-row { display: flex; gap: 10px; font-size: 13px; padding: 5px 2px; border-bottom: 1px solid rgba(39,50,69,.5); }
.bye-row:last-child { border-bottom: none; }
.bye-row.warn { background: rgba(243,182,75,.09); border-radius: 5px; padding-left: 8px; padding-right: 8px; }
.bye-row.danger { background: rgba(241,101,95,.1); border-radius: 5px; padding-left: 8px; padding-right: 8px; }
.bye-wk { font-family: ui-monospace, Menlo, monospace; color: var(--accent); font-weight: 700; white-space: nowrap; }
.bye-names { color: var(--ink); }
.empty-note { color: var(--muted); font-size: 13px; padding: 8px 2px; }

/* ---- value & health ---- */
.value-line { display: flex; gap: 18px; margin-bottom: 12px; }
.value-line div { display: flex; flex-direction: column; }
.value-line label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.value-line span { font-family: ui-monospace, Menlo, monospace; font-size: 18px; font-weight: 700; }
.bars { display: grid; gap: 7px; }
.bar-row { display: grid; grid-template-columns: 72px 1fr; gap: 10px; align-items: center; }
.bar-row label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
.bar { height: 7px; background: var(--panel-2); border-radius: 6px; overflow: hidden; }
.bar-fill { height: 100%; width: 100%; border-radius: 6px; transform-origin: left center;
  transition: transform .2s cubic-bezier(.22,1,.36,1); }
.bar-fill.good { background: var(--green); } .bar-fill.warn { background: var(--amber); } .bar-fill.danger { background: var(--red); }

/* ---- tabs / board / history ---- */
table.flat td { font-size: 13.5px; }
tr.dim { opacity: .45; }
.stars { color: var(--accent); letter-spacing: 1px; white-space: nowrap; }
.seg { display: inline-flex; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
.seg-btn { background: none; border: none; color: var(--muted); padding: 5px 10px; font-size: 12px; font-weight: 700; cursor: pointer;
  border-right: 1px solid var(--line); }
.seg-btn:last-child { border-right: none; }
.seg-btn { transition: background-color .16s ease, color .16s ease; }
.seg-btn:hover { color: var(--ink); }
.seg-btn.on { background: var(--panel-2); color: var(--ink); }
.seg-btn.mine.on { color: var(--green); }
.seg-btn.gone.on { color: var(--red); }

/* ---- modals & toast ---- */
.modal-veil { position: fixed; inset: 0; background: rgba(5,8,12,.7); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; width: min(460px, 100%);
  padding: 16px 18px 18px; box-shadow: 0 20px 60px rgba(0,0,0,.6); }
.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.modal-body { margin: 0 0 14px; color: var(--ink); font-size: 14.5px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.disamb-list { display: grid; gap: 6px; }
.edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.edit-grid label { display: flex; flex-direction: column; gap: 4px; font-size: 11px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--muted); font-weight: 700; }
.edit-grid label:first-child { grid-column: 1 / -1; }
.price-ask { display: flex; flex-direction: column; gap: 8px; }
.big-field { font-size: 20px; font-family: ui-monospace, Menlo, monospace; }
.hint { color: var(--muted); font-size: 12.5px; }
.btn.tiny-fill { align-self: flex-start; padding: 6px 12px; font-size: 12.5px; min-height: 34px; color: var(--accent); border-color: rgba(210,245,60,.45); }
.toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 120;
  background: var(--panel-2); border: 1px solid var(--line); border-radius: 10px; padding: 11px 18px;
  font-weight: 650; box-shadow: 0 10px 30px rgba(0,0,0,.5); animation: rise .18s ease; max-width: 92vw; }
.toast.ok { border-color: rgba(69,217,126,.5); color: var(--green); }
.toast.err { border-color: rgba(241,101,95,.55); color: var(--red); }
.toast.warn { border-color: rgba(243,182,75,.5); color: var(--amber); }
@keyframes rise { from { transform: translate(-50%, 8px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

.fi { display: inline-flex; vertical-align: -2px; line-height: 1; }
.navicon .fi { font-size: 16px; }
.icon-btn .fi { font-size: 14px; vertical-align: -1px; }
.star-btn .fi { font-size: 16px; }
.btn .fi { font-size: 13px; margin-right: 2px; vertical-align: -1.5px; }
.foot-link { color: var(--muted); }
.foot { padding: 18px clamp(12px, 3vw, 28px) 0; color: var(--muted-2); font-size: 12px; max-width: 1600px; margin: 0 auto; }

@media (prefers-reduced-motion: reduce) {
  .toast, .bar-fill, .btn, .chip, .icon-btn, .navbtn, .seg-btn { animation: none; transition: none; }
  .btn:active, .chip:active, .icon-btn:active { transform: none; }
}

/* ---- draft assistant ---- */
.asst-panel { border-color: rgba(210,245,60,.4); background: linear-gradient(180deg, #17202e, var(--panel)); }
.health-line { display: flex; align-items: center; gap: 10px; }
.health-avg { color: var(--muted); font-size: 12.5px; font-family: ui-monospace, Menlo, monospace; }
.asst-grid { display: grid; grid-template-columns: minmax(240px, 1fr) minmax(300px, 1.4fr) minmax(240px, 1fr); gap: 18px; align-items: start; }
.asst-inputs { display: grid; gap: 8px; }
.asst-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.asst-row:nth-of-type(3) { grid-template-columns: 1fr 1fr; }
.bid-row { display: grid; grid-template-columns: auto 1fr auto; gap: 8px; align-items: stretch; margin-top: 2px; }
.bid-step { font-size: 20px; font-weight: 800; padding: 0 20px; min-height: 58px; font-family: ui-monospace, Menlo, monospace; }
.bid-box { background: var(--panel-2); border: 1px solid var(--line); border-radius: 10px; padding: 5px 12px 7px; text-align: center; }
.bid-box label { display: block; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.bid-input { width: 100%; background: none; border: none; color: var(--ink); text-align: center;
  font-family: ui-monospace, Menlo, monospace; font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
.bid-input:focus { outline: none; }
.bid-box:focus-within { outline: 2px solid var(--accent); }
.asst-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.asst-actions .btn { flex: 1; }
.asst-verdict { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding-top: 2px; }
.verdict { font-family: var(--font-disp); font-style: italic; font-size: 42px; font-weight: 800;
  letter-spacing: .05em; padding: 6px 26px 8px; border-radius: 10px; text-transform: uppercase; }
.verdict.bid { color: var(--green); background: rgba(69,217,126,.1); box-shadow: inset 0 0 0 2px rgba(69,217,126,.5); }
.verdict.value { color: #62b6ff; background: rgba(98,182,255,.1); box-shadow: inset 0 0 0 2px rgba(98,182,255,.45); }
.verdict.caution { color: var(--amber); background: rgba(243,182,75,.1); box-shadow: inset 0 0 0 2px rgba(243,182,75,.5); }
.verdict.idle { color: var(--muted); background: rgba(139,152,171,.08); box-shadow: inset 0 0 0 2px rgba(139,152,171,.35); }
.verdict.nobid { color: var(--muted); background: rgba(139,152,171,.08); box-shadow: inset 0 0 0 2px rgba(139,152,171,.3); }
.verdict.pass { color: var(--red); background: rgba(241,101,95,.1); box-shadow: inset 0 0 0 2px rgba(241,101,95,.5); }
.verdict-why { margin: 0; font-size: 14.5px; max-width: 46ch; color: var(--ink); }
.verdict-empty { color: var(--muted); font-size: 14px; padding: 30px 10px; }
.verdict-nums { display: flex; gap: 18px; flex-wrap: wrap; justify-content: center; }
.verdict-nums div { display: flex; flex-direction: column; }
.verdict-nums label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.vn { font-family: var(--font-disp); font-style: italic; font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
.vn.gold { color: var(--accent); }
.vn em { font-style: normal; font-size: 10px; color: var(--muted); }
.meter-wrap { width: 100%; margin-top: 26px; }
.meter { position: relative; height: 12px; border-radius: 8px; display: flex; overflow: visible; }
.zone { height: 100%; }
.zone.great { background: rgba(69,217,126,.55); border-radius: 8px 0 0 8px; }
.zone.fair { background: rgba(98,182,255,.5); }
.zone.caution { background: rgba(243,182,75,.55); }
.zone.over { background: rgba(241,101,95,.5); border-radius: 0 8px 8px 0; }
.marker { position: absolute; top: -16px; bottom: -4px; width: 2px; background: rgba(233,238,245,.75); transform: translateX(-1px); }
.marker span { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--muted);
  white-space: nowrap; font-family: ui-monospace, Menlo, monospace; }
.marker.m-rec { background: var(--accent); }
.marker.m-rec span { color: var(--accent); font-weight: 700; }
.bid-marker { position: absolute; top: 100%; transform: translateX(-50%); text-align: center; }
.bid-tri { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 9px solid var(--ink); margin: 2px auto 0; }
.bid-marker span { font-family: ui-monospace, Menlo, monospace; font-size: 12px; font-weight: 800; }
.bid-marker.t-bid .bid-tri { border-bottom-color: var(--green); } .bid-marker.t-bid span { color: var(--green); }
.bid-marker.t-value .bid-tri { border-bottom-color: #62b6ff; } .bid-marker.t-value span { color: #62b6ff; }
.bid-marker.t-caution .bid-tri { border-bottom-color: var(--amber); } .bid-marker.t-caution span { color: var(--amber); }
.bid-marker.t-pass .bid-tri { border-bottom-color: var(--red); } .bid-marker.t-pass span { color: var(--red); }
.meter-legend { display: flex; justify-content: space-between; margin-top: 26px; font-size: 10px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--muted); }
.asst-alt table.flat.tiny td, .asst-alt table.flat.tiny th { padding: 5px 6px; font-size: 12.5px; }
.linklike { background: none; border: none; padding: 0; font: inherit; color: inherit; cursor: pointer;
  text-align: left; font-weight: 650; }
.linklike:hover { color: var(--accent); text-decoration: underline; }
.stars.sm { font-size: 10px; }
.plan-input { max-width: 84px; margin-left: auto; text-align: right; padding: 6px 8px; }
.plan-note { text-align: right; color: var(--muted); font-size: 12px; }

.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
button, select { touch-action: manipulation; }
/* keyboard focus was invisible on every button — one rule covers the whole surface */
.root :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px; }
.root button:focus-visible, .root .chip:focus-visible, .root .navbtn:focus-visible { outline-offset: 2px; }
.field:focus-visible, .quick-input:focus-visible, .bid-input:focus-visible { outline-offset: 0; }

/* ---- big board ---- */
.board-controls { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.filter-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { background: var(--panel-2); border: 1px solid var(--line); color: var(--muted); border-radius: 6px;
  padding: 7px 14px; font-size: 13px; font-weight: 700; cursor: pointer; min-height: 36px;
  font-family: var(--font-disp); font-size: 14.5px; letter-spacing: .04em; text-transform: uppercase; }
.chip { transition: background-color .16s ease, border-color .16s ease, color .16s ease; }
.chip:hover { color: var(--ink); border-color: var(--muted); }
.chip:active { transform: translateY(1px); }
.chip.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.chip.static { cursor: default; font-family: ui-monospace, Menlo, monospace; }
.chip.static.hot { color: var(--red); border-color: rgba(241,101,95,.5); }
.chip.static.cold { color: var(--green); border-color: rgba(69,217,126,.5); }
.board-scroll { max-height: 62vh; overflow-y: auto; }
.board-scroll thead th { position: sticky; top: 0; background: var(--panel); z-index: 2; }
.star-btn { background: none; border: none; color: var(--muted-2); font-size: 17px; cursor: pointer; padding: 2px 4px; line-height: 1; }
.star-btn.on, .star.on { color: var(--accent); }
.star-btn:hover { color: var(--accent); }
.btn.starred { color: var(--accent); border-color: var(--accent); }

/* ---- view navigation ---- */
.viewnav { display: flex; gap: 6px; padding: 0 clamp(12px, 3vw, 28px) 10px; max-width: 1600px; margin: 0 auto; }
.navbtn { position: relative; flex: 0 0 auto; display: flex; align-items: center; gap: 8px;
  background: var(--panel); border: 1px solid var(--line); color: var(--muted);
  border-radius: 10px; padding: 10px 18px; font-size: 14px; font-weight: 700; cursor: pointer; min-height: 44px; }
.navbtn { transition: background-color .16s ease, border-color .16s ease, color .16s ease; }
.navbtn:hover { color: var(--ink); border-color: var(--muted); }
.navbtn { position: relative; font-family: var(--font-disp); font-size: 16px; letter-spacing: .04em; text-transform: uppercase; }
.navbtn.on { color: var(--accent); border-color: var(--line); background: var(--panel-2); }
.navbtn.on::after { content: ""; position: absolute; left: 14px; right: 14px; bottom: 5px; height: 3px;
  background: var(--accent); transform: skewX(-24deg); border-radius: 1px; }
.navicon { font-size: 15px; }
.navbadge { background: rgba(0,0,0,.25); border-radius: 20px; padding: 1px 8px; font-size: 11px;
  font-family: ui-monospace, Menlo, monospace; }
.navbtn:not(.on) .navbadge { background: var(--panel-2); color: var(--muted); }
.navbadge { color: var(--accent-ink); background: var(--accent); }
.data-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.data-actions .btn { flex: 1 1 140px; }

/* ---- settings ---- */
.set-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
.set-block { display: flex; flex-direction: column; gap: 8px; }
.eyebrow.small.mt { margin-top: 8px; }
.stepper-row { display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 5px 0 5px 2px; border-bottom: 1px solid rgba(39,50,69,.5); }
.stepper-row:last-child { border-bottom: none; }
.stepper-label { font-size: 13px; font-weight: 700; letter-spacing: .04em; }
.stepper { display: flex; align-items: center; gap: 4px; }
.btn.step { min-width: 40px; min-height: 38px; padding: 0; font-size: 18px; font-weight: 800; font-family: ui-monospace, Menlo, monospace; }
.stepper-val { min-width: 30px; text-align: center; font-family: ui-monospace, Menlo, monospace; font-size: 17px; font-weight: 700; }
.set-field { display: flex; flex-direction: column; gap: 4px; font-size: 11px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--muted); font-weight: 700; }
.toggle-row { display: flex; gap: 6px; flex-wrap: wrap; }
.slot-preview { display: flex; gap: 4px; flex-wrap: wrap; }
.slot-chip { font-size: 10.5px; font-weight: 700; letter-spacing: .04em; border-radius: 5px; padding: 3px 7px;
  background: var(--panel-2); color: var(--muted); border: 1px solid var(--line); }
.slot-chip.starter { color: var(--accent); border-color: rgba(210,245,60,.4); }
.set-warn { margin-top: 14px; font-size: 12.5px; color: var(--amber); background: rgba(243,182,75,.08);
  border: 1px solid rgba(243,182,75,.3); border-radius: 8px; padding: 8px 12px; }
.pos-count em { font-style: normal; color: var(--muted); font-size: 13px; }
.open-slots.done { color: var(--green); }

/* ---- responsive ---- */
@media (max-width: 1080px) {
  .layout, .layout.view-room { grid-template-columns: 1fr; }
  .side { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .asst-grid { grid-template-columns: 1fr 1fr; }
  .asst-verdict { grid-column: 1 / -1; order: -1; }
}
@media (max-width: 820px) {
  .field, .quick-input, .bid-input { font-size: 16px; } /* stops iOS zoom-on-focus */
  .paddle-num { font-size: 36px; }
  .verdict { font-size: 30px; }
  .paddles { grid-template-columns: 1fr 1fr; }
  .mini-stats { grid-column: 1 / -1; justify-content: flex-start; }
  .add-grid { grid-template-columns: 1fr 1fr; }
  .add-grid > .ac-wrap { grid-column: 1 / -1; }
  .add-grid .btn { grid-column: 1 / -1; min-height: 46px; }
  .actions .move { display: none; }
  .icon-btn { width: 38px; height: 38px; font-size: 15px; }
  .btn { min-height: 42px; }
  .seg-btn { padding: 8px 10px; }
}
@media (max-width: 760px) {
  .asst-grid { grid-template-columns: 1fr; gap: 14px; }
  .asst-actions .btn { min-height: 50px; }
  .verdict-why { font-size: 14px; }
}
@media (max-width: 600px) {
  .root { padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right);
    padding-bottom: calc(76px + env(safe-area-inset-bottom)); }
  /* the bottom nav is position:fixed, so no ancestor may create a containing block for it.
     backdrop-filter/filter/transform all would — clear them and use an opaque bar instead. */
  .topbar { backdrop-filter: none; -webkit-backdrop-filter: none; filter: none; transform: none;
    perspective: none; will-change: auto; contain: none; background: #0d1219; }
  .viewnav { position: fixed; left: 0; right: 0; bottom: 0; z-index: 90; padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
    background: #0d1219; border-top: 1px solid var(--line); gap: 4px; }
  .navbtn { flex: 1; flex-direction: column; gap: 2px; padding: 6px 1px; border: none; background: none;
    border-radius: 8px; font-size: 10px; min-height: 54px; justify-content: center; }
  .navlabel { white-space: nowrap; }
  .navbtn.on { background: rgba(210,245,60,.12); color: var(--accent); }
  .navbtn.on::after { display: none; }
  .navbtn { font-family: var(--font-ui); text-transform: none; letter-spacing: 0; }
  .navicon { font-size: 19px; }
  .navbadge { position: absolute; top: 3px; right: 4px; transform: none; padding: 0 4px; font-size: 9px;
    line-height: 1.5; background: var(--accent); color: #17130a; }
  .navbtn:not(.on) .navbadge { background: var(--panel-2); color: var(--muted); }
  .toast { bottom: calc(80px + env(safe-area-inset-bottom)); }
  .command { padding: 8px 10px 10px; }
  .brand { margin-bottom: 6px; gap: 8px; }
  .brand-title { font-size: 14px; }
  .brand-sub { display: none; }
  .paddles { gap: 8px; margin-bottom: 8px; }
  .paddle { min-width: 0; padding: 6px 12px 8px; }
  .paddle-num { font-size: 32px; }
  .paddle-foot { display: none; }
  .mini-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .mini { min-width: 0; padding: 4px 4px; }
  .mini span { font-size: 16px; }
  .mini label { font-size: 9px; }
  .quick-input { padding: 11px 12px; }
  .quickbar .btn.big { padding: 11px 14px; font-size: 14px; }
  .ticker { font-size: 12px; padding: 6px 10px; }
  .layout { padding: 12px 10px 0; gap: 12px; }
  .panel { padding: 12px; border-radius: 10px; }
  th, td { padding: 7px 5px; }
  table.flat td, td { font-size: 13px; }
  .pname { max-width: 34vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle; }
  .hide-xs { display: none; }
  /* board: keep name + est + status legible; paid only matters once someone is off the board */
  .board-scroll .hide-tiny { display: none; }
  .seg-btn { padding: 7px 7px; font-size: 11px; }
  .star-btn { font-size: 19px; padding: 2px; }
  /* plan: drop the derivable column */
  .plan-derived { display: none; }
  .plan-input { max-width: 66px; }
  /* settings: full-width steppers already stack via auto-fit */
  .set-grid { gap: 14px; }
  .slot-preview { gap: 3px; }
  .verdict-nums { gap: 10px; }
  .meter-wrap { margin-top: 22px; }
  .pos-chip { display: none; }
  .pos-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .value-line { flex-wrap: wrap; gap: 12px; }
  .board-scroll { max-height: 58vh; }
  .seg-btn { padding: 7px 8px; font-size: 11.5px; }
  .verdict { font-size: 26px; padding: 6px 18px; }
  .verdict-empty { padding: 12px 6px; font-size: 13.5px; }
  .asst-panel .panel-head { flex-direction: column; align-items: flex-start; gap: 6px; }
  .health-line { flex-wrap: wrap; gap: 8px; }
  .health-avg { font-size: 12px; }
  .verdict-nums { gap: 12px; }
  .vn { font-size: 17px; }
  .bid-step { min-height: 54px; padding: 0 16px; }
  .marker span { display: none; }
  .marker.m-rec span, .marker.m-proj span { display: block; }
  .edit-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
  .modal { padding: 14px; border-radius: 12px; }
  .toast { font-size: 13.5px; padding: 10px 14px; }
  .fi { display: inline-flex; vertical-align: -2px; line-height: 1; }
.foot { font-size: 11px; padding-top: 14px; }
}
@media (max-width: 380px) {
  .verdict-nums div:last-child { display: none; }
  .chip { padding: 6px 11px; font-size: 12px; }
  .pname { max-width: 30vw; }
}
`;
