import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { CommandHeader, ViewNav, Modal, Icon, SeasonsPanel, BoardUpdatesBanner } from "./components/index.js";
import { money } from "./lib/format.js";
import { storageGet, storageSet } from "./lib/storage.js";
import { motionTokens, viewTransition, pressable } from "./lib/motion.js";
import {
  isSupabaseConfigured,
  loadStoredSyncCode,
  saveStoredSyncCode,
  clearStoredSyncCode,
  loadSyncMeta,
  generateSyncCode,
  formatSyncCode,
  normalizeSyncCode,
  pushActiveSeason,
  pullActiveSeason,
  downloadSeasonArchive,
} from "./lib/sync.js";
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
  isLegacyBoardTargets,
  normalizePlanTargets,
  syncStarsAndTargets,
} from "./lib/seasons.js";

const Ic = Icon; // legacy alias used throughout panels
const THEME_KEY = "awr-theme";
function readStoredTheme() {
  try {
    const v = typeof localStorage !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
    if (v === "light" || v === "dark") return v;
  } catch { /* ignore */ }
  return "dark";
}

/* ============================================================
   NFL AUCTION WAR ROOM — 12-team, $200, 0.5 PPR, 2QB superflex, 14-man roster
   ============================================================ */

const DEFAULT_SETTINGS = {
  budget: 200,
  teams: 12,
  starters: { QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1, SUPERFLEX: 1, K: 1, DEF: 1 },
  bench: 4,
  flexEligible: { RB: true, WR: true, TE: true, QB: false, K: false, DEF: false },
  superflexEligible: { QB: true, RB: true, WR: true, TE: true, K: false, DEF: false },
  onlyOne: { QB: false, K: true, DEF: true, RB: false, WR: false, TE: false }, // 2QB: second QB fills SUPERFLEX
};
const clampInt = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));
function normalizeSettings(raw) {
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
const NEED_POS_PRIORITY = ["RB", "WR", "QB", "TE", "K", "DEF"];

// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-08-31T19:50:56.168Z · 350 players · ordered by adjusted consensus rank
const RAW_DB = [
  ["Jahmyr Gibbs","RB","DET"], // 1 · avg 1.33
  ["Bijan Robinson","RB","ATL"], // 2 · avg 3.00
  ["Jaxon Smith-Njigba","WR","SEA"], // 3 · avg 5.00
  ["Amon-Ra St. Brown","WR","DET"], // 4 · avg 6.00
  ["Jonathan Taylor","RB","IND"], // 5 · avg 8.33
  ["CeeDee Lamb","WR","DAL"], // 6 · avg 8.67
  ["Christian McCaffrey","RB","SF"], // 7 · avg 8.67
  ["James Cook III","RB","BUF"], // 8 · avg 10.00
  ["Justin Jefferson","WR","MIN"], // 9 · avg 10.00
  ["A.J. Brown","WR","NE"], // 10 · avg 12.33
  ["Drake London","WR","ATL"], // 11 · avg 13.67
  ["Ja'Marr Chase","WR","CIN"], // 12 · avg 2.00 · adj +12
  ["Chase Brown","RB","CIN"], // 13 · avg 15.33
  ["Puka Nacua","WR","LAR"], // 14 · avg 3.67 · adj +12
  ["Nico Collins","WR","HOU"], // 15 · avg 16.00
  ["Saquon Barkley","RB","PHI"], // 16 · avg 17.33
  ["Brock Bowers","TE","LV"], // 17 · avg 18.00
  ["De'Von Achane","RB","MIA"], // 18 · avg 19.33
  ["George Pickens","WR","DAL"], // 19 · avg 19.67
  ["Davante Adams","WR","LAR"], // 20 · avg 47.67 · adj -28
  ["Kenneth Walker III","RB","KC"], // 21 · avg 20.00
  ["Chris Olave","WR","NO"], // 22 · avg 21.33
  ["Omarion Hampton","RB","LAC"], // 23 · avg 21.33
  ["Trey McBride","TE","ARI"], // 24 · avg 22.33
  ["Derrick Henry","RB","BAL"], // 25 · avg 24.00
  ["Josh Allen","QB","BUF"], // 26 · avg 25.33
  ["Malik Nabers","WR","NYG"], // 27 · avg 25.33
  ["DeVonta Smith","WR","PHI"], // 28 · avg 27.00
  ["Rashee Rice","WR","KC"], // 29 · avg 29.67
  ["Tee Higgins","WR","CIN"], // 30 · avg 33.00
  ["Lamar Jackson","QB","BAL"], // 31 · avg 33.33
  ["Kyren Williams","RB","LAR"], // 32 · avg 34.33
  ["Ladd McConkey","WR","LAC"], // 33 · avg 35.33
  ["Colston Loveland","TE","CHI"], // 34 · avg 36.33
  ["Javonte Williams","RB","DAL"], // 35 · avg 36.33
  ["Jaylen Waddle","WR","DEN"], // 36 · avg 36.67
  ["Tetairoa McMillan","WR","CAR"], // 37 · avg 37.00
  ["Drake Maye","QB","NE"], // 38 · avg 38.67
  ["Garrett Wilson","WR","NYJ"], // 39 · avg 38.67
  ["Zay Flowers","WR","BAL"], // 40 · avg 29.33 · adj +12
  ["Travis Etienne Jr.","RB","NO"], // 41 · avg 44.00
  ["Joe Burrow","QB","CIN"], // 42 · avg 45.00
  ["D'Andre Swift","RB","CHI"], // 43 · avg 46.67
  ["Terry McLaurin","WR","WAS"], // 44 · avg 47.67
  ["Ashton Jeanty","RB","LV"], // 45 · avg 26.00 · adj +22
  ["Luther Burden III","WR","CHI"], // 46 · avg 48.67
  ["Breece Hall","RB","NYJ"], // 47 · avg 37.67 · adj +12
  ["Jameson Williams","WR","DET"], // 48 · avg 49.67
  ["Emeka Egbuka","WR","TB"], // 49 · avg 40.00 · adj +12
  ["Jeremiyah Love","RB","ARI"], // 50 · avg 41.00 · adj +12
  ["Christian Watson","WR","GB"], // 51 · avg 53.00
  ["Bucky Irving","RB","TB"], // 52 · avg 53.33
  ["Cam Skattebo","RB","NYG"], // 53 · avg 54.67
  ["Jayden Daniels","QB","WAS"], // 54 · avg 54.67
  ["DJ Moore","WR","BUF"], // 55 · avg 55.00
  ["Quinshon Judkins","RB","CLE"], // 56 · avg 56.00
  ["David Montgomery","RB","HOU"], // 57 · avg 57.67
  ["Rome Odunze","WR","CHI"], // 58 · avg 58.00
  ["Jalen Hurts","QB","PHI"], // 59 · avg 58.67
  ["Mike Evans","WR","SF"], // 60 · avg 61.00
  ["Bhayshul Tuten","RB","JAC"], // 61 · avg 61.33
  ["Jadarian Price","RB","SEA"], // 62 · avg 63.33
  ["Parker Washington","WR","JAC"], // 63 · avg 64.00
  ["Caleb Williams","QB","CHI"], // 64 · avg 64.67
  ["Tyler Warren","TE","IND"], // 65 · avg 54.67 · adj +12
  ["TreVeyon Henderson","RB","NE"], // 66 · avg 66.67
  ["Justin Herbert","QB","LAC"], // 67 · avg 68.33
  ["Marvin Harrison Jr.","WR","ARI"], // 68 · avg 68.33
  ["Rhamondre Stevenson","RB","NE"], // 69 · avg 68.67
  ["Carnell Tate","WR","TEN"], // 70 · avg 70.33
  ["Jaylen Warren","RB","PIT"], // 71 · avg 73.00
  ["Dak Prescott","QB","DAL"], // 72 · avg 73.67
  ["Trevor Lawrence","QB","JAC"], // 73 · avg 74.00
  ["Brian Thomas Jr.","WR","JAC"], // 74 · avg 75.33
  ["Tony Pollard","RB","TEN"], // 75 · avg 77.00
  ["DK Metcalf","WR","PIT"], // 76 · avg 77.33
  ["Harold Fannin Jr.","TE","CLE"], // 77 · avg 80.00
  ["Chris Godwin Jr.","WR","TB"], // 78 · avg 81.00
  ["Jonathon Brooks","RB","CAR"], // 79 · avg 81.00
  ["Tucker Kraft","TE","GB"], // 80 · avg 69.33 · adj +12
  ["Kyle Pitts Sr.","TE","ATL"], // 81 · avg 81.67
  ["Rico Dowdle","RB","PIT"], // 82 · avg 82.67
  ["Courtland Sutton","WR","DEN"], // 83 · avg 84.00
  ["Quentin Johnston","WR","LAC"], // 84 · avg 85.33
  ["J.K. Dobbins","RB","DEN"], // 85 · avg 90.33
  ["MarShawn Lloyd","RB","GB"], // 86 · avg 90.67
  ["Sam LaPorta","TE","DET"], // 87 · avg 79.33 · adj +12
  ["Michael Wilson","WR","ARI"], // 88 · avg 91.33
  ["Alec Pierce","WR","IND"], // 89 · avg 92.33
  ["Brock Purdy","QB","SF"], // 90 · avg 92.67
  ["Blake Corum","RB","LAR"], // 91 · avg 94.00
  ["Bo Nix","QB","DEN"], // 92 · avg 95.00
  ["Chuba Hubbard","RB","CAR"], // 93 · avg 96.33
  ["Jaxson Dart","QB","NYG"], // 94 · avg 97.67
  ["RJ Harvey","RB","DEN"], // 95 · avg 99.00
  ["Jacory Croskey-Merritt","RB","WAS"], // 96 · avg 100.67
  ["Jordan Mason","RB","MIN"], // 97 · avg 101.33
  ["Stefon Diggs","WR","WAS"], // 98 · avg 101.33
  ["Travis Kelce","TE","KC"], // 99 · avg 101.33
  ["Patrick Mahomes II","QB","KC"], // 100 · avg 101.67
  ["Wan'Dale Robinson","WR","TEN"], // 101 · avg 102.00
  ["Michael Pittman Jr.","WR","PIT"], // 102 · avg 90.67 · adj +12
  ["Tyler Allgeier","RB","ARI"], // 103 · avg 131.00 · adj -28
  ["Jayden Reed","WR","GB"], // 104 · avg 103.33
  ["George Kittle","TE","SF"], // 105 · avg 91.67 · adj +12
  ["Jordan Addison","WR","MIN"], // 106 · avg 104.33
  ["Kenny Gainwell","RB","TB"], // 107 · avg 104.33
  ["Matthew Stafford","QB","LAR"], // 108 · avg 105.33
  ["Jared Goff","QB","DET"], // 109 · avg 105.67
  ["Dalton Kincaid","TE","BUF"], // 110 · avg 106.00
  ["Josh Downs","WR","IND"], // 111 · avg 96.33 · adj +12
  ["Makai Lemon","WR","PHI"], // 112 · avg 109.00
  ["Mike Washington Jr.","RB","LV"], // 113 · avg 150.00 · adj -38
  ["Jakobi Meyers","WR","JAC"], // 114 · avg 112.33
  ["Rachaad White","RB","WAS"], // 115 · avg 113.33
  ["Kyler Murray","QB","MIN"], // 116 · avg 114.67
  ["Dallas Goedert","TE","PHI"], // 117 · avg 115.00
  ["Jordan Love","QB","GB"], // 118 · avg 117.33
  ["Isaiah Likely","TE","NYG"], // 119 · avg 117.67
  ["Aaron Jones Sr.","RB","MIN"], // 120 · avg 119.00
  ["Baker Mayfield","QB","TB"], // 121 · avg 119.67
  ["KC Concepcion","WR","CLE"], // 122 · avg 121.00
  ["Jake Ferguson","TE","DAL"], // 123 · avg 123.00
  ["Chris Rodriguez Jr.","RB","JAC"], // 124 · avg 124.33
  ["Romeo Doubs","WR","NE"], // 125 · avg 124.67
  ["Xavier Worthy","WR","KC"], // 126 · avg 125.00
  ["Matthew Golden","WR","GB"], // 127 · avg 126.00
  ["Braelon Allen","RB","NYJ"], // 128 · avg 154.33 · adj -28
  ["Mark Andrews","TE","BAL"], // 129 · avg 126.67
  ["Tyler Shough","QB","NO"], // 130 · avg 127.67
  ["Jalen Coker","WR","CAR"], // 131 · avg 128.67
  ["Woody Marks","RB","HOU"], // 132 · avg 130.67
  ["Kyle Monangai","RB","CHI"], // 133 · avg 110.33 · adj +22
  ["De'Zhaun Stribling","WR","SF"], // 134 · avg 132.33
  ["Juwan Johnson","TE","NO"], // 135 · avg 133.00
  ["Khalil Shakir","WR","BUF"], // 136 · avg 133.00
  ["Malik Willis","QB","MIA"], // 137 · avg 133.67
  ["Deebo Samuel Sr.","WR","SF"], // 138 · avg 137.33
  ["Rashid Shaheed","WR","SEA"], // 139 · avg 139.00
  ["Josh Jacobs","RB","GB"], // 140 · avg 139.67
  ["Jalen McMillan","WR","TB"], // 141 · avg 167.67 · adj -28
  ["Keaton Mitchell","RB","LAC"], // 142 · avg 140.00
  ["Tyjae Spears","RB","TEN"], // 143 · avg 140.00
  ["Sam Darnold","QB","SEA"], // 144 · avg 141.00
  ["Jonah Coleman","RB","DEN"], // 145 · avg 142.67
  ["C.J. Stroud","QB","HOU"], // 146 · avg 145.67
  ["Tank Bigsby","RB","PHI"], // 147 · avg 146.00
  ["Daniel Jones","QB","IND"], // 148 · avg 148.33
  ["Dylan Sampson","RB","CLE"], // 149 · avg 149.33
  ["Hunter Henry","TE","NE"], // 150 · avg 149.33
  ["Cam Ward","QB","TEN"], // 151 · avg 152.67
  ["Isiah Pacheco","RB","DET"], // 152 · avg 154.00
  ["Brenton Strange","TE","JAC"], // 153 · avg 154.33
  ["Chig Okonkwo","TE","WAS"], // 154 · avg 154.33
  ["Denzel Boston","WR","CLE"], // 155 · avg 154.33
  ["Tre Tucker","WR","LV"], // 156 · avg 155.67
  ["Dalton Schultz","TE","HOU"], // 157 · avg 157.33
  ["Tyrone Tracy Jr.","RB","NYG"], // 158 · avg 159.67
  ["Adonai Mitchell","WR","NYJ"], // 159 · avg 160.67
  ["Brian Robinson Jr.","RB","ATL"], // 160 · avg 161.67
  ["Kayshon Boutte","WR","HOU"], // 161 · avg 164.00
  ["Jerry Jeudy","WR","CLE"], // 162 · avg 167.33
  ["Bryce Young","QB","CAR"], // 163 · avg 169.33
  ["Jauan Jennings","WR","MIN"], // 164 · avg 170.00
  ["Tre' Harris","WR","LAC"], // 165 · avg 170.00
  ["Dontayvion Wicks","WR","PHI"], // 166 · avg 173.67
  ["Ray Davis","RB","BUF"], // 167 · avg 173.67
  ["Terrance Ferguson","TE","LAR"], // 168 · avg 174.67
  ["Ryan Flournoy","WR","DAL"], // 169 · avg 175.67
  ["Zach Charbonnet","RB","SEA"], // 170 · avg 143.67 · adj +35
  ["Emmett Johnson","RB","KC"], // 171 · avg 180.00
  ["Pat Bryant","WR","DEN"], // 172 · avg 181.33
  ["Jalen Nailor","WR","LV"], // 173 · avg 181.67
  ["Omar Cooper Jr.","WR","NYJ"], // 174 · avg 183.33
  ["Malik Washington","WR","MIA"], // 175 · avg 185.67
  ["AJ Barner","TE","SEA"], // 176 · avg 186.00
  ["Kimani Vidal","RB","LAC"], // 177 · avg 186.33
  ["Brandon Aubrey","K","DAL"], // 178 · avg 186.67
  ["T.J. Hockenson","TE","MIN"], // 179 · avg 188.33
  ["Calvin Ridley","WR","TEN"], // 180 · avg 189.67
  ["Oronde Gadsden II","TE","LAC"], // 181 · avg 191.00
  ["Jacoby Brissett","QB","ARI"], // 182 · avg 191.67
  ["Keenan Allen","WR","IND"], // 183 · avg 192.00
  ["Cameron Dicker","K","LAC"], // 184 · avg 194.67
  ["Ka'imi Fairbairn","K","HOU"], // 185 · avg 196.67
  ["Kenyon Sadiq","TE","NYJ"], // 186 · avg 199.00
  ["Sean Tucker","RB","TB"], // 187 · avg 199.00
  ["Travis Hunter","WR","JAC"], // 188 · avg 200.33
  ["Cam Little","K","JAC"], // 189 · avg 200.67
  ["Nicholas Singleton","RB","TEN"], // 190 · avg 201.00
  ["Jason Myers","K","SEA"], // 191 · avg 202.67
  ["Jaylin Noel","WR","HOU"], // 192 · avg 203.33
  ["Alvin Kamara","RB","NO"], // 193 · avg 160.00 · adj +45
  ["James Conner","RB","ARI"], // 194 · avg 221.67 · adj -16
  ["Rashod Bateman","WR","BAL"], // 195 · avg 206.67
  ["Tyler Loop","K","BAL"], // 196 · avg 209.33
  ["Eddy Pineiro","K","SF"], // 197 · avg 209.67
  ["Gunnar Helm","TE","TEN"], // 198 · avg 210.33
  ["Aaron Rodgers","QB","PIT"], // 199 · avg 214.00
  ["Jake Bates","K","DET"], // 200 · avg 214.67
  ["Pat Freiermuth","TE","PIT"], // 201 · avg 216.00
  ["Cooper Kupp","WR","SEA"], // 202 · avg 219.33
  ["Isaac TeSlaa","WR","DET"], // 203 · avg 219.33
  ["Kaelon Black","RB","SF"], // 204 · avg 219.33
  ["Darnell Mooney","WR","NYG"], // 205 · avg 221.00
  ["Geno Smith","QB","NYJ"], // 206 · avg 221.00
  ["Jaylen Wright","RB","MIA"], // 207 · avg 223.00
  ["Evan McPherson","K","CIN"], // 208 · avg 223.33
  ["Cairo Santos","K","CHI"], // 209 · avg 223.67
  ["Harrison Mevis","K","LAR"], // 210 · avg 225.00
  ["Kaytron Allen","RB","WAS"], // 211 · avg 225.00
  ["Emanuel Wilson","RB","SEA"], // 212 · avg 227.67
  ["Kendre Miller","RB","NO"], // 213 · avg 277.67 · adj -50
  ["Tank Dell","WR","HOU"], // 214 · avg 229.33
  ["Cade Otton","TE","TB"], // 215 · avg 229.67
  ["Chase McLaughlin","K","TB"], // 216 · avg 230.67
  ["Ja'Kobi Lane","WR","BAL"], // 217 · avg 231.00
  ["George Holani","RB","SEA"], // 218 · avg 232.33
  ["Isaiah Davis","RB","NYJ"], // 219 · avg 262.00 · adj -28
  ["Troy Franklin","WR","DEN"], // 220 · avg 234.67
  ["Andy Borregales","K","NE"], // 221 · avg 235.00
  ["Zachariah Branch","WR","ATL"], // 222 · avg 235.67
  ["Najee Harris","RB","NYG"], // 223 · avg 236.67
  ["Malik Davis","RB","DAL"], // 224 · avg 237.67
  ["Jordyn Tyson","WR","NO"], // 225 · avg 138.67 · adj +100
  ["Germie Bernard","WR","PIT"], // 226 · avg 240.00
  ["Chris Bell","WR","MIA"], // 227 · avg 240.33
  ["Greg Dulcich","TE","MIA"], // 228 · avg 240.67
  ["Devin Neal","RB","NO"], // 229 · avg 291.00 · adj -50
  ["Malachi Fields","WR","NYG"], // 230 · avg 242.00
  ["David Njoku","TE","LAC"], // 231 · avg 243.33
  ["Justice Hill","RB","BAL"], // 232 · avg 243.33
  ["Caleb Douglas","WR","MIA"], // 233 · avg 246.33
  ["Antonio Williams","WR","WAS"], // 234 · avg 246.67
  ["Evan Engram","TE","DEN"], // 235 · avg 248.33
  ["Harrison Butker","K","KC"], // 236 · avg 248.67
  ["Devaughn Vele","WR","NO"], // 237 · avg 250.00
  ["Demond Claiborne","RB","MIN"], // 238 · avg 250.33
  ["Samaje Perine","RB","CIN"], // 239 · avg 251.00
  ["Chris Brooks","RB","GB"], // 240 · avg 252.33
  ["Chris Boswell","K","PIT"], // 241 · avg 255.33
  ["Ted Hurst III","WR","TB"], // 242 · avg 256.67
  ["Keon Coleman","WR","BUF"], // 243 · avg 245.00 · adj +12
  ["Jack Bech","WR","LV"], // 244 · avg 257.67
  ["Ollie Gordon II","RB","MIA"], // 245 · avg 257.67
  ["Fernando Mendoza","QB","LV"], // 246 · avg 259.33
  ["Jordan James","RB","SF"], // 247 · avg 259.67
  ["Colby Parkinson","TE","LAR"], // 248 · avg 261.00
  ["Chimere Dike","WR","TEN"], // 249 · avg 262.67
  ["Elic Ayomanor","WR","TEN"], // 250 · avg 263.00
  ["Ty Johnson","RB","BUF"], // 251 · avg 263.33
  ["Tyquan Thornton","WR","KC"], // 252 · avg 264.67
  ["Tory Horton","WR","SEA"], // 253 · avg 269.67
  ["Wil Lutz","K","DEN"], // 254 · avg 269.67
  ["Kaleb Johnson","RB","GB"], // 255 · avg 270.33
  ["Cyrus Allen","WR","KC"], // 256 · avg 271.33
  ["LeQuint Allen Jr.","RB","JAC"], // 257 · avg 271.67
  ["Jaydon Blue","RB","FA"], // 258 · avg 272.00
  ["Will Reichard","K","MIN"], // 259 · avg 272.00
  ["Darius Slayton","WR","NYG"], // 260 · avg 274.33
  ["Tua Tagovailoa","QB","ATL"], // 261 · avg 275.00
  ["Seth McGowan","RB","IND"], // 262 · avg 277.00
  ["Mason Taylor","TE","NYJ"], // 263 · avg 278.33
  ["Xavier Legette","WR","CAR"], // 264 · avg 278.33
  ["Christian Kirk","WR","SF"], // 265 · avg 279.33
  ["Theo Johnson","TE","NYG"], // 266 · avg 284.00
  ["Elijah Sarratt","WR","BAL"], // 267 · avg 284.67
  ["Marvin Mims Jr.","WR","DEN"], // 268 · avg 284.67
  ["DJ Giddens","RB","IND"], // 269 · avg 285.33
  ["Kirk Cousins","QB","LV"], // 270 · avg 285.67
  ["Deshaun Watson","QB","CLE"], // 271 · avg 286.33
  ["Adam Randall","RB","BAL"], // 272 · avg 290.00
  ["Eli Stowers","TE","PHI"], // 273 · avg 290.67
  ["Kyle Williams","WR","NE"], // 274 · avg 291.00
  ["Michael Penix Jr.","QB","ATL"], // 275 · avg 279.67 · adj +12
  ["Emari Demercado","RB","FA"], // 276 · avg 292.67
  ["Shedeur Sanders","QB","CLE"], // 277 · avg 293.00
  ["Brashard Smith","RB","KC"], // 278 · avg 294.67
  ["Devin Singletary","RB","NYG"], // 279 · avg 297.00
  ["Mike Gesicki","TE","CIN"], // 280 · avg 297.00
  ["Hollywood Brown","WR","PHI"], // 281 · avg 298.00
  ["Mack Hollins","WR","NE"], // 282 · avg 301.33
  ["Trevor Etienne","RB","CAR"], // 283 · avg 304.33
  ["Isaiah Bond","WR","CLE"], // 284 · avg 306.00
  ["Skyler Bell","WR","BUF"], // 285 · avg 307.67
  ["Brandon Aiyuk","WR","SF"], // 286 · avg 308.67
  ["Jake Tonges","TE","SF"], // 287 · avg 308.67
  ["Darren Waller","TE","CAR"], // 288 · avg 310.67
  ["Andrei Iosivas","WR","CIN"], // 289 · avg 312.00
  ["Jerome Ford","RB","WAS"], // 290 · avg 312.00
  ["Tahj Brooks","RB","CIN"], // 291 · avg 313.00
  ["Tez Johnson","WR","TB"], // 292 · avg 341.00 · adj -28
  ["Charlie Smyth","K","NO"], // 293 · avg 314.00
  ["Audric Estime","RB","NO"], // 294 · avg 314.33
  ["Jarquez Hunter","RB","FA"], // 295 · avg 314.33
  ["Darnell Washington","TE","PIT"], // 296 · avg 315.33
  ["DeMario Douglas","WR","NE"], // 297 · avg 315.67
  ["Isaac Guerendo","RB","SF"], // 298 · avg 316.33
  ["Jaleel McLaughlin","RB","FA"], // 299 · avg 319.67
  ["Michael Mayer","TE","LV"], // 300 · avg 319.67
  ["Tyreek Hill","WR","FA"], // 301 · avg 320.67
  ["Jahan Dotson","WR","ATL"], // 302 · avg 322.67
  ["Will Shipley","RB","PHI"], // 303 · avg 323.33
  ["Charlie Kolar","TE","LAC"], // 304 · avg 323.67
  ["Oscar Delp","TE","NO"], // 305 · avg 324.67
  ["Elijah Arroyo","TE","SEA"], // 306 · avg 327.67
  ["Xavier Hutchinson","WR","HOU"], // 307 · avg 328.00
  ["Bryce Lance","WR","NO"], // 308 · avg 329.33
  ["Jalen Tolbert","WR","MIA"], // 309 · avg 331.00
  ["Carson Beck","QB","ARI"], // 310 · avg 333.33
  ["Cole Kmet","TE","CHI"], // 311 · avg 333.33
  ["Eli Raridon","TE","NE"], // 312 · avg 334.67
  ["Dawson Knox","TE","BUF"], // 313 · avg 335.67
  ["Kareem Hunt","RB","FA"], // 314 · avg 336.33
  ["Tyler Higbee","TE","LAR"], // 315 · avg 336.67
  ["Erick All Jr.","TE","CIN"], // 316 · avg 337.00
  ["Kendrick Bourne","WR","ARI"], // 317 · avg 340.00
  ["Luke McCaffrey","WR","WAS"], // 318 · avg 340.33
  ["Joe Mixon","RB","FA"], // 319 · avg 342.67
  ["Bam Knight","RB","ARI"], // 320 · avg 343.00
  ["Konata Mumpfield","WR","LAR"], // 321 · avg 343.33
  ["J.J. McCarthy","QB","MIN"], // 322 · avg 344.67
  ["Noah Gray","TE","KC"], // 323 · avg 346.00
  ["Cedric Tillman","WR","FA"], // 324 · avg 346.33
  ["Olamide Zaccheaus","WR","ATL"], // 325 · avg 346.33
  ["Joshua Palmer","WR","BUF"], // 326 · avg 348.67
  ["Jalen Royals","WR","KC"], // 327 · avg 351.00
  ["Brenen Thompson","WR","LAC"], // 328 · avg 352.33
  ["Treylon Burks","WR","WAS"], // 329 · avg 352.33
  ["Mac Jones","QB","SF"], // 330 · avg 352.67
  ["Max Klare","TE","LAR"], // 331 · avg 352.67
  ["Ja'Tavion Sanders","TE","CAR"], // 332 · avg 355.00
  ["Tyler Bass","K","BUF"], // 333 · avg 355.00
  ["Jake Elliott","K","PHI"], // 334 · avg 355.33
  ["Michael Carter","RB","FA"], // 335 · avg 359.67
  ["Eli Heidenreich","RB","PIT"], // 336 · avg 361.00
  ["Roman Wilson","WR","PIT"], // 337 · avg 362.33
  ["Justin Fields","QB","KC"], // 338 · avg 364.00
  ["Malik Benson","WR","LV"], // 339 · avg 364.67
  ["Ty Simpson","QB","LAR"], // 340 · avg 365.67
  ["KaVontae Turpin","WR","DAL"], // 341 · avg 367.00
  ["Jawhar Jordan","RB","FA"], // 342 · avg 368.33
  ["Kalif Raymond","WR","CHI"], // 343 · avg 371.33
  ["Savion Williams","WR","GB"], // 344 · avg 372.00
  ["Trey Smack","K","GB"], // 345 · avg 372.33
  ["Jordan Whittington","WR","LAR"], // 346 · avg 401.00 · adj -28
  ["Raheim Sanders","RB","CLE"], // 347 · avg 374.33
  ["Dont'e Thornton Jr.","WR","LV"], // 348 · avg 375.67
  ["Kevin Coleman Jr.","WR","MIA"], // 349 · avg 375.67
  ["Anthony Richardson Sr.","QB","IND"], // 350 · avg 376.00
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

const norm = (s) => (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[.-]/g, "").trim();
// Player health — updated 2026-08-31T19:50:56.168Z
// Sources: FantasyPros injury news (8/23); Yahoo Sports training camp tracker; Fantasy Alarm weekend injury roundup (8/23); CBS Sports camp tracker; Adam Schefter / team beat reporters; ESPN (8/25–26); CBS / NFL Network (8/26)
// Regenerate via: npm run refresh-board
const PLAYER_HEALTH = {
  [norm("Ashton Jeanty")]: { status: "D", note: "Right knee — helped off practice 8/23, unable to bear weight; team paused practice; awaiting MRI", sources: ["FantasyPros","Fantasy Alarm","Adam Schefter"], updatedAt: "2026-08-23" },
  [norm("Ricky Pearsall")]: { status: "OFS", note: "PCL surgery — out for 2026", sources: ["Yahoo Sports","CBS Sports"], updatedAt: "2026-08-20" },
  [norm("Chris Brazzell II")]: { status: "OFS", note: "LCL tear — out for 2026", sources: ["Yahoo Sports"], updatedAt: "2026-08-18" },
  [norm("Jayden Higgins")]: { status: "OFS", note: "Torn ACL — out for 2026 (Ian Rapoport)", sources: ["FantasyPros","Yahoo Sports"], updatedAt: "2026-08-20" },
  [norm("Jordyn Tyson")]: { status: "IR", note: "Hamstring — expected ~2 months, may start on IR", sources: ["Yahoo Sports","Fantasy Alarm","AS USA"], updatedAt: "2026-08-22" },
  [norm("Alvin Kamara")]: { status: "OUT", note: "MCL sprain — expected out ~1 month", sources: ["Fantasy Alarm"], updatedAt: "2026-08-22" },
  [norm("Zach Charbonnet")]: { status: "PUP", note: "ACL recovery — has not returned to practice (active/PUP)", sources: ["Yahoo Sports","Fantasy Alarm","AS USA"], updatedAt: "2026-08-22" },
  [norm("Breece Hall")]: { status: "Q", note: "Groin — expected out 2–3 weeks; team hopeful for Week 1", sources: ["AS USA","Fantasy Alarm"], updatedAt: "2026-08-22" },
  [norm("Jeremiyah Love")]: { status: "Q", note: "High-ankle sprain — light agility work 8/26; multi-week, Week 1 in doubt", sources: ["ESPN","Fantasy Alarm","Arizona Republic"], updatedAt: "2026-08-26" },
  [norm("Emeka Egbuka")]: { status: "Q", note: "Turf toe sprain — Week 1 availability in doubt", sources: ["Fantasy Alarm","Yahoo Sports"], updatedAt: "2026-08-22" },
  [norm("Sam LaPorta")]: { status: "Q", note: "Hip/undisclosed — missed recent practice", sources: ["FantasyPros","Fantasy Alarm"], updatedAt: "2026-08-21" },
  [norm("Puka Nacua")]: { status: "Q", note: "Groin soreness — minor per McVay, monitoring", sources: ["Yahoo Sports"], updatedAt: "2026-08-22" },
  [norm("Kyle Monangai")]: { status: "D", note: "Hyperextended knee — multiple weeks, Week 1 in doubt", sources: ["Yahoo Sports","Fantasy Alarm"], updatedAt: "2026-08-21" },
  [norm("Michael Pittman Jr.")]: { status: "Q", note: "Hamstring — minor, expected ready Week 1", sources: ["FantasyPros"], updatedAt: "2026-08-21" },
  [norm("George Kittle")]: { status: "Q", note: "Working back from Achilles; limited in camp", sources: ["AS USA"], updatedAt: "2026-08-20" },
  [norm("Ja'Marr Chase")]: { status: "Q", note: "Left knee hyperextension — limped off 8/25 practice; held out 8/26 precaution; says he's fine, unlikely for preseason finale", sources: ["ESPN","Cincy Jungle","WCPO"], updatedAt: "2026-08-26" },
  [norm("Zay Flowers")]: { status: "Q", note: "Undisclosed — held out of 8/26 practice precaution; expected ready for Week 1", sources: ["ESPN","Baltimore Sun"], updatedAt: "2026-08-26" },
  [norm("Tyler Warren")]: { status: "Q", note: "Groin — expected out through this week; load-managed for Week 1", sources: ["CBS Sports","Colts beat"], updatedAt: "2026-08-26" },
  [norm("James Conner")]: { status: "Q", note: "Foot — coach says too early to tell on Week 1 availability (8/26)", sources: ["ESPN","Arizona Republic"], updatedAt: "2026-08-26" },
  [norm("Keon Coleman")]: { status: "Q", note: "Sprained foot/toe — injured in Bills preseason opener", sources: ["NFL Network","CBS Sports"], updatedAt: "2026-08-26" },
  [norm("Michael Penix Jr.")]: { status: "Q", note: "Knee — won't play preseason finale; hopeful for Week 1 at Pittsburgh", sources: ["ESPN","Falcons beat"], updatedAt: "2026-08-26" },
  [norm("Trey Benson")]: { status: "IR", note: "Knee — reverted to IR 8/25", sources: ["CBS Sports","ESPN"], updatedAt: "2026-08-25" },
  [norm("Josh Downs")]: { status: "Q", note: "Calf — minor; believes he'll resume practicing soon (8/26)", sources: ["ESPN","Colts beat"], updatedAt: "2026-08-26" },
  [norm("Tucker Kraft")]: { status: "Q", note: "Knee — returned to team drills 8/26; still monitoring", sources: ["NFL.com","ESPN"], updatedAt: "2026-08-26" },
};
const healthFor = (name) => PLAYER_HEALTH[norm(name)] || null;
const injuryNoteFor = (name) => {
  const h = healthFor(name);
  if (!h) return null;
  if (h.status === "OFS" || h.status === "IR" || h.status === "OUT") return h.note;
  return null;
};
const healthBlocksDraft = (name) => {
  const s = healthFor(name)?.status;
  return s === "OFS" || s === "IR" || s === "OUT";
};

const HEALTH_LABELS = { Q: "Q", D: "D", OUT: "OUT", IR: "IR", OFS: "OFS", PUP: "PUP" };
function healthSnippet(note, max = 48) {
  if (!note) return "";
  let s = note.split(" — ")[0].split(" - ")[0].trim();
  if (s.length > max) s = `${s.slice(0, max - 1)}…`;
  return s;
}
function HealthTip({ label, note, sources, updatedAt, statusClass, variant = "badge" }) {
  const triggerRef = useRef(null);
  const tipRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState(null); // null until measured — avoids flash at 0,0
  const snippet = healthSnippet(note);
  const meta = [sources?.length ? sources.join(", ") : "", updatedAt ? `Updated ${updatedAt}` : ""].filter(Boolean).join(" · ");
  const fallback = [snippet ? `${label} — ${snippet}` : label, note, meta].filter(Boolean).join(" · ");

  const reposition = useCallback(() => {
    const el = triggerRef.current;
    const tip = tipRef.current;
    if (!el || !tip) return;
    const r = el.getBoundingClientRect();
    const tw = tip.offsetWidth || 200;
    const th = tip.offsetHeight || 80;
    const gap = 8;
    const pad = 8;
    const spaceAbove = r.top - pad;
    const spaceBelow = window.innerHeight - r.bottom - pad;
    const side = spaceAbove >= th + gap || spaceAbove >= spaceBelow ? "above" : "below";
    let top = side === "above" ? r.top - th - gap : r.bottom + gap;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - th - pad));
    setPlace({ top, left, side });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPlace(null);
      return undefined;
    }
    reposition();
    // second pass after paint in case first measure used fallback size
    const raf = requestAnimationFrame(reposition);
    const onScroll = () => reposition();
    const onResize = () => reposition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, reposition]);

  if (!note) {
    return <span className={`health-tag ${statusClass}${variant === "injury" ? " injury-tag" : ""}`}>{label}</span>;
  }
  return (
    <span
      ref={triggerRef}
      className={`health-tag has-tip ${statusClass}${variant === "injury" ? " injury-tag" : ""}${open ? " is-open" : ""}`}
      title={open ? undefined : fallback}
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="health-tag-label">{label}</span>
      {open ? (
        <span
          ref={tipRef}
          className={`health-tip side-${place?.side || "above"}${place ? " is-ready" : ""}`}
          role="tooltip"
          style={place ? { top: place.top, left: place.left } : { top: -9999, left: -9999 }}
        >
          <span className="health-tip-snippet">{snippet || note}</span>
          {note && snippet && note.length > snippet.length ? <span className="health-tip-detail">{note}</span> : null}
          {meta ? <span className="health-tip-meta">{meta}</span> : null}
        </span>
      ) : null}
    </span>
  );
}
function HealthBadge({ health }) {
  if (!health) return <span className="health-tag st-active">—</span>;
  const label = HEALTH_LABELS[health.status] || health.status;
  return (
    <HealthTip
      label={label}
      note={health.note}
      sources={health.sources}
      updatedAt={health.updatedAt}
      statusClass={`st-${health.status}`}
    />
  );
}
function InjuryTag({ note, label = "OUT" }) {
  return <HealthTip label={label} note={note} statusClass="st-OUT" variant="injury" />;
}
const isOutForSeason = (name) => healthFor(name)?.status === "OFS";
const seedOutForSeasonBoard = (boardData) => {
  const next = { ...(boardData || {}) };
  Object.entries(PLAYER_HEALTH).filter(([, h]) => h.status === "OFS" || h.status === "IR" || h.status === "OUT").forEach(([key, h]) => {
    const p = PLAYER_DB.find((x) => norm(x.name) === key);
    if (!p) return;
    const cur = next[key];
    if (cur?.status === "mine") return;
    next[key] = {
      ...(cur || {}),
      name: p.name, pos: p.pos, team: p.team, bye: p.bye,
      status: "gone", price: cur?.price ?? null, star: !!cur?.star,
      injuryNote: h.note,
    };
  });
  return next;
};

/* ---------- estimated auction values (12-team, $200; DB is roughly rank-ordered) ---------- */
const POS_LISTS = {};
PLAYER_DB.forEach((p) => { (POS_LISTS[p.pos] = POS_LISTS[p.pos] || []).push(p); });
const POS_RANK = {};
Object.values(POS_LISTS).forEach((list) => list.forEach((p, i) => { POS_RANK[norm(p.name)] = i + 1; }));
const OVERALL_RANK = {};
RAW_DB.forEach(([name], i) => { OVERALL_RANK[norm(name)] = i + 1; }); // 1–350 consensus board order (1QB)

function isSuperflexLeague(settings) {
  return (settings?.starters?.SUPERFLEX || 0) > 0 && settings?.superflexEligible?.QB !== false;
}

/** Auction $ estimate; pass league settings for 2QB/superflex QB premium. */
function estValue(pos, name, settings = null) {
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
function buildDraftRank(settings) {
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

function slotCostEst(settings) {
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
const tierOf = (name) => { const r = POS_RANK[norm(name)]; return r ? Math.ceil(r / 6) : null; };

function resolveBye(player) {
  if (player?.bye != null && player.bye !== "") {
    const n = Number(player.bye);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return TEAM_BYES[player?.team] || null;
}

/** Bye overlap if `candidate` were added to `roster`. null when clean. */
function assessByeConflict(roster, candidate, slotById = {}) {
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

const PLAN_CATS = ["QB", "RB", "WR", "TE", "K", "DEF", "Bench"];
const DEFAULT_PLAN = { QB: 45, RB: 70, WR: 55, TE: 12, K: 1, DEF: 2, Bench: 15 }; // 2QB superflex budget split
const EMPTY_ASST = { name: "", pos: "", team: "", bye: "", proj: "", presetMax: "", bid: "" };

// ---------- roster slots (built from settings) ----------
function buildRoster(settings) {
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
function autoSlot(pos, occupied, roster) {
  for (const id of roster.autoOrder[pos] || []) if (!occupied.has(id)) return id;
  for (const id of roster.benchIds) if (!occupied.has(id)) return id;
  return null;
}
// rough $ each open starting slot should command, by position
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
  const reduce = useReducedMotion();
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
      <AnimatePresence>
        {expanded ? (
          <motion.div
            className="ac-list"
            id={listId}
            role="listbox"
            aria-label="Player suggestions"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={reduce ? { duration: 0.12 } : motionTokens.spring.snappy}
            style={{ transformOrigin: "top center" }}
          >
            {sugg.map((p, i) => (
              <motion.button
                key={p.id}
                id={`${listId}-opt-${p.id}`}
                type="button"
                role="option"
                aria-selected={i === activeIdx}
                className={`ac-item${i === activeIdx ? " active" : ""}`}
                onMouseDown={(e) => { e.preventDefault(); pick(p); }}
                initial={reduce ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: motionTokens.duration.fast }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <span>{p.name}</span>
                <span className="ac-meta">{p.pos} · {p.team} · Bye {p.bye}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
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
  const [theme, setTheme] = useState(readStoredTheme);
  const [assistant, setAssistant] = useState(EMPTY_ASST);
  const presetTouchedRef = useRef(false);
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [targets, setTargets] = useState([]); // [{ name, pos, team, bye }]
  const [targetFilter, setTargetFilter] = useState("ALL");
  const [targetSort, setTargetSort] = useState("overall"); // "overall" | "pos"
  const [targetName, setTargetName] = useState("");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [catalog, setCatalog] = useState(null);
  const [activeSeasonId, setActiveSeasonIdState] = useState(null);
  const [draftConfirm, setDraftConfirm] = useState(null); // pseudo-target for assistant "Draft Player"
  const reduceMotion = useReducedMotion();
  const press = pressable(reduceMotion);

  // form state
  const emptyForm = { name: "", pos: "", team: "", bye: "", price: "", proj: "" };
  const [form, setForm] = useState(emptyForm);
  const [quick, setQuick] = useState("");
  const quickRef = useRef(null);
  const fileRef = useRef(null);
  const [syncCode, setSyncCode] = useState(null);
  const [syncJoinInput, setSyncJoinInput] = useState("");
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncMeta, setSyncMeta] = useState({});
  const [syncMsg, setSyncMsg] = useState(null); // { type, text }
  const syncSkipPushRef = useRef(false);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const changeView = useCallback((next) => {
    const viewId = next === "board" ? "room" : next;
    setView(viewId);
    if (viewId !== "team") setEditRow(null);
    window.scrollTo(0, 0);
  }, []);

  const changeTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    storageSet(THEME_KEY, theme);
  }, [theme]);

  /* ------- seasons catalog + persistence ------- */
  const applySeasonDraft = useCallback((season) => {
    const d = seasonDraftSlice(season);
    let boardData = d.board && typeof d.board === "object" ? { ...d.board } : {};
    // Older saves stored the big board as `targets` (status / priority).
    // Only migrate when that shape is present and the real board is empty.
    if (isLegacyBoardTargets(season.targets) && Object.keys(boardData).length === 0) {
      boardData = {};
      season.targets.forEach((t) => {
        if (!t?.name) return;
        boardData[boardKey(t.name)] = {
          name: t.name, pos: t.pos, team: t.team, bye: t.bye,
          star: (t.priority || 0) >= 4,
          status: t.status === "mine" ? "mine" : t.status === "opponent" ? "gone" : "available",
          price: null,
        };
      });
    }
    const seededBoard = seedOutForSeasonBoard(boardData);
    const synced = syncStarsAndTargets(seededBoard, normalizePlanTargets(season.targets), boardKey);
    setPlayers(Array.isArray(d.players) ? d.players : []);
    setBoard(synced.board);
    setNextPick(typeof d.nextPick === "number" ? d.nextPick : 1);
    setAssistant(d.assistant);
    setPlan(d.plan);
    setTargets(synced.targets);
    setTargetName("");
    setEditRow(null);
    setView(d.view === "board" ? "room" : (d.view || "room"));
    setSettings(normalizeSettings(d.settings || DEFAULT_SETTINGS));
    setActiveSeasonIdState(season.id);
  }, []);

  const applyRemoteDraft = useCallback((payload) => {
    const d = payload?.draft || payload;
    if (!d || !Array.isArray(d.players)) return false;
    syncSkipPushRef.current = true;
    setPlayers(d.players);
    setBoard(d.board && typeof d.board === "object" ? d.board : {});
    setNextPick(typeof d.nextPick === "number" ? d.nextPick : 1);
    setAssistant(d.assistant && typeof d.assistant === "object" ? { ...EMPTY_ASST, ...d.assistant } : EMPTY_ASST);
    setPlan(d.plan && typeof d.plan === "object" ? { ...DEFAULT_PLAN, ...d.plan } : DEFAULT_PLAN);
    setTargets(normalizePlanTargets(d.targets));
    if (d.settings) setSettings(normalizeSettings(d.settings));
    if (typeof d.view === "string" && d.view !== "board") setView(d.view);
    return true;
  }, []);

  const currentDraftSlice = useCallback(() => ({
    players, board, nextPick, assistant, plan, view, settings, targets,
  }), [players, board, nextPick, assistant, plan, view, settings, targets]);

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
      } catch {
        const cat = createCatalog(createSeason({ startYear: 2026, settings: DEFAULT_SETTINGS, name: "2026–27 Season" }));
        setCatalog(cat);
        applySeasonDraft(getActiveSeason(cat));
      }
      // Cross-device sync: pull active season if a sync code is stored
      try {
        const code = await loadStoredSyncCode();
        const meta = await loadSyncMeta();
        setSyncMeta(meta);
        if (code && isSupabaseConfigured()) {
          setSyncCode(code);
          const remote = await pullActiveSeason(code);
          if (remote?.payload && applyRemoteDraft(remote.payload)) {
            setSyncMeta(await loadSyncMeta());
            setSyncMsg({ type: "ok", text: "Synced from cloud." });
          }
        } else if (code) {
          setSyncCode(code);
        }
      } catch (syncErr) {
        setSyncMsg({ type: "err", text: syncErr?.message || "Could not sync from cloud." });
      }
      setLoaded(true);
    })();
  }, [applySeasonDraft, applyRemoteDraft]);

  useEffect(() => {
    if (!loaded || !activeSeasonId) return;
    const t = setTimeout(() => {
      setCatalog((prev) => {
        if (!prev?.seasons?.[activeSeasonId]) return prev;
        const updated = applyDraftToSeason(prev.seasons[activeSeasonId], {
          players, board, nextPick, assistant, plan, view, settings, targets,
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
  }, [players, board, nextPick, assistant, plan, view, settings, targets, loaded, activeSeasonId]);

  // Push active season to Supabase after local edits settle
  useEffect(() => {
    if (!loaded || !activeSeasonId || !syncCode || !isSupabaseConfigured()) return;
    if (syncSkipPushRef.current) {
      syncSkipPushRef.current = false;
      return;
    }
    const t = setTimeout(() => {
      const season = catalog?.seasons?.[activeSeasonId] || { id: activeSeasonId };
      pushActiveSeason({
        code: syncCode,
        season: {
          id: season.id,
          label: season.label,
          name: season.name,
          startYear: season.startYear,
        },
        draft: { players, board, nextPick, assistant, plan, settings, targets, view },
      })
        .then(async () => setSyncMeta(await loadSyncMeta()))
        .catch((err) => setSyncMsg({ type: "err", text: err?.message || "Cloud sync failed." }));
    }, 1400);
    return () => clearTimeout(t);
  }, [players, board, nextPick, assistant, plan, view, settings, targets, loaded, activeSeasonId, syncCode, catalog]);

  const seasonList = useMemo(() => (catalog ? listSeasons(catalog) : []), [catalog]);
  const activeSeason = catalog && activeSeasonId ? catalog.seasons[activeSeasonId] : null;

  const switchSeason = useCallback((id) => {
    if (!catalog || id === activeSeasonId) return;
    // flush current draft into catalog synchronously before switching
    const flushed = applyDraftToSeason(catalog.seasons[activeSeasonId], { players, board, nextPick, assistant, plan, view, settings, targets });
    let nextCat = upsertSeason(catalog, flushed);
    nextCat = setActiveSeasonId(nextCat, id);
    setCatalog(nextCat);
    applySeasonDraft(nextCat.seasons[id]);
    storageSet(CATALOG_KEY, JSON.stringify(nextCat));
    showToast(`Switched to ${nextCat.seasons[id].label}`, "ok");
  }, [catalog, activeSeasonId, players, board, nextPick, assistant, plan, view, settings, targets, applySeasonDraft, showToast]);

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
      detail: "Downloads a backup JSON of the finished season for your records, then opens an empty board with league settings copied. You can switch back anytime.",
      onYes: () => {
        const flushed = applyDraftToSeason(from, { players, board, nextPick, assistant, plan, view, settings, targets });
        try {
          downloadSeasonArchive(flushed, {
            players: flushed.players,
            board: flushed.board,
            nextPick: flushed.nextPick,
            assistant: flushed.assistant,
            plan: flushed.plan,
            settings: flushed.settings,
            targets: flushed.targets,
          });
        } catch { /* archive is best-effort */ }
        let nextCat = upsertSeason(catalog, flushed);
        nextCat = upsertSeason(nextCat, next);
        nextCat = setActiveSeasonId(nextCat, next.id);
        setCatalog(nextCat);
        applySeasonDraft(next);
        storageSet(CATALOG_KEY, JSON.stringify(nextCat));
        setConfirmBox(null);
        showToast(`${next.label} ready — season archive downloaded.`, "ok");
      },
    });
  }, [catalog, activeSeasonId, players, board, nextPick, assistant, plan, view, settings, targets, applySeasonDraft, switchSeason, showToast]);

  /* ------- roster shape derived from settings ------- */
  const roster = useMemo(() => buildRoster(settings), [settings]);
  const SLOTS = roster.slots;
  const SLOT_BY_ID = roster.byId;
  const ROSTER_SIZE = roster.size;
  const BUDGET = settings.budget;
  const draftRank = useMemo(() => buildDraftRank(settings), [settings]);
  const slotCosts = useMemo(() => slotCostEst(settings), [settings]);
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
  const superflexOpen = openStarters.filter((s) => s.pos === "SUPERFLEX").length;

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
  const fillCost = openStarters.reduce((s, sl) => s + (slotCosts[sl.pos] || 5), 0) + benchOpen;
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
    const est = estValue(pos, assistant.name, settings);
    const projIn = assistant.proj !== "" && Number.isFinite(Number(assistant.proj)) ? Number(assistant.proj) : null;
    const V = projIn != null ? projIn : est;
    const preset = assistant.presetMax !== "" && Number.isFinite(Number(assistant.presetMax)) ? Number(assistant.presetMax) : null;
    const hasBid = assistant.bid !== "";
    const bid = hasBid ? Math.max(0, Math.round(Number(assistant.bid)) || 0) : 0;
    const slot = autoSlot(pos, new Set(players.map((p) => p.slot)), roster);
    const slotLabel = slot ? SLOT_BY_ID[slot].label : null;
    const fillsDedicated = !!slot && slot !== "FLEX" && !slot.startsWith("SUPERFLEX") && !slot.startsWith("B");
    const fillsFlex = slot === "FLEX" || (slot && slot.startsWith("FLEX"));
    const fillsSuperflex = slot === "SUPERFLEX" || (slot && slot.startsWith("SUPERFLEX"));
    const dup = !!settings.onlyOne[pos] && posCounts[pos] >= 1;
    const qbDepth = (posNeed.QB || 0) + ((settings.starters.SUPERFLEX || 0) && settings.superflexEligible?.QB ? settings.starters.SUPERFLEX : 0);
    const depthTargets = { QB: qbDepth, RB: posNeed.RB + 3, WR: posNeed.WR + 3, TE: posNeed.TE, K: posNeed.K, DEF: posNeed.DEF };
    const deep = posCounts[pos] >= (depthTargets[pos] || 1) && !fillsDedicated && !fillsFlex && !fillsSuperflex;

    // bye impact if added
    const byeConflict = assessByeConflict(
      players,
      { name: assistant.name, pos, team: assistant.team, bye: assistant.bye },
      SLOT_BY_ID,
    );

    // need weighting
    let mult;
    if (dup) mult = 0.45;
    else if (fillsDedicated) mult = 1.15;
    else if (fillsSuperflex) mult = 1.08;
    else if (fillsFlex) mult = 1.05;
    else if (deep) mult = 0.85;
    else mult = 0.95;
    if ((pos === "RB" || pos === "WR") && posCounts[pos] === 0) mult += 0.05;
    if (byeConflict) mult -= byeConflict.level >= 2 ? 0.08 : 0.04;

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
    if (byeConflict && tier !== "pass" && tier !== "idle") why.push(`Bye note: ${byeConflict.message}.`);
    if (budgetHealth === "tight" && tier === "bid") { tier = "value"; why.push("Budget is tight — don't stretch past the number."); }

    return { pos, V, est, projIn, preset, bid, hasBid, suggested, recMax, absMax: maxBid, tier, why: why.join(" "), slot, slotLabel, discount, byeConflict };
  }, [assistant, players, posCounts, openStarters, maxBid, spotsLeft, budgetHealth, SLOT_BY_ID, settings]);

  /* ------- market inflation from off-the-board prices ------- */
  const market = useMemo(() => {
    const sales = [];
    players.forEach((p) => { const e = estValue(p.pos, p.name, settings); if (e != null && e >= 3) sales.push([e, p.price]); });
    Object.values(board).forEach((b) => {
      if (b.status !== "gone" || b.price == null) return;
      const e = estValue(b.pos, b.name, settings);
      if (e != null && e >= 3) sales.push([e, b.price]);
    });
    if (sales.length < 3) return { factor: 1, pct: 0, n: sales.length };
    const totalEst = sales.reduce((s, x) => s + x[0], 0);
    const totalPaid = sales.reduce((s, x) => s + x[1], 0);
    const factor = Math.max(0.6, Math.min(1.6, totalPaid / Math.max(1, totalEst)));
    return { factor, pct: Math.round((factor - 1) * 100), n: sales.length };
  }, [players, board, settings]);
  const adjEst = useCallback((pos, name) => {
    const e = estValue(pos, name, settings);
    if (e == null) return null;
    return Math.max(1, Math.round(e * market.factor));
  }, [market.factor, settings]);

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
    const nextStar = !board[k]?.star;
    setBoard((b) => ({ ...b, [k]: { ...(b[k] || { status: "available", price: null, ...meta }), ...meta, name, star: nextStar } }));
    if (nextStar) addTarget({ name, ...meta }, { silent: true });
    else removeTarget(name, { silent: true });
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
    setEditRow((r) => (r && r.id === id ? null : r));
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
    const draftedByName = new Map(players.map((p) => [norm(p.name), p]));
    const rows = PLAYER_DB.map((p) => {
      const k = boardKey(p.name);
      const b = board[k] || {};
      const rosterP = draftedByName.get(norm(p.name));
      const status = rosterP ? "mine" : (b.status || "available");
      const price = status === "mine" ? (rosterP?.price ?? b.price ?? null) : (b.price ?? null);
      const health = healthFor(p.name);
      const injuryNote = b.injuryNote || injuryNoteFor(p.name);
      const effStatus = injuryNote && status === "available" ? "gone" : status;
      return {
        ...p, key: k, status: effStatus, price, star: !!b.star,
        est: adjEst(p.pos, p.name), tier: tierOf(p.name),
        rank: POS_RANK[norm(p.name)] || 999,
        overall: draftRank[norm(p.name)] || null,
        consensus: OVERALL_RANK[norm(p.name)] || null,
        health, injuryNote,
      };
    });
    // custom players tracked off-board that aren't in the built-in DB
    Object.entries(board).forEach(([k, b]) => {
      if (!b.name || rows.some((r) => r.key === k)) return;
      rows.push({
        id: `x-${k}`, name: b.name, pos: b.pos || "", team: b.team || "", bye: b.bye || null, key: k,
        status: b.status || "available", price: b.price ?? null, star: !!b.star,
        est: adjEst(b.pos, b.name), tier: null, rank: 999, overall: null,
      });
    });
    const filtered = rows
      .filter((r) => (boardFilter === "ALL" ? true : r.pos === boardFilter))
      .filter((r) => (boardStarsOnly ? r.star : true))
      .filter((r) => (boardShowGone ? true : r.status === "available"));

    // Always overall rank order — showing taken only inserts them in place, never re-sorts.
    const byOverall = (a, b) =>
      (a.overall ?? 9999) - (b.overall ?? 9999) ||
      a.rank - b.rank ||
      a.name.localeCompare(b.name);

    const sorted = filtered.sort(byOverall);
    return sorted;
  }, [board, players, boardFilter, boardShowGone, boardStarsOnly, adjEst, draftRank]);

  const boardAvailableCount = useMemo(() => {
    const draftedNames = new Set(players.map((p) => norm(p.name)));
    let n = 0;
    PLAYER_DB.forEach((p) => {
      if (draftedNames.has(norm(p.name))) return;
      const b = board[boardKey(p.name)];
      if (b?.status === "gone" || b?.status === "mine") return;
      n += 1;
    });
    Object.values(board).forEach((b) => {
      if (!b?.name || b.status === "gone" || b.status === "mine") return;
      if (draftedNames.has(norm(b.name))) return;
      if (PLAYER_DB.some((p) => boardKey(p.name) === boardKey(b.name))) return;
      n += 1;
    });
    return n;
  }, [board, players]);

  const nominateSuggestions = useMemo(() => {
    if (spotsLeft <= 0) return { overall: null, need: null, needReason: null, target: null };

    const draftedNames = new Set(players.map((p) => norm(p.name)));
    const pool = [];
    PLAYER_DB.forEach((p) => {
      if (draftedNames.has(norm(p.name))) return;
      const k = boardKey(p.name);
      const b = board[k];
      if (b?.status === "gone" || b?.status === "mine") return;
      if (healthBlocksDraft(p.name)) return;
      pool.push({
        ...p,
        key: k,
        star: !!b?.star,
        est: adjEst(p.pos, p.name),
        rank: POS_RANK[norm(p.name)] || 999,
        overall: draftRank[norm(p.name)] || 9999,
        byeConflict: assessByeConflict(players, p, SLOT_BY_ID),
      });
    });
    Object.entries(board).forEach(([k, b]) => {
      if (!b?.name || b.status === "gone" || b.status === "mine") return;
      if (draftedNames.has(norm(b.name))) return;
      if (pool.some((r) => r.key === k)) return;
      const custom = {
        id: `x-${k}`, name: b.name, pos: b.pos || "", team: b.team || "", bye: b.bye || null,
        key: k, star: !!b.star, est: adjEst(b.pos, b.name), rank: 999, overall: 9999,
      };
      custom.byeConflict = assessByeConflict(players, custom, SLOT_BY_ID);
      pool.push(custom);
    });

    // Best = top of draft board (value-based in 2QB superflex, consensus in 1QB)
    const rankPick = (a, b) =>
      a.overall - b.overall ||
      a.rank - b.rank ||
      (b.star ? 1 : 0) - (a.star ? 1 : 0);

    const overall = [...pool].sort(rankPick)[0] || null;

    const shortfalls = POSITIONS
      .map((pos) => ({ pos, short: (posNeed[pos] || 0) - (posCounts[pos] || 0) }))
      .filter((x) => x.short > 0)
      .sort((a, b) =>
        b.short - a.short ||
        NEED_POS_PRIORITY.indexOf(a.pos) - NEED_POS_PRIORITY.indexOf(b.pos));

    let need = null;
    let needReason = null;
    if (shortfalls.length) {
      const pos = shortfalls[0].pos;
      need = pool.filter((p) => p.pos === pos).sort(rankPick)[0] || null;
      needReason = need ? `Need ${pos}` : null;
    } else if (superflexOpen > 0) {
      need = pool.filter((p) => settings.superflexEligible?.[p.pos]).sort(rankPick)[0] || null;
      needReason = need ? `SUPERFLEX ${need.pos}` : null;
    } else if (flexOpen > 0) {
      need = pool.filter((p) => settings.flexEligible[p.pos]).sort(rankPick)[0] || null;
      needReason = need ? `FLEX ${need.pos}` : null;
    }

    let target = null;
    if (targets.length) {
      const remaining = [];
      targets.forEach((t) => {
        const k = boardKey(t.name);
        if (draftedNames.has(k)) return;
        const b = board[k];
        if (b?.status === "gone" || b?.status === "mine") return;
        if (isOutForSeason(t.name)) return;
        const fromPool = pool.find((r) => r.key === k);
        if (fromPool) { remaining.push(fromPool); return; }
        const row = {
          id: `t-${k}`, name: t.name, pos: t.pos || "", team: t.team || "", bye: t.bye || null,
          key: k, star: !!b?.star, est: adjEst(t.pos, t.name),
          rank: POS_RANK[k] || 999, overall: draftRank[k] || 9999,
        };
        row.byeConflict = assessByeConflict(players, row, SLOT_BY_ID);
        remaining.push(row);
      });
      target = remaining.sort(rankPick)[0] || null;
    }

    return { overall, need, needReason, target };
  }, [spotsLeft, players, board, targets, adjEst, draftRank, posNeed, posCounts, flexOpen, superflexOpen, settings.flexEligible, settings.superflexEligible, SLOT_BY_ID]);

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

  const addTarget = (p, { silent = false } = {}) => {
    if (!p?.name) return;
    const k = boardKey(p.name);
    if (targets.some((t) => boardKey(t.name) === k)) {
      if (!silent) showToast(`${p.name} is already on your target list.`, "warn");
      setTargetName("");
      return;
    }
    setTargets((ts) => [...ts, {
      name: p.name, pos: p.pos || "", team: p.team || "",
      bye: p.bye ?? TEAM_BYES[p.team] ?? null,
    }]);
    setBoard((b) => ({
      ...b,
      [k]: {
        ...(b[k] || { status: "available", price: null }),
        name: p.name,
        pos: p.pos || b[k]?.pos || "",
        team: p.team || b[k]?.team || "",
        bye: p.bye ?? b[k]?.bye ?? TEAM_BYES[p.team] ?? null,
        star: true,
        status: b[k]?.status || "available",
        price: b[k]?.price ?? null,
      },
    }));
    setTargetName("");
    if (!silent) showToast(`${p.name} starred & added to targets.`, "ok");
  };
  const addTargetFromInput = () => {
    const q = targetName.trim();
    if (q.length < 2) { showToast("Search a player to add.", "warn"); return; }
    const pos = targetFilter === "ALL" ? null : targetFilter;
    const hits = matchPlayers(q, pos);
    if (hits.length === 1) { addTarget(hits[0]); return; }
    if (hits.length > 1) { showToast("Pick a player from the suggestions.", "warn"); return; }
    showToast("No player matched that name.", "err");
  };
  const removeTarget = (name, { silent = false } = {}) => {
    const k = boardKey(name);
    setTargets((ts) => ts.filter((t) => boardKey(t.name) !== k));
    setBoard((b) => {
      if (!b[k]?.star) return b;
      return { ...b, [k]: { ...b[k], star: false } };
    });
    if (!silent) showToast(`${name} removed from targets.`, "info");
  };

  const toggleTarget = (p, opts) => {
    if (!p?.name) return;
    const k = boardKey(p.name);
    if (targets.some((t) => boardKey(t.name) === k)) removeTarget(p.name, opts);
    else addTarget(p, opts);
  };

  const targetRows = useMemo(() => {
    const posIdx = Object.fromEntries(POS_ORDER.map((pos, i) => [pos, i]));
    const rows = targets.map((t) => {
      const k = boardKey(t.name);
      let status = "available";
      if (players.some((pl) => boardKey(pl.name) === k)) status = "mine";
      else {
        const b = board[k];
        if (b?.status === "gone" || b?.status === "mine") status = b.status;
      }
      const injuryNote = board[k]?.injuryNote || injuryNoteFor(t.name);
      const effStatus = injuryNote && status === "available" ? "gone" : status;
      return {
        ...t, key: k, status: effStatus,
        est: adjEst(t.pos, t.name),
        rank: POS_RANK[k] || 999,
        overall: draftRank[k] || 9999,
        bye: t.bye || TEAM_BYES[t.team] || null,
        health: healthFor(t.name), injuryNote,
      };
    });
    const filtered = targetFilter === "ALL" ? rows : rows.filter((r) => r.pos === targetFilter);
    const byOverall = (a, b) => a.overall - b.overall || a.rank - b.rank || a.name.localeCompare(b.name);
    if (targetSort === "pos") {
      return [...filtered].sort((a, b) => (posIdx[a.pos] ?? 99) - (posIdx[b.pos] ?? 99) || byOverall(a, b));
    }
    return [...filtered].sort(byOverall);
  }, [targets, players, board, adjEst, draftRank, targetFilter, targetSort]);

  const targetsLeftAll = useMemo(() => {
    return targets.filter((t) => {
      const k = boardKey(t.name);
      if (players.some((pl) => boardKey(pl.name) === k)) return false;
      const b = board[k];
      if (isOutForSeason(t.name)) return false;
      return b?.status !== "gone" && b?.status !== "mine";
    }).length;
  }, [targets, players, board]);

  const targetKeySet = useMemo(
    () => new Set(targets.map((t) => boardKey(t.name))),
    [targets],
  );

  /* ------- sync / archive / reset ------- */
  const archiveActiveSeason = useCallback(() => {
    if (!activeSeason) return;
    downloadSeasonArchive(activeSeason, currentDraftSlice());
    showToast("Season archive downloaded.", "ok");
  }, [activeSeason, currentDraftSlice, showToast]);

  const enableSync = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSyncMsg({ type: "err", text: "Supabase env vars are not set on this deploy." });
      return;
    }
    setSyncBusy(true);
    setSyncMsg(null);
    try {
      const code = generateSyncCode();
      await saveStoredSyncCode(code);
      setSyncCode(code);
      await pushActiveSeason({
        code,
        season: activeSeason || { id: activeSeasonId },
        draft: currentDraftSlice(),
      });
      setSyncMeta(await loadSyncMeta());
      setSyncMsg({ type: "ok", text: "Sync enabled. Enter this code on your other devices." });
      showToast("Cross-device sync on.", "ok");
    } catch (err) {
      setSyncMsg({ type: "err", text: err?.message || "Could not enable sync." });
    } finally {
      setSyncBusy(false);
    }
  }, [activeSeason, activeSeasonId, currentDraftSlice, showToast]);

  const joinSync = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSyncMsg({ type: "err", text: "Supabase env vars are not set on this deploy." });
      return;
    }
    const cleaned = normalizeSyncCode(syncJoinInput);
    if (cleaned.length !== 16) {
      setSyncMsg({ type: "err", text: "Enter a full AWR sync code (16 characters)." });
      return;
    }
    setSyncBusy(true);
    setSyncMsg(null);
    try {
      const code = formatSyncCode(cleaned);
      const remote = await pullActiveSeason(code);
      await saveStoredSyncCode(code);
      setSyncCode(code);
      setSyncJoinInput("");
      if (remote?.payload && applyRemoteDraft(remote.payload)) {
        setSyncMsg({ type: "ok", text: "Joined sync — active season loaded from cloud." });
        showToast("Synced from cloud.", "ok");
      } else {
        await pushActiveSeason({
          code,
          season: activeSeason || { id: activeSeasonId },
          draft: currentDraftSlice(),
        });
        setSyncMsg({ type: "ok", text: "Joined sync — nothing in cloud yet, pushed this device." });
        showToast("Sync joined.", "ok");
      }
      setSyncMeta(await loadSyncMeta());
    } catch (err) {
      setSyncMsg({ type: "err", text: err?.message || "Could not join sync." });
    } finally {
      setSyncBusy(false);
    }
  }, [syncJoinInput, applyRemoteDraft, activeSeason, activeSeasonId, currentDraftSlice, showToast]);

  const pullSyncNow = useCallback(async () => {
    if (!syncCode || !isSupabaseConfigured()) return;
    setSyncBusy(true);
    try {
      const remote = await pullActiveSeason(syncCode);
      if (remote?.payload && applyRemoteDraft(remote.payload)) {
        setSyncMeta(await loadSyncMeta());
        setSyncMsg({ type: "ok", text: "Pulled latest from cloud." });
        showToast("Pulled from cloud.", "ok");
      } else {
        setSyncMsg({ type: "info", text: "No cloud data for this code yet." });
      }
    } catch (err) {
      setSyncMsg({ type: "err", text: err?.message || "Pull failed." });
    } finally {
      setSyncBusy(false);
    }
  }, [syncCode, applyRemoteDraft, showToast]);

  const disableSync = useCallback(() => {
    setConfirmBox({
      message: "Turn off cross-device sync?",
      detail: "This device stops syncing. Cloud data stays until you overwrite it with a new code. Other devices keep working until you disable them too.",
      onYes: async () => {
        await clearStoredSyncCode();
        setSyncCode(null);
        setSyncMeta({});
        setSyncMsg(null);
        setConfirmBox(null);
        showToast("Sync disabled on this device.", "info");
      },
    });
  }, [showToast]);

  const copySyncCode = useCallback(async () => {
    if (!syncCode) return;
    try {
      await navigator.clipboard.writeText(syncCode);
      showToast("Sync code copied.", "ok");
    } catch {
      showToast("Could not copy — select the code manually.", "warn");
    }
  }, [syncCode, showToast]);

  const importDraft = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (!Array.isArray(d.players)) throw new Error("bad file");
        setConfirmBox({
          message: "Restore from archive file?",
          detail: `It contains ${d.players.length} drafted players and ${Object.keys(d.board || {}).length} tracked board entries. This replaces the active season on screen.`,
          onYes: () => {
            setPlayers(d.players); setBoard(d.board || {});
            setNextPick(d.nextPick || d.players.length + 1);
            if (d.plan && typeof d.plan === "object") setPlan({ ...DEFAULT_PLAN, ...d.plan });
            if (d.settings) setSettings(normalizeSettings(d.settings));
            setTargets(normalizePlanTargets(d.targets));
            setAssistant(EMPTY_ASST);
            setConfirmBox(null); showToast("Archive restored.", "ok");
          },
        });
      } catch { showToast("That file isn't a valid season archive.", "err"); }
    };
    reader.readAsText(file);
  };
  const resetDraft = () => {
    const pickCount = players.length;
    const boardCount = Object.keys(board).length;
    setConfirmBox({
      message: `Clear ${activeSeason?.label || "this season"} entries?`,
      detail: `Removes ${pickCount} pick${pickCount === 1 ? "" : "s"} and ${boardCount} board mark${boardCount === 1 ? "" : "s"} for this season. League settings stay. Other seasons stay untouched.`,
      onYes: () => {
        setPlayers([]);
        setBoard({});
        setNextPick(1);
        setAssistant(EMPTY_ASST);
        setForm(emptyForm);
        setQuick("");
        setEditRow(null);
        setQuickOpen(false);
        setConfirmBox(null);
        showToast("Entries cleared. Budget restored.", "ok");
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
    { id: "plan", label: "Plan", icon: "dollar", fb: "$", badge: planOverruns.length ? String(planOverruns.length) : null },
    { id: "settings", label: "Settings", icon: "settings", fb: "✦", badge: null },
  ];
  const settingsLabel = `${activeSeason?.label || "2026–27"} · ${settings.teams}-team · $${settings.budget} · 1.5 PPR`;

  /* ------- composable panels ------- */
  const hasAsstData = Boolean(assistant.name || assistant.pos || assistant.team || assistant.bye || assistant.proj || assistant.presetMax || assistant.bid);

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
                <div className="field-label-row">
                  <span>Player</span>
                  <button
                    type="button"
                    className="field-clear-btn"
                    onClick={clearAssistant}
                    disabled={!hasAsstData}
                    style={{ visibility: hasAsstData ? "visible" : "hidden" }}
                    aria-label="Clear player block"
                  >
                    Clear
                  </button>
                </div>
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
                <motion.button type="button" className="btn bid-step" onClick={() => bumpBid(-1)} aria-label="Lower bid by one dollar" {...press}>−$1</motion.button>
                <div className="bid-box">
                  <label htmlFor="asst-bid">Current bid</label>
                  <input id="asst-bid" className="bid-input" inputMode="numeric" aria-label="Current auction bid in dollars" value={assistant.bid} placeholder="—"
                          onChange={(e) => setAssistant((a) => ({ ...a, bid: e.target.value.replace(/[^0-9]/g, "") }))} />
                </div>
                <motion.button type="button" className="btn bid-step" onClick={() => bumpBid(1)} aria-label="Raise bid by one dollar" {...press}>+$1</motion.button>
              </div>

              <div className="asst-actions">
                <motion.button type="button" className="btn primary big" onClick={assistantDraft} {...press}>Draft player</motion.button>
                <motion.button type="button" className="btn" onClick={assistantGone} {...press}>Went elsewhere</motion.button>
                <motion.button
                  type="button"
                  className="btn ghost asst-clear-btn"
                  onClick={clearAssistant}
                  disabled={!hasAsstData}
                  title="Clear player block"
                  aria-label="Clear player block"
                  {...press}
                >
                  Clear
                </motion.button>
              </div>
            </div>

            <div className="asst-decision">
              <div className="asst-verdict">
                {analysis ? (
                  <>
                    <div className="call-head">
                      <motion.div
                        key={analysis.tier}
                        className={`verdict ${analysis.tier}`}
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        initial={reduceMotion ? false : { scale: 0.92, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={motionTokens.spring.snappy}
                      >
                        {analysis.tier === "idle" ? "READY" : analysis.tier === "bid" ? "BID" : analysis.tier === "value" ? "VALUE" : analysis.tier === "caution" ? "CAUTION" : "PASS"}
                      </motion.div>
                      <div className="call-hero">
                        <span className="call-hero-label">Recommended max</span>
                        <motion.span
                          key={analysis.recMax}
                          className="call-hero-num"
                          initial={reduceMotion ? false : { y: 8, opacity: 0.4 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={motionTokens.spring.snappy}
                        >
                          {money(analysis.recMax)}
                        </motion.span>
                      </div>
                    </div>
                    <p className="verdict-why">{analysis.why}</p>
                    {analysis.byeConflict ? (
                      <div className={`bye-callout lv-${analysis.byeConflict.level}`} role="status">
                        <span className="bye-callout-label">Bye watch</span>
                        <span className="bye-callout-msg">{analysis.byeConflict.message}</span>
                      </div>
                    ) : null}
                    <dl className="verdict-nums" aria-label="Bid context">
                      <div><dt>Bid</dt><dd className="vn">{analysis.hasBid ? money(analysis.bid) : "—"}</dd></div>
                      <div><dt>Proj</dt><dd className="vn">{analysis.V != null ? money(analysis.V) : "—"}{analysis.projIn == null && analysis.V != null ? <em> est</em> : null}</dd></div>
                      <div><dt>Abs max</dt><dd className="vn">{money(analysis.absMax)}</dd></div>
                      <div><dt>Fills</dt><dd className="vn">{analysis.slotLabel || "—"}</dd></div>
                    </dl>
                    <PriceMeter bid={analysis.hasBid ? analysis.bid : null} V={analysis.V} recMax={analysis.recMax} absMax={analysis.absMax} tier={analysis.tier} />
                  </>
                ) : (
                  <>
                    <div className="call-head">
                      <div className="verdict idle" role="status">READY</div>
                      <div className="call-hero">
                        <span className="call-hero-label">Recommended max</span>
                        <span className="call-hero-num">—</span>
                      </div>
                    </div>
                    <p className="verdict-why verdict-placeholder">Search a player on the block to see live bid recommendations and value analysis.</p>
                    <dl className="verdict-nums" aria-label="Bid context">
                      <div><dt>Bid</dt><dd className="vn">—</dd></div>
                      <div><dt>Proj</dt><dd className="vn">—</dd></div>
                      <div><dt>Abs max</dt><dd className="vn">{spotsLeft > 0 ? money(maxBid) : "—"}</dd></div>
                      <div><dt>Fills</dt><dd className="vn">—</dd></div>
                    </dl>
                    <PriceMeter bid={null} V={null} recMax={null} absMax={maxBid} tier="idle" />
                  </>
                )}

                <div className="asst-alt">
                  <div className="asst-alt-head">
                    <span className="eyebrow small">Still available{assistant.pos ? ` at ${assistant.pos}` : ""}</span>
                    {alternatives.length > 0 && <span className="asst-alt-count">{alternatives.length}</span>}
                  </div>
                  {alternatives.length === 0 ? (
                    <div className="empty-note compact alt-empty-box">Load a player to compare next-best options.</div>
                  ) : (
                    <div className="alt-table">
                      <table className="alt-table-el">
                        <caption className="sr-only">Still available{assistant.pos ? ` at ${assistant.pos}` : ""}</caption>
                        <thead>
                          <tr>
                            <th scope="col" className="alt-tier col-tier">Tier</th>
                            <th scope="col" className="alt-name col-pname">Player name</th>
                            <th scope="col" className="alt-team col-team">Team</th>
                            <th scope="col" className="alt-bye col-bye">Bye</th>
                            <th scope="col" className="alt-est col-est num">Max price</th>
                            <th scope="col" className="col-action"><span className="sr-only">Actions</span></th>
                          </tr>
                        </thead>
                        <tbody>
                          {alternatives.map((p) => {
                            const altBye = assessByeConflict(players, p, SLOT_BY_ID);
                            return (
                            <tr key={p.id} className={altBye ? `bye-row-hit lv-${altBye.level}` : ""}>
                              <td className="alt-tier col-tier">T{p.tier}</td>
                              <td className="alt-name col-pname">
                                <button type="button" className="linklike" onClick={() => pickAssistantPlayer(p)} aria-label={`Load ${p.name} into assistant`}>
                                  {p.name}
                                </button>
                              </td>
                              <td className="alt-team col-team">{p.team || "—"}</td>
                              <td className={`alt-bye col-bye${altBye ? ` hit lv-${altBye.level}` : ""}`} title={altBye?.message || undefined}>
                                {p.bye ?? "—"}
                                {altBye ? <span className="bye-dot" aria-hidden="true" /> : null}
                              </td>
                              <td className="alt-est col-est num">{p.est != null ? money(p.est) : "—"}</td>
                              <td className="col-action">
                                <button className="icon-btn alt-gone" title="Mark off the board" aria-label={`Mark ${p.name} off the board`} onClick={() => setPriceAsk({ mode: "gone", player: p })}><Ic name="cross-small" fb="✕" /></button>
                              </td>
                            </tr>
                            );
                          })}
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
                  const editing = editRow?.id === p.id;
                  const v = p.proj != null ? Number(p.proj) - p.price : null;
                  const meta = [p.team || null, p.bye ? `Bye ${p.bye}` : null].filter(Boolean).join(" · ");
                  const patchEdit = (patch) => setEditRow((r) => (r && r.id === p.id ? { ...r, ...patch } : r));
                  const onEditKey = (e) => {
                    if (e.key === "Enter") { e.preventDefault(); saveEdit(editRow); }
                    if (e.key === "Escape") { e.preventDefault(); setEditRow(null); }
                  };
                  if (editing) {
                    const editVal = editRow.proj === "" || editRow.proj == null || !Number.isFinite(Number(editRow.proj))
                      ? null
                      : Number(editRow.proj) - (Number(editRow.price) || 0);
                    rows.push(
                      <tr key={s.id} className="roster-editing">
                        <td className="slot col-slot">
                          <select
                            className="field roster-inline"
                            aria-label="Roster slot"
                            value={editRow.slot}
                            onChange={(e) => patchEdit({ slot: e.target.value })}
                            onKeyDown={onEditKey}
                          >
                            {SLOTS.filter((t2) => t2.accepts.includes(editRow.pos)).map((t2) => {
                              const occ = occupied.get(t2.id);
                              return <option key={t2.id} value={t2.id}>{t2.label}{occ && occ.id !== editRow.id ? ` (swap)` : ""}</option>;
                            })}
                          </select>
                        </td>
                        <td className="pname col-player">
                          <div className="roster-edit-player">
                            <input
                              className="field roster-inline"
                              aria-label="Player name"
                              value={editRow.name}
                              onChange={(e) => patchEdit({ name: e.target.value })}
                              onKeyDown={onEditKey}
                              autoFocus
                            />
                            <select
                              className="field roster-inline roster-inline-pos"
                              aria-label="Position"
                              value={editRow.pos}
                              onChange={(e) => {
                                const pos = e.target.value;
                                const keep = SLOT_BY_ID[editRow.slot]?.accepts.includes(pos);
                                const slot = keep
                                  ? editRow.slot
                                  : (SLOTS.find((t2) => t2.accepts.includes(pos) && (!occupied.has(t2.id) || occupied.get(t2.id)?.id === editRow.id))?.id
                                    || SLOTS.find((t2) => t2.accepts.includes(pos))?.id
                                    || editRow.slot);
                                patchEdit({ pos, slot });
                              }}
                              onKeyDown={onEditKey}
                            >
                              {POSITIONS.map((pos) => <option key={pos}>{pos}</option>)}
                            </select>
                            <div className="roster-edit-extra">
                              <select
                                className="field roster-inline"
                                aria-label="NFL team"
                                value={editRow.team}
                                onChange={(e) => patchEdit({ team: e.target.value, bye: e.target.value ? String(TEAM_BYES[e.target.value]) : editRow.bye })}
                                onKeyDown={onEditKey}
                              >
                                <option value="">Team</option>
                                {TEAMS.map((t) => <option key={t}>{t}</option>)}
                              </select>
                              <input
                                className="field roster-inline"
                                inputMode="numeric"
                                aria-label="Bye week"
                                placeholder="Bye"
                                value={editRow.bye || ""}
                                onChange={(e) => patchEdit({ bye: e.target.value })}
                                onKeyDown={onEditKey}
                              />
                              <input
                                className="field roster-inline roster-inline-num"
                                inputMode="numeric"
                                aria-label="Projected value in dollars"
                                placeholder="Proj $"
                                value={editRow.proj}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => patchEdit({ proj: e.target.value })}
                                onKeyDown={onEditKey}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="col-team">
                          <select
                            className="field roster-inline"
                            aria-label="NFL team"
                            value={editRow.team}
                            onChange={(e) => patchEdit({ team: e.target.value, bye: e.target.value ? String(TEAM_BYES[e.target.value]) : editRow.bye })}
                            onKeyDown={onEditKey}
                          >
                            <option value="">—</option>
                            {TEAMS.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="col-bye">
                          <input
                            className="field roster-inline"
                            inputMode="numeric"
                            aria-label="Bye week"
                            value={editRow.bye || ""}
                            onChange={(e) => patchEdit({ bye: e.target.value })}
                            onKeyDown={onEditKey}
                          />
                        </td>
                        <td className="num col-paid">
                          <input
                            className="field roster-inline roster-inline-num"
                            inputMode="numeric"
                            aria-label="Auction price paid in dollars"
                            value={editRow.price}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => patchEdit({ price: e.target.value })}
                            onKeyDown={onEditKey}
                          />
                        </td>
                        <td className="num hide-xs col-value">
                          <input
                            className="field roster-inline roster-inline-num"
                            inputMode="numeric"
                            aria-label="Projected value in dollars"
                            placeholder="Proj"
                            value={editRow.proj}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => patchEdit({ proj: e.target.value })}
                            onKeyDown={onEditKey}
                            title={editVal == null ? "Projected $" : `Value ${editVal > 0 ? `+$${editVal}` : money(editVal)}`}
                          />
                        </td>
                        <td className="actions col-actions">
                          <button className="icon-btn ok" title="Save" aria-label={`Save ${editRow.name}`} onClick={() => saveEdit(editRow)}><span aria-hidden="true">✓</span></button>
                          <button className="icon-btn" title="Cancel" aria-label="Cancel edit" onClick={() => setEditRow(null)}><Ic name="cross-small" fb="✕" /></button>
                        </td>
                      </tr>
                    );
                  } else {
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

  const loadSuggestion = (p) => {
    pickAssistantPlayer(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const loadTargetToRoom = (p) => {
    pickAssistantPlayer(p);
    changeView("room");
  };

  const suggestPanel = (() => {
    const { overall, need, needReason, target } = nominateSuggestions;
    if (!overall && !need && !target) return null;
    const byKey = new Map();
    const addRole = (player, role) => {
      if (!player) return;
      const prev = byKey.get(player.key) || { player, roles: [] };
      if (!prev.roles.includes(role)) prev.roles.push(role);
      byKey.set(player.key, prev);
    };
    addRole(target, "target");
    addRole(overall, "overall");
    addRole(need, "need");
    const labelFor = (roles) => {
      const has = (r) => roles.includes(r);
      if (has("overall") && has("target") && has("need")) return { label: "Best + target + need", reason: needReason };
      if (has("overall") && has("need")) return { label: "Best + fills need", reason: needReason };
      if (has("target") && has("need")) return { label: "Target + fills need", reason: needReason };
      if (has("overall") && has("target")) return { label: "Best + target", reason: target?.pos ? `Plan ${target.pos}` : null };
      if (has("target")) return { label: "Your target", reason: target?.pos ? `Plan ${target.pos}` : null };
      if (has("need")) return { label: "Fills need", reason: needReason };
      return { label: "Best available", reason: null };
    };
    const roleRank = (roles) => Math.min(...roles.map((r) => ({ target: 0, overall: 1, need: 2 }[r] ?? 9)));
    const rows = [...byKey.values()]
      .sort((a, b) => roleRank(a.roles) - roleRank(b.roles))
      .map((row) => ({ key: row.player.key, player: row.player, isTarget: row.roles.includes("target"), ...labelFor(row.roles) }));
    if (!rows.length) return null;
    return (
      <section className="panel suggest-panel">
        <div className="panel-head">
          <span className="eyebrow">Nominate next</span>
          <span className="panel-side">tap to load the assistant</span>
        </div>
        <div className="suggest-list">
          {rows.map((row) => {
            const bye = row.player.byeConflict || assessByeConflict(players, row.player, SLOT_BY_ID);
            const byeWeek = resolveBye(row.player);
            return (
            <motion.button
              key={row.key}
              type="button"
              className={`suggest-row${row.isTarget ? " is-target" : ""}${bye ? ` has-bye-warn lv-${bye.level}` : ""}`}
              onClick={() => loadSuggestion(row.player)}
              aria-label={`Load ${row.player.name} into assistant${bye ? `. ${bye.message}` : ""}`}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTokens.spring.soft}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            >
              <span className="suggest-label">
                {row.label}
                {row.reason ? <em>{row.reason}</em> : null}
              </span>
              <span className="suggest-player">
                <span className="suggest-name">{row.player.name}</span>
                <span className={`posb p-${row.player.pos}`}>{row.player.pos}</span>
                {row.player.team ? <span className="suggest-meta">{row.player.team}</span> : null}
                {byeWeek ? (
                  <span className={`suggest-bye${bye ? ` lv-${bye.level}` : ""}`} title={bye?.message || `Bye week ${byeWeek}`}>
                    {bye ? bye.chip : `Bye ${byeWeek}`}
                  </span>
                ) : null}
              </span>
              <span className="suggest-est">{row.player.est != null ? money(row.player.est) : "—"}</span>
            </motion.button>
            );
          })}
        </div>
      </section>
    );
  })();

  const needsPanel = (
          <section className="panel needs-panel">
            <div className="panel-head">
              <span className="eyebrow">Position needs</span>
              <span className="panel-side">{superflexOpen > 0 ? `+${superflexOpen} SF` : flexOpen > 0 ? `+${flexOpen} FLEX` : "starters / required"}</span>
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
                  : (superflexOpen > 0 && settings.superflexEligible?.[pos]) || (flexOpen > 0 && settings.flexEligible[pos]) ? "✓ flex-able"
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

  const teamPreviewPanel = (() => {
    const groups = [];
    SLOTS.forEach((s) => {
      const key = s.starter ? s.pos : "BENCH";
      const label = key === "BENCH" ? "Bench" : key;
      let g = groups[groups.length - 1];
      if (!g || g.key !== key) {
        g = { key, label, slots: [] };
        groups.push(g);
      }
      g.slots.push(s);
    });
    return (
      <section className="panel team-preview-panel">
        <div className="panel-head">
          <span className="eyebrow">Team preview</span>
          <span className="panel-side">{drafted}/{ROSTER_SIZE} filled · {openStarters.length ? `${openStarters.length} starters open` : "starters set"}</span>
        </div>
        <div className="team-preview-groups">
          {groups.map((g) => (
            <div key={g.key} className={`team-preview-group${g.key === "BENCH" ? " is-bench" : ""}`}>
              <div className="team-preview-group-label">{g.label}</div>
              <div className="team-preview-grid">
                {g.slots.map((s) => {
                  const p = occupied.get(s.id);
                  const shortLabel = s.starter ? s.label : s.id.replace(/^B/, "BN");
                  return (
                    <div
                      key={s.id}
                      className={`team-preview-slot ${p ? "filled" : "open"}${s.starter ? " starter" : " bench"}`}
                    >
                      <span className="tps-label">
                        <span className="tps-label-full">{s.label}</span>
                        <span className="tps-label-short">{shortLabel}</span>
                      </span>
                      {p ? (
                        <span className="tps-player">
                          <span className={`posb p-${p.pos}`}>{p.pos}</span>
                          <span className="tps-name">{p.name}</span>
                          {p.bye ? (
                            <span
                              className={`tps-bye${byeInfo.weekMeta[p.bye]?.severity === "danger" || byeInfo.weekMeta[p.bye]?.severity === "warn" ? ` ${byeInfo.weekMeta[p.bye].severity}` : byeInfo.weekMeta[p.bye]?.shared ? " shared" : ""}`}
                              title={
                                byeInfo.weekMeta[p.bye]?.severity === "danger" || byeInfo.weekMeta[p.bye]?.severity === "warn"
                                  ? `Week ${p.bye} bye overlap`
                                  : `Bye ${p.bye}`
                              }
                            >
                              B{p.bye}
                            </span>
                          ) : null}
                          <span className="tps-price">{money(p.price)}</span>
                        </span>
                      ) : (
                        <span className="tps-open">{s.starter ? (s.pos === "FLEX" || s.pos === "SUPERFLEX" ? `Needs ${s.accepts.join("/")}` : "Open") : "Open"}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  })();

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
    <section className="panel wide board-panel">
      <div className="panel-head">
        <span className="eyebrow">Available board</span>
        <span className="panel-side">{boardAvailableCount} available · {boardRows.length} shown · {boardShowGone ? "incl. drafted" : "open only"}</span>
      </div>
      <BoardUpdatesBanner />
            <div>
              <div className="board-controls">
                <div className="filter-row">
                  {BOARD_FILTERS.map((f) => (
                    <motion.button
                      key={f}
                      type="button"
                      className={`chip ${boardFilter === f ? "on" : ""}`}
                      aria-pressed={boardFilter === f}
                      onClick={() => setBoardFilter(f)}
                      {...press}
                    >
                      {f === "ALL" ? "All" : f}
                    </motion.button>
                  ))}
                </div>
                <div className="filter-row">
                  <motion.button
                    type="button"
                    className={`chip ${boardStarsOnly ? "on" : ""}`}
                    aria-pressed={boardStarsOnly}
                    onClick={() => setBoardStarsOnly((v) => !v)}
                    {...press}
                  >
                    ★ Starred{boardCounts.star ? ` (${boardCounts.star})` : ""}
                  </motion.button>
                  <motion.button
                    type="button"
                    className={`chip ${boardShowGone ? "on" : ""}`}
                    aria-pressed={boardShowGone}
                    onClick={() => setBoardShowGone((v) => !v)}
                    {...press}
                  >
                    <span className="chip-full">{boardShowGone ? "Showing drafted" : "Hiding drafted"}</span>
                    <span className="chip-short">{boardShowGone ? "Show taken" : "Hide taken"}</span>
                  </motion.button>
                </div>
              </div>
              {boardRows.length === 0 ? (
                <div className="empty-note">No players match these filters. Clear a position chip, or turn off ★ Starred / Hiding drafted to widen the list.</div>
              ) : (
                <div className="table-scroll board-scroll">
                <table className="flat board-table">
                  <thead><tr>
                    <th scope="col" className="col-star" aria-label="Starred"></th>
                    <th scope="col" className="num col-rank" title={isSuperflexLeague(settings) ? "2QB draft rank (by est. auction value)" : "Top-350 overall consensus rank"}>#</th>
                    <th scope="col" className="num col-posrank hide-xs" title="Rank within position">Pos#</th>
                    <th scope="col" className="col-player">Player</th>
                    <th scope="col" className="col-pos">Pos</th>
                    <th scope="col" className="col-health" title="Injury designation — updated via refresh-board">Health</th>
                    <th scope="col" className="col-team hide-xs">Team</th>
                    <th scope="col" className="col-bye hide-xs">Bye</th>
                    <th scope="col" className="num col-est">Est</th>
                    <th scope="col" className="num col-paid hide-tiny">Paid</th>
                    <th scope="col" className="col-status">Status</th>
                  </tr></thead>
                  <tbody>
                    {boardRows.map((r) => (
                      <tr key={r.key} className={`${r.status !== "available" ? "row-taken" : ""}${r.injuryNote ? " row-injured" : ""}`}>
                        <td className="col-star">
                          <motion.button
                            type="button"
                            className={`star-btn ${r.star ? "on" : ""}`}
                            title="Star player"
                            aria-pressed={r.star}
                            aria-label={`Star ${r.name}`}
                            onClick={() => toggleStar(r.name, { pos: r.pos, team: r.team, bye: r.bye })}
                            whileTap={reduceMotion ? undefined : { scale: 0.88 }}
                            transition={motionTokens.spring.tap}
                          >
                            <motion.span
                              key={r.star ? "on" : "off"}
                              className="star-glyph"
                              initial={reduceMotion || !r.star ? false : { scale: 0.55, opacity: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={motionTokens.spring.snappy}
                            >
                              <Ic name="star" solid={r.star} fb={r.star ? "★" : "☆"} />
                            </motion.span>
                          </motion.button>
                        </td>
                        <td className="num rank-cell col-rank">{r.overall ?? "—"}</td>
                        <td className="num rank-cell col-posrank hide-xs">{r.rank < 999 ? r.rank : "—"}</td>
                        <td className="pname col-player">
                          <button className="linklike" onClick={() => loadSuggestion(r)} title="Load into Draft Assistant">{r.name}</button>
                          {r.health && r.health.status && r.health.status !== "active" ? (
                            <span className="pname-health"><HealthBadge health={r.health} /></span>
                          ) : r.injuryNote ? (
                            <span className="pname-health"><InjuryTag note={r.injuryNote} /></span>
                          ) : null}
                        </td>
                        <td className="col-pos"><span className={`posb p-${r.pos}`}>{r.pos}</span></td>
                        <td className="col-health"><HealthBadge health={r.health} /></td>
                        <td className="col-team hide-xs">{r.team || "—"}</td>
                        <td className="col-bye hide-xs">{r.bye || "—"}</td>
                        <td className="num col-est">{r.est != null ? money(r.est) : "—"}</td>
                        <td className={`num col-paid hide-tiny ${r.status === "mine" ? "money" : ""}`}>{r.price != null ? money(r.price) : "—"}</td>
                        <td className="col-status">
                          <div className="seg board-seg">
                            <button className={`seg-btn ${r.status === "available" ? "on" : ""}`} aria-pressed={r.status === "available"} aria-label="Open" onClick={() => setBoardStatus(r, "available")}><span className="seg-full">Open</span><span className="seg-short">O</span></button>
                            <button className={`seg-btn mine ${r.status === "mine" ? "on" : ""}`} aria-pressed={r.status === "mine"} aria-label="Won" onClick={() => setBoardStatus(r, "mine")}><span className="seg-full">Won</span><span className="seg-short">W</span></button>
                            <button className={`seg-btn gone ${r.status === "gone" ? "on" : ""}`} aria-pressed={r.status === "gone"} aria-label="Gone" onClick={() => setBoardStatus(r, "gone")}><span className="seg-full">Gone</span><span className="seg-short">G</span></button>
                          </div>
                          <BoardStatusSelect
                            value={r.status}
                            playerName={r.name}
                            onChange={(next) => {
                              if (next === r.status) return;
                              setBoardStatus(r, next);
                            }}
                          />
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
                          <button className="icon-btn" title="Edit" aria-label={`Edit ${p.name}`} onClick={() => {
                            setEditRow({ ...p, proj: p.proj == null ? "" : String(p.proj) });
                            requestAnimationFrame(() => {
                              document.querySelector("tr.roster-editing")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                            });
                          }}><Ic name="pencil" fb="✎" /></button>
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

  const targetsPanel = (
    <section className="panel wide targets-panel">
      <div className="panel-head">
        <span className="eyebrow">Nomination targets</span>
        <span className="panel-side">
          {targets.length === 0
            ? "Build a nomination list"
            : `${targetsLeftAll} open · ${targets.length} listed`}
        </span>
      </div>
      <div className="board-controls">
        <div className="filter-row">
          {BOARD_FILTERS.map((f) => (
            <motion.button
              key={f}
              type="button"
              className={`chip ${targetFilter === f ? "on" : ""}`}
              aria-pressed={targetFilter === f}
              onClick={() => setTargetFilter(f)}
              {...press}
            >
              {f === "ALL" ? "All" : f}
            </motion.button>
          ))}
        </div>
        <div className="filter-row">
          <motion.button
            type="button"
            className={`chip ${targetSort === "overall" ? "on" : ""}`}
            aria-pressed={targetSort === "overall"}
            onClick={() => setTargetSort("overall")}
            {...press}
          >
            Overall
          </motion.button>
          <motion.button
            type="button"
            className={`chip ${targetSort === "pos" ? "on" : ""}`}
            aria-pressed={targetSort === "pos"}
            onClick={() => setTargetSort("pos")}
            {...press}
          >
            By position
          </motion.button>
        </div>
      </div>
      {targets.length === 0 ? (
        <div className="empty-note">Star a player on the board below (★) — stars and targets stay linked. Open targets surface in Draft Room → Nominate next.</div>
      ) : targetRows.length === 0 ? (
        <div className="empty-note">No targets at {targetFilter}. Switch the position chip to see the rest of the list.</div>
      ) : (
        <div className="table-scroll">
          <table className="flat target-table">
            <thead>
              <tr>
                <th scope="col" className="num col-rank">
                  <button type="button" className={`th-sort${targetSort === "overall" ? " on" : ""}`} onClick={() => setTargetSort("overall")}>#</button>
                </th>
                <th scope="col" className="col-player">Player</th>
                <th scope="col" className="col-pos">
                  <button type="button" className={`th-sort${targetSort === "pos" ? " on" : ""}`} onClick={() => setTargetSort("pos")}>Pos</button>
                </th>
                <th scope="col" className="col-health">Health</th>
                <th scope="col" className="col-team hide-xs">Team</th>
                <th scope="col" className="col-bye hide-xs">Bye</th>
                <th scope="col" className="num col-est">Est</th>
                <th scope="col" className="col-status">Status</th>
                <th scope="col" className="col-actions" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const showGroups = targetSort === "pos" && targetFilter === "ALL";
                const out = [];
                let lastPos = null;
                targetRows.forEach((r) => {
                  if (showGroups && r.pos !== lastPos) {
                    lastPos = r.pos;
                    out.push(
                      <tr key={`g-${r.pos || "x"}`} className="target-group">
                        <td colSpan={9}>{r.pos || "Other"}</td>
                      </tr>
                    );
                  }
                  const statusLabel = r.status === "mine" ? "Won" : r.status === "gone" ? "Gone" : "Open";
                  out.push(
                    <tr key={r.key} className={r.status !== "available" ? "row-taken" : ""}>
                      <td className="num rank-cell col-rank">{r.overall < 9999 ? r.overall : "—"}</td>
                      <td className="pname col-player">
                        <button
                          className="linklike"
                          onClick={() => loadTargetToRoom(r)}
                          title="Load into Draft Assistant"
                        >
                          {r.name}
                        </button>
                        {r.health && r.health.status && r.health.status !== "active" ? (
                            <span className="pname-health"><HealthBadge health={r.health} /></span>
                          ) : r.injuryNote ? (
                            <span className="pname-health"><InjuryTag note={r.injuryNote} /></span>
                          ) : null}
                      </td>
                      <td className="col-pos"><span className={`posb p-${r.pos}`}>{r.pos}</span></td>
                      <td className="col-health"><HealthBadge health={r.health} /></td>
                      <td className="col-team hide-xs">{r.team || "—"}</td>
                      <td className="col-bye hide-xs">{r.bye || "—"}</td>
                      <td className="num col-est">{r.est != null ? money(r.est) : "—"}</td>
                      <td className="col-status">
                        <span className={`target-status st-${r.status}`}>{statusLabel}</span>
                      </td>
                      <td className="actions">
                        <button className="icon-btn danger" title="Remove target" aria-label={`Remove ${r.name}`} onClick={() => removeTarget(r.name)}>
                          <Ic name="cross-small" fb="✕" />
                        </button>
                      </td>
                    </tr>
                  );
                });
                return out;
              })()}
            </tbody>
          </table>
        </div>
      )}

      <div className="targets-board-section">
        <div className="panel-head targets-board-head">
          <span className="eyebrow">Full board</span>
          <span className="panel-side">{boardAvailableCount} available · {boardRows.length} shown</span>
        </div>
        <div className="board-controls">
          <div className="filter-row">
            {BOARD_FILTERS.map((f) => (
              <motion.button
                key={`plan-${f}`}
                type="button"
                className={`chip ${boardFilter === f ? "on" : ""}`}
                aria-pressed={boardFilter === f}
                onClick={() => setBoardFilter(f)}
                {...press}
              >
                {f === "ALL" ? "All" : f}
              </motion.button>
            ))}
          </div>
          <div className="filter-row">
            <motion.button
              type="button"
              className={`chip ${boardStarsOnly ? "on" : ""}`}
              aria-pressed={boardStarsOnly}
              onClick={() => setBoardStarsOnly((v) => !v)}
              {...press}
            >
              ★ Starred{boardCounts.star ? ` (${boardCounts.star})` : ""}
            </motion.button>
            <motion.button
              type="button"
              className={`chip ${boardShowGone ? "on" : ""}`}
              aria-pressed={boardShowGone}
              onClick={() => setBoardShowGone((v) => !v)}
              {...press}
            >
              <span className="chip-full">{boardShowGone ? "Showing drafted" : "Hiding drafted"}</span>
              <span className="chip-short">{boardShowGone ? "Show taken" : "Hide taken"}</span>
            </motion.button>
          </div>
        </div>
        {boardRows.length === 0 ? (
          <div className="empty-note">No players match these filters.</div>
        ) : (
          <div className="table-scroll board-scroll plan-board-scroll">
            <table className="flat board-table plan-board-table">
              <thead>
                <tr>
                  <th scope="col" className="col-target" title="Add to nomination list" aria-label="Target">★</th>
                  <th scope="col" className="num col-rank">#</th>
                  <th scope="col" className="col-player">Player</th>
                  <th scope="col" className="col-pos">Pos</th>
                  <th scope="col" className="col-health">Health</th>
                  <th scope="col" className="col-team hide-xs">Team</th>
                  <th scope="col" className="num col-est">Est</th>
                  <th scope="col" className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {boardRows.map((r) => {
                  const onTargets = targetKeySet.has(r.key);
                  const statusLabel = r.status === "mine" ? "Won" : r.status === "gone" ? "Gone" : "Open";
                  return (
                    <tr key={`plan-${r.key}`} className={`${r.status !== "available" ? "row-taken" : ""}${r.injuryNote ? " row-injured" : ""}`}>
                      <td className="col-target">
                        <motion.button
                          type="button"
                          className={`star-btn target-add-btn${onTargets ? " on" : ""}`}
                          title={onTargets ? "Remove from targets" : "Star & add to targets"}
                          aria-pressed={onTargets}
                          aria-label={onTargets ? `Remove ${r.name} from targets` : `Star ${r.name} and add to targets`}
                          disabled={healthBlocksDraft(r.name) || !!r.injuryNote}
                          onClick={() => toggleTarget(r)}
                          whileTap={reduceMotion ? undefined : { scale: 0.88 }}
                        >
                          <Ic name={onTargets ? "star" : "plus-small"} fb={onTargets ? "★" : "+"} />
                        </motion.button>
                      </td>
                      <td className="num rank-cell col-rank">{r.overall ?? "—"}</td>
                      <td className="pname col-player">
                        <button className="linklike" onClick={() => loadTargetToRoom(r)} title="Load into Draft Assistant">{r.name}</button>
                        {r.health && r.health.status && r.health.status !== "active" ? (
                            <span className="pname-health"><HealthBadge health={r.health} /></span>
                          ) : r.injuryNote ? (
                            <span className="pname-health"><InjuryTag note={r.injuryNote} /></span>
                          ) : null}
                      </td>
                      <td className="col-pos"><span className={`posb p-${r.pos}`}>{r.pos}</span></td>
                      <td className="col-health"><HealthBadge health={r.health} /></td>
                      <td className="col-team hide-xs">{r.team || "—"}</td>
                      <td className="num col-est">{r.est != null ? money(r.est) : "—"}</td>
                      <td className="col-status"><span className={`target-status st-${r.status}`}>{statusLabel}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="target-add">
        <NameAutocomplete
          value={targetName}
          onChange={setTargetName}
          onSelect={addTarget}
          placeholder="Add a target…"
          posFilter={targetFilter === "ALL" ? undefined : targetFilter}
          ariaLabel="Search player to add as a target"
          listId="plan-target-ac-list"
        />
        <button className="btn primary" onClick={addTargetFromInput}>Add target</button>
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
          {["QB", "RB", "WR", "TE", "FLEX", "SUPERFLEX", "K", "DEF"].map((pos) => (
            <div key={pos} className="stepper-row">
              <span className="stepper-label">{pos}</span>
              <div className="stepper">
                <motion.button type="button" className="btn step" onClick={() => setStarter(pos, -1)} aria-label={`Fewer ${pos}`} whileTap={reduceMotion ? undefined : { scale: 0.9 }}>−</motion.button>
                <span className="stepper-val">{settings.starters[pos]}</span>
                <motion.button type="button" className="btn step" onClick={() => setStarter(pos, 1)} aria-label={`More ${pos}`} whileTap={reduceMotion ? undefined : { scale: 0.9 }}>+</motion.button>
              </div>
            </div>
          ))}
          <div className="stepper-row">
            <span className="stepper-label">Bench</span>
            <div className="stepper">
              <motion.button type="button" className="btn step" onClick={() => setSettings((st) => normalizeSettings({ ...st, bench: st.bench - 1 }))} aria-label="Fewer bench" whileTap={reduceMotion ? undefined : { scale: 0.9 }}>−</motion.button>
              <span className="stepper-val">{settings.bench}</span>
              <motion.button type="button" className="btn step" onClick={() => setSettings((st) => normalizeSettings({ ...st, bench: st.bench + 1 }))} aria-label="More bench" whileTap={reduceMotion ? undefined : { scale: 0.9 }}>+</motion.button>
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
              <motion.button type="button" key={pos} className={`chip ${settings.flexEligible[pos] ? "on" : ""}`} aria-pressed={settings.flexEligible[pos]}
                onClick={() => setSettings((st) => ({ ...st, flexEligible: { ...st.flexEligible, [pos]: !st.flexEligible[pos] } }))} {...press}>{pos}</motion.button>
            ))}
          </div>
          <div className="eyebrow small mt">Superflex accepts</div>
          <div className="toggle-row">
            {POSITIONS.map((pos) => (
              <motion.button type="button" key={pos} className={`chip ${settings.superflexEligible?.[pos] ? "on" : ""}`} aria-pressed={settings.superflexEligible?.[pos]}
                onClick={() => setSettings((st) => ({ ...st, superflexEligible: { ...st.superflexEligible, [pos]: !st.superflexEligible[pos] } }))} {...press}>{pos}</motion.button>
            ))}
          </div>
        </div>

        <div className="set-block">
          <div className="eyebrow small">Warn on a second…</div>
          <div className="toggle-row">
            {POSITIONS.map((pos) => (
              <motion.button type="button" key={pos} className={`chip ${settings.onlyOne[pos] ? "on" : ""}`} aria-pressed={settings.onlyOne[pos]}
                onClick={() => setSettings((st) => ({ ...st, onlyOne: { ...st.onlyOne, [pos]: !st.onlyOne[pos] } }))} {...press}>{pos}</motion.button>
            ))}
          </div>
          <div className="empty-note">Highlighted positions trigger a confirm prompt if you draft more than you need — it never blocks the pick.</div>
          <div className="eyebrow small mt">Resulting roster</div>
          <div className="slot-preview">
            {SLOTS.map((sl) => <span key={sl.id} className={`slot-chip ${sl.starter ? "starter" : ""}`}>{sl.label}</span>)}
          </div>
          <button className="btn" onClick={() => setConfirmBox({
            message: "Restore default roster settings?",
            detail: "Back to 12 teams, $200, 1 QB / 2 RB / 2 WR / 1 TE / 1 FLEX / 1 SUPERFLEX / 1 K / 1 DEF and 4 bench (2QB). Your picks stay put.",
            onYes: () => { setSettings(DEFAULT_SETTINGS); setConfirmBox(null); showToast("Settings restored to defaults.", "ok"); },
          })}>Restore defaults</button>
        </div>
      </div>

      {players.length > 0 && (
        <div className="set-warn">Changing the lineup re-slots your {players.length} drafted {players.length === 1 ? "player" : "players"} automatically. Shrinking the roster below what you've drafted can leave players unslotted.</div>
      )}

      <div className="settings-reset">
        <div className="settings-reset-copy">
          <span className="eyebrow small">Test / clear entries</span>
          <p className="empty-note">
            {players.length === 0 && Object.keys(board).length === 0
              ? "No picks or board marks yet."
              : `${players.length} pick${players.length === 1 ? "" : "s"} · ${Object.keys(board).length} board mark${Object.keys(board).length === 1 ? "" : "s"} on this season.`}
          </p>
        </div>
        <motion.button
          type="button"
          className="btn danger"
          onClick={resetDraft}
          disabled={players.length === 0 && Object.keys(board).length === 0}
          {...press}
        >
          <Ic name="refresh" fb="" /> Clear entries
        </motion.button>
      </div>
    </section>
  );

  const syncConfigured = isSupabaseConfigured();
  const lastSyncLabel = syncMeta.lastPushedAt || syncMeta.lastPulledAt
    ? new Date(syncMeta.lastPushedAt || syncMeta.lastPulledAt).toLocaleString()
    : null;

  const dataPanel = (
    <section className="panel wide">
      <div className="panel-head">
        <span className="eyebrow">Cross-device sync</span>
        <span className="panel-side">{syncConfigured ? "Active season only" : "Not configured"}</span>
      </div>
      {!syncConfigured ? (
        <div className="empty-note">
          Sync needs <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> at build time.
          Run <code>supabase/schema.sql</code> in your project, then rebuild.
        </div>
      ) : syncCode ? (
        <>
          <div className="sync-code-row">
            <code className="sync-code">{syncCode}</code>
            <button type="button" className="btn" onClick={copySyncCode} disabled={syncBusy}>Copy</button>
          </div>
          <div className="data-actions">
            <button type="button" className="btn" onClick={pullSyncNow} disabled={syncBusy}>
              <Ic name="upload" fb="" /> Pull now
            </button>
            <button type="button" className="btn danger" onClick={disableSync} disabled={syncBusy}>
              Disable sync
            </button>
          </div>
          {lastSyncLabel ? <div className="empty-note compact">Last cloud contact: {lastSyncLabel}</div> : null}
        </>
      ) : (
        <>
          <div className="empty-note">
            Create a sync code on this device, then enter the same code on your phone or laptop.
            Only the active season syncs (last write wins).
          </div>
          <div className="data-actions">
            <button type="button" className="btn primary" onClick={enableSync} disabled={syncBusy}>
              Enable sync
            </button>
          </div>
          <div className="sync-join">
            <label className="field-label">
              <span>Have a code?</span>
              <input
                className="field"
                value={syncJoinInput}
                onChange={(e) => setSyncJoinInput(e.target.value)}
                placeholder="AWR-XXXX-XXXX-XXXX-XXXX"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                disabled={syncBusy}
              />
            </label>
            <button type="button" className="btn" onClick={joinSync} disabled={syncBusy || !syncJoinInput.trim()}>
              Join
            </button>
          </div>
        </>
      )}
      {syncMsg ? <div className={`sync-msg ${syncMsg.type}`}>{syncMsg.text}</div> : null}

      <div className="panel-head sync-archive-head"><span className="eyebrow">Season archive</span></div>
      <div className="data-actions">
        <button type="button" className="btn" onClick={archiveActiveSeason}>
          <Ic name="download" fb="" /> Download backup
        </button>
        <button type="button" className="btn" onClick={() => fileRef.current && fileRef.current.click()}>
          <Ic name="upload" fb="" /> Restore backup
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files[0]; if (f) importDraft(f); e.target.value = ""; }} />
        <button type="button" className="btn danger" onClick={resetDraft} disabled={players.length === 0 && Object.keys(board).length === 0}>
          <Ic name="refresh" fb="" /> Clear entries
        </button>
      </div>
      <div className="empty-note">
        Starting the next season also downloads a finished-season backup automatically.
        Clear entries only wipes this season&apos;s picks and board marks.
      </div>
    </section>
  );

  return (
    <MotionConfig reducedMotion="user">
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

      <motion.main
        key={view}
        className={`layout view-${view}`}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={viewTransition}
      >
        {view === "room" && (<>
          {assistantPanel}
          <div className="room-stack">
            <div className="room-cue-row">
              {suggestPanel}
              {needsPanel}
            </div>
            <AnimatePresence>
              {byeInfo.level > 0 ? (
                <motion.div
                  key="room-bye-alert"
                  className={`room-bye-alert ${byeToneClass}`}
                  role="status"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={reduceMotion ? { duration: 0.12 } : motionTokens.spring.soft}
                >
                  <span className="room-bye-alert-label">Bye watch</span>
                  <span className="room-bye-alert-msg">{byeInfo.issues[0]}</span>
                  {byeInfo.issues.length > 1 ? (
                    <span className="room-bye-alert-more">+{byeInfo.issues.length - 1} more on My Team</span>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
            {teamPreviewPanel}
            {boardPanel}
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

        {view === "plan" && (<>
          {planPanel}
          {targetsPanel}
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
      </motion.main>

      <footer className="foot">
        {activeSeason ? `${activeSeason.name}. ` : ""}
        Bye weeks preloaded from the official 2026 schedule. Season-ending injuries (Aug 2026) auto-mark OUT on the board. Rosters move in the offseason — double-check team/bye when a suggestion looks stale. Icons: <a className="foot-link" href="https://www.flaticon.com/uicons" target="_blank" rel="noreferrer">Uicons by Flaticon</a>.
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

      <motion.button
        type="button"
        className="theme-toggle"
        onClick={changeTheme}
        aria-pressed={theme === "light"}
        aria-label={theme === "light" ? "Light theme on. Switch to dark" : "Dark theme on. Switch to light"}
        title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        whileHover={reduceMotion ? undefined : { y: -2, scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        transition={motionTokens.spring.tap}
      >
        <motion.span
          key={theme}
          className="theme-toggle-label"
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.fast }}
        >
          {theme === "light" ? "Light" : "Dark"}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.msg + toast.type}
            className={`toast ${toast.type || ""}`}
            role={toast.type === "err" ? "alert" : "status"}
            aria-live={toast.type === "err" ? "assertive" : "polite"}
            aria-atomic="true"
            initial={reduceMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: 16, x: "-50%", scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={reduceMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: 10, x: "-50%", scale: 0.97 }}
            transition={motionTokens.spring.soft}
          >
            {toast.msg}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}

const BOARD_STATUS_OPTIONS = [
  { value: "available", label: "Open" },
  { value: "mine", label: "Won" },
  { value: "gone", label: "Gone" },
];

function BoardStatusSelect({ value, playerName, onChange }) {
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("down");
  const [menuStyle, setMenuStyle] = useState(null);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useMemo(() => `board-status-${norm(playerName).replace(/\s+/g, "-") || "x"}`, [playerName]);
  const current = BOARD_STATUS_OPTIONS.find((o) => o.value === value) || BOARD_STATUS_OPTIONS[0];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const positionMenu = useCallback(() => {
    const trig = triggerRef.current;
    if (!trig) return;
    const r = trig.getBoundingClientRect();
    const menuH = BOARD_STATUS_OPTIONS.length * 36 + 8;
    const gap = 4;
    const spaceBelow = window.innerHeight - r.bottom - gap;
    const spaceAbove = r.top - gap;
    const goUp = spaceBelow < menuH && spaceAbove > spaceBelow;
    const width = Math.max(r.width, 92);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    setPlace(goUp ? "up" : "down");
    setMenuStyle({
      position: "fixed",
      left,
      width,
      zIndex: 140,
      ...(goUp
        ? { top: "auto", bottom: Math.max(8, window.innerHeight - r.top + gap) }
        : { top: r.bottom + gap, bottom: "auto" }),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }
    positionMenu();
  }, [open, positionMenu]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    const onReposition = () => positionMenu();
    const onScrollClose = () => setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReposition);
    document.addEventListener("scroll", onScrollClose, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReposition);
      document.removeEventListener("scroll", onScrollClose, true);
    };
  }, [open, close, positionMenu]);

  const reduce = useReducedMotion();

  return (
    <div className={`board-status-dd status-${value}${open ? " open" : ""}`} ref={wrapRef}>
      <motion.button
        ref={triggerRef}
        type="button"
        className="board-status-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Status for ${playerName}`}
        onClick={() => setOpen((v) => !v)}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={motionTokens.spring.tap}
      >
        <span className="board-status-value">{current.label}</span>
        <motion.span
          className="board-status-caret"
          aria-hidden="true"
          animate={{ rotate: open ? (place === "up" ? 0 : 180) : 0 }}
          transition={{ duration: motionTokens.duration.fast }}
        >
          ▾
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && menuStyle ? (
          <motion.ul
            id={menuId}
            className={`board-status-menu place-${place}`}
            role="listbox"
            aria-label={`Status for ${playerName}`}
            style={{ ...menuStyle, transformOrigin: place === "up" ? "bottom center" : "top center" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: place === "up" ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: place === "up" ? 4 : -4 }}
            transition={reduce ? { duration: 0.12 } : motionTokens.spring.snappy}
          >
            {BOARD_STATUS_OPTIONS.map((o) => (
              <li key={o.value} role="presentation">
                <motion.button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  className={`board-status-option status-${o.value}${o.value === value ? " on" : ""}`}
                  onClick={() => {
                    close();
                    if (o.value !== value) onChange(o.value);
                  }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                >
                  {o.label}
                </motion.button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
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
  const reduce = useReducedMotion();
  const hasBid = bid != null;
  const safeRec = recMax != null ? recMax : 0;
  const safeAbs = absMax != null ? absMax : 0;
  // Scale to the decision range — leftover abs budget must not crush Proj/Rec/Bid into a left pile
  const focusMax = Math.max(V || 0, safeRec, bid || 0, 1);
  const includeAbsOnBar = safeAbs > 0 && safeAbs <= focusMax * 2.25;
  const scale = Math.max(focusMax * 1.5, includeAbsOnBar ? safeAbs : 0, 12);
  const pct = (x) => Math.min(100, Math.max(0, ((x != null ? x : 0) / scale) * 100));
  const greatEnd = V != null ? V * 0.82 : safeRec > 0 ? safeRec * 0.6 : scale * 0.35;
  const fairEnd = V != null ? Math.max(V, safeRec * 0.8) : safeRec > 0 ? safeRec * 0.85 : scale * 0.65;
  const recEnd = safeRec > 0 ? safeRec : scale * 0.85;

  const projPct = V != null ? pct(V) : null;
  const recPct = safeRec > 0 ? pct(safeRec) : null;
  const absPct = safeAbs > 0 ? pct(safeAbs) : null;
  const bidPct = hasBid ? pct(bid) : null;

  return (
    <div className={`meter-wrap${hasBid ? " has-bid" : ""}`}>
      <div className="meter" role="img" aria-label={`Value meter. Recommended max ${money(recMax)}${V != null ? `, projection ${money(V)}` : ""}, absolute max ${money(absMax)}${hasBid ? `, current bid ${money(bid)}` : ""}.`}>
        <div className="zone great" style={{ width: `${pct(greatEnd)}%` }} />
        <div className="zone fair" style={{ width: `${Math.max(0, pct(fairEnd) - pct(greatEnd))}%` }} />
        <div className="zone caution" style={{ width: `${Math.max(0, pct(recEnd) - pct(fairEnd))}%` }} />
        <div className="zone over" style={{ width: `${Math.max(0, 100 - pct(recEnd))}%` }} />
        {projPct != null && <div className={`marker m-proj ${meterEdge(projPct)}`} style={{ left: `${projPct}%` }} title={`Proj ${money(V)}`} />}
        {recPct != null && <div className={`marker m-rec ${meterEdge(recPct)}`} style={{ left: `${recPct}%` }} title={`Rec ${money(recMax)}`} />}
        {includeAbsOnBar && absPct != null && <div className={`marker m-abs ${meterEdge(absPct)}`} style={{ left: `${absPct}%` }} title={`Abs ${money(absMax)}`} />}
        <AnimatePresence>
          {hasBid ? (
            <motion.div
              key="bid-marker"
              className={`bid-marker t-${tier} ${meterEdge(bidPct)}`}
              title={`Bid ${money(bid)}`}
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{
                opacity: 1,
                y: 0,
                left: `${bidPct}%`,
                x: bidPct <= 2 ? "0%" : bidPct >= 98 ? "-100%" : "-50%",
              }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -2 }}
              transition={reduce ? { duration: 0.12 } : motionTokens.spring.snappy}
            >
              <div className="bid-tri" />
            </motion.div>
          ) : null}
        </AnimatePresence>
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
