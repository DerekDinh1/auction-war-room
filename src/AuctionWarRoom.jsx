import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
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
const THEME_KEY = "awr-theme";
function readStoredTheme() {
  try {
    const v = typeof localStorage !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
    if (v === "light" || v === "dark") return v;
  } catch { /* ignore */ }
  return "dark";
}

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
const NEED_POS_PRIORITY = ["RB", "WR", "TE", "QB", "K", "DEF"];

// Built-in player list — Top 300 overall (FantasyPros multi-format avg)
// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings
// Generated 2026-07-26T21:33:20.764Z · 300 players · ordered by overall consensus rank
const RAW_DB = [
  ["Ja'Marr Chase","WR","CIN"], // 1 · avg 2.36
  ["Bijan Robinson","RB","ATL"], // 2 · avg 2.41
  ["Jahmyr Gibbs","RB","DET"], // 3 · avg 2.65
  ["Puka Nacua","WR","LAR"], // 4 · avg 3.83
  ["Jaxon Smith-Njigba","WR","SEA"], // 5 · avg 5.11
  ["Amon-Ra St. Brown","WR","DET"], // 6 · avg 6.85
  ["Christian McCaffrey","RB","SF"], // 7 · avg 8.35
  ["CeeDee Lamb","WR","DAL"], // 8 · avg 9.51
  ["Jonathan Taylor","RB","IND"], // 9 · avg 9.89
  ["Justin Jefferson","WR","MIN"], // 10 · avg 10.11
  ["James Cook III","RB","BUF"], // 11 · avg 13.76
  ["Drake London","WR","ATL"], // 12 · avg 14.48
  ["A.J. Brown","WR","NE"], // 13 · avg 15.99
  ["Nico Collins","WR","HOU"], // 14 · avg 16.21
  ["Ashton Jeanty","RB","LV"], // 15 · avg 16.28
  ["Brock Bowers","TE","LV"], // 16 · avg 18.49
  ["George Pickens","WR","DAL"], // 17 · avg 19.75
  ["Saquon Barkley","RB","PHI"], // 18 · avg 20.74
  ["De'Von Achane","RB","MIA"], // 19 · avg 20.89
  ["Chase Brown","RB","CIN"], // 20 · avg 21.36
  ["Trey McBride","TE","ARI"], // 21 · avg 22.14
  ["Omarion Hampton","RB","LAC"], // 22 · avg 22.66
  ["Rashee Rice","WR","KC"], // 23 · avg 25.03
  ["Chris Olave","WR","NO"], // 24 · avg 25.65
  ["Josh Allen","QB","BUF"], // 25 · avg 25.98
  ["Derrick Henry","RB","BAL"], // 26 · avg 26.20
  ["Kenneth Walker III","RB","KC"], // 27 · avg 27.44
  ["DeVonta Smith","WR","PHI"], // 28 · avg 29.55
  ["Tee Higgins","WR","CIN"], // 29 · avg 32.58
  ["Zay Flowers","WR","BAL"], // 30 · avg 32.78
  ["Tetairoa McMillan","WR","CAR"], // 31 · avg 33.16
  ["Lamar Jackson","QB","BAL"], // 32 · avg 33.49
  ["Drake Maye","QB","NE"], // 33 · avg 35.70
  ["Kyren Williams","RB","LAR"], // 34 · avg 37.13
  ["Jeremiyah Love","RB","ARI"], // 35 · avg 38.20
  ["Emeka Egbuka","WR","TB"], // 36 · avg 38.69
  ["Josh Jacobs","RB","GB"], // 37 · avg 38.88
  ["Garrett Wilson","WR","NYJ"], // 38 · avg 39.60
  ["Colston Loveland","TE","CHI"], // 39 · avg 40.28
  ["Ladd McConkey","WR","LAC"], // 40 · avg 40.36
  ["Breece Hall","RB","NYJ"], // 41 · avg 40.47
  ["Malik Nabers","WR","NYG"], // 42 · avg 41.91
  ["Jaylen Waddle","WR","DEN"], // 43 · avg 42.48
  ["Javonte Williams","RB","DAL"], // 44 · avg 42.88
  ["Joe Burrow","QB","CIN"], // 45 · avg 43.40
  ["Terry McLaurin","WR","WAS"], // 46 · avg 44.06
  ["Davante Adams","WR","LAR"], // 47 · avg 46.96
  ["Travis Etienne Jr.","RB","NO"], // 48 · avg 47.55
  ["Luther Burden III","WR","CHI"], // 49 · avg 49.43
  ["Jameson Williams","WR","DET"], // 50 · avg 50.58
  ["Cam Skattebo","RB","NYG"], // 51 · avg 52.92
  ["Jayden Daniels","QB","WAS"], // 52 · avg 53.49
  ["Mike Evans","WR","SF"], // 53 · avg 53.63
  ["Christian Watson","WR","GB"], // 54 · avg 55.26
  ["Bucky Irving","RB","TB"], // 55 · avg 56.19
  ["Jalen Hurts","QB","PHI"], // 56 · avg 56.86
  ["Quinshon Judkins","RB","CLE"], // 57 · avg 57.02
  ["DJ Moore","WR","BUF"], // 58 · avg 57.63
  ["Tyler Warren","TE","IND"], // 59 · avg 57.74
  ["D'Andre Swift","RB","CHI"], // 60 · avg 58.40
  ["TreVeyon Henderson","RB","NE"], // 61 · avg 58.48
  ["Rome Odunze","WR","CHI"], // 62 · avg 59.52
  ["David Montgomery","RB","HOU"], // 63 · avg 60.30
  ["Tucker Kraft","TE","GB"], // 64 · avg 66.69
  ["Bhayshul Tuten","RB","JAX"], // 65 · avg 67.45
  ["Caleb Williams","QB","CHI"], // 66 · avg 67.85
  ["Justin Herbert","QB","LAC"], // 67 · avg 70.06
  ["Jadarian Price","RB","SEA"], // 68 · avg 70.88
  ["Marvin Harrison Jr.","WR","ARI"], // 69 · avg 70.99
  ["Carnell Tate","WR","TEN"], // 70 · avg 72.07
  ["Jaylen Warren","RB","PIT"], // 71 · avg 74.29
  ["Trevor Lawrence","QB","JAX"], // 72 · avg 76.76
  ["Alec Pierce","WR","IND"], // 73 · avg 76.84
  ["DK Metcalf","WR","PIT"], // 74 · avg 77.60
  ["Brian Thomas Jr.","WR","JAX"], // 75 · avg 77.94
  ["Tony Pollard","RB","TEN"], // 76 · avg 78.40
  ["Dak Prescott","QB","DAL"], // 77 · avg 79.51
  ["Courtland Sutton","WR","DEN"], // 78 · avg 80.42
  ["Harold Fannin Jr.","TE","CLE"], // 79 · avg 80.96
  ["Rhamondre Stevenson","RB","NE"], // 80 · avg 81.12
  ["Chuba Hubbard","RB","CAR"], // 81 · avg 81.68
  ["Kyle Pitts Sr.","TE","ATL"], // 82 · avg 82.99
  ["Sam LaPorta","TE","DET"], // 83 · avg 84.06
  ["Rico Dowdle","RB","PIT"], // 84 · avg 84.45
  ["Chris Godwin Jr.","WR","TB"], // 85 · avg 87.43
  ["Parker Washington","WR","JAX"], // 86 · avg 88.06
  ["Jordyn Tyson","WR","NO"], // 87 · avg 90.14
  ["Jaxson Dart","QB","NYG"], // 88 · avg 91.49
  ["RJ Harvey","RB","DEN"], // 89 · avg 92.41
  ["Brock Purdy","QB","SF"], // 90 · avg 94.29
  ["Kyle Monangai","RB","CHI"], // 91 · avg 94.85
  ["J.K. Dobbins","RB","DEN"], // 92 · avg 96.22
  ["Michael Wilson","WR","ARI"], // 93 · avg 96.49
  ["Quentin Johnston","WR","LAC"], // 94 · avg 97.14
  ["Michael Pittman Jr.","WR","PIT"], // 95 · avg 97.76
  ["Blake Corum","RB","LAR"], // 96 · avg 98.20
  ["Makai Lemon","WR","PHI"], // 97 · avg 99.56
  ["Patrick Mahomes II","QB","KC"], // 98 · avg 100.27
  ["Bo Nix","QB","DEN"], // 99 · avg 100.75
  ["George Kittle","TE","SF"], // 100 · avg 101.15
  ["Ricky Pearsall","WR","SF"], // 101 · avg 101.35
  ["Jakobi Meyers","WR","JAX"], // 102 · avg 102.73
  ["Jordan Addison","WR","MIN"], // 103 · avg 103.26
  ["Matthew Stafford","QB","LAR"], // 104 · avg 103.80
  ["Travis Kelce","TE","KC"], // 105 · avg 105.19
  ["Wan'Dale Robinson","WR","TEN"], // 106 · avg 106.13
  ["Kenny Gainwell","RB","TB"], // 107 · avg 106.59
  ["Rachaad White","RB","WAS"], // 108 · avg 108.55
  ["Josh Downs","WR","IND"], // 109 · avg 108.83
  ["Jared Goff","QB","DET"], // 110 · avg 109.74
  ["Aaron Jones Sr.","RB","MIN"], // 111 · avg 110.36
  ["Jayden Reed","WR","GB"], // 112 · avg 110.53
  ["Dalton Kincaid","TE","BUF"], // 113 · avg 111.60
  ["Kyler Murray","QB","MIN"], // 114 · avg 114.03
  ["Jacory Croskey-Merritt","RB","WAS"], // 115 · avg 114.80
  ["Jonathon Brooks","RB","CAR"], // 116 · avg 117.06
  ["Jake Ferguson","TE","DAL"], // 117 · avg 117.23
  ["Jordan Mason","RB","MIN"], // 118 · avg 118.03
  ["Isaiah Likely","TE","NYG"], // 119 · avg 118.39
  ["Xavier Worthy","WR","KC"], // 120 · avg 119.66
  ["Dallas Goedert","TE","PHI"], // 121 · avg 120.13
  ["Jordan Love","QB","GB"], // 122 · avg 120.53
  ["Baker Mayfield","QB","TB"], // 123 · avg 121.15
  ["Tyler Shough","QB","NO"], // 124 · avg 124.37
  ["Mark Andrews","TE","BAL"], // 125 · avg 125.48
  ["Jayden Higgins","WR","HOU"], // 126 · avg 125.49
  ["Khalil Shakir","WR","BUF"], // 127 · avg 129.62
  ["Tyrone Tracy Jr.","RB","NYG"], // 128 · avg 130.74
  ["Romeo Doubs","WR","NE"], // 129 · avg 132.11
  ["Chris Rodriguez Jr.","RB","JAX"], // 130 · avg 133.54
  ["Woody Marks","RB","HOU"], // 131 · avg 134.80
  ["Tyler Allgeier","RB","ARI"], // 132 · avg 136.69
  ["Jalen Coker","WR","CAR"], // 133 · avg 137.86
  ["KC Concepcion","WR","CLE"], // 134 · avg 138.11
  ["Matthew Golden","WR","GB"], // 135 · avg 138.51
  ["Malik Willis","QB","MIA"], // 136 · avg 138.53
  ["Zach Charbonnet","RB","SEA"], // 137 · avg 139.89
  ["C.J. Stroud","QB","HOU"], // 138 · avg 142.66
  ["Isiah Pacheco","RB","DET"], // 139 · avg 143.66
  ["Sam Darnold","QB","SEA"], // 140 · avg 146.15
  ["Rashid Shaheed","WR","SEA"], // 141 · avg 148.06
  ["Tyjae Spears","RB","TEN"], // 142 · avg 148.23
  ["Dylan Sampson","RB","CLE"], // 143 · avg 149.91
  ["Brenton Strange","TE","JAX"], // 144 · avg 150.53
  ["Juwan Johnson","TE","NO"], // 145 · avg 151.26
  ["Alvin Kamara","RB","NO"], // 146 · avg 151.58
  ["Keaton Mitchell","RB","LAC"], // 147 · avg 154.74
  ["Jauan Jennings","WR","MIN"], // 148 · avg 156.63
  ["Hunter Henry","TE","NE"], // 149 · avg 156.79
  ["Cam Ward","QB","TEN"], // 150 · avg 158.16
  ["Oronde Gadsden II","TE","LAC"], // 151 · avg 158.35
  ["Chig Okonkwo","TE","WAS"], // 152 · avg 158.72
  ["Jonah Coleman","RB","DEN"], // 153 · avg 159.06
  ["Brian Robinson Jr.","RB","ATL"], // 154 · avg 160.25
  ["Tank Bigsby","RB","PHI"], // 155 · avg 161.23
  ["Jerry Jeudy","WR","CLE"], // 156 · avg 162.16
  ["Denzel Boston","WR","CLE"], // 157 · avg 162.84
  ["Stefon Diggs","WR","FA"], // 158 · avg 162.89
  ["Omar Cooper Jr.","WR","NYJ"], // 159 · avg 164.41
  ["Braelon Allen","RB","NYJ"], // 160 · avg 166.06
  ["Jalen McMillan","WR","TB"], // 161 · avg 168.46
  ["Daniel Jones","QB","IND"], // 162 · avg 169.20
  ["Bryce Young","QB","CAR"], // 163 · avg 169.62
  ["Adonai Mitchell","WR","NYJ"], // 164 · avg 171.29
  ["Travis Hunter","WR","JAX"], // 165 · avg 172.07
  ["Tre Tucker","WR","LV"], // 166 · avg 179.02
  ["Tre' Harris","WR","LAC"], // 167 · avg 183.89
  ["Brandon Aubrey","K","DAL"], // 168 · avg 186.50
  ["Dalton Schultz","TE","HOU"], // 169 · avg 189.14
  ["Emanuel Wilson","RB","SEA"], // 170 · avg 189.75
  ["Kayshon Boutte","WR","NE"], // 171 · avg 190.81
  ["James Conner","RB","ARI"], // 172 · avg 191.55
  ["Emmett Johnson","RB","KC"], // 173 · avg 191.71
  ["Ka'imi Fairbairn","K","HOU"], // 174 · avg 192.02
  ["Ryan Flournoy","WR","DAL"], // 175 · avg 192.15
  ["Antonio Williams","WR","WAS"], // 176 · avg 192.63
  ["Mike Washington Jr.","RB","LV"], // 177 · avg 192.90
  ["Deebo Samuel Sr.","WR","FA"], // 178 · avg 193.28
  ["Kimani Vidal","RB","LAC"], // 179 · avg 194.70
  ["Cameron Dicker","K","LAC"], // 180 · avg 195.03
  ["Ray Davis","RB","BUF"], // 181 · avg 197.10
  ["Troy Franklin","WR","DEN"], // 182 · avg 197.24
  ["Sean Tucker","RB","TB"], // 183 · avg 198.79
  ["Isaac TeSlaa","WR","DET"], // 184 · avg 198.80
  ["Cam Little","K","JAX"], // 185 · avg 199.10
  ["AJ Barner","TE","SEA"], // 186 · avg 200.13
  ["Calvin Ridley","WR","TEN"], // 187 · avg 200.66
  ["Jason Myers","K","SEA"], // 188 · avg 200.93
  ["Jaylin Noel","WR","HOU"], // 189 · avg 201.08
  ["T.J. Hockenson","TE","MIN"], // 190 · avg 201.95
  ["Kenyon Sadiq","TE","NYJ"], // 191 · avg 202.01
  ["Jalen Nailor","WR","LV"], // 192 · avg 202.85
  ["Nicholas Singleton","RB","TEN"], // 193 · avg 204.18
  ["Kaytron Allen","RB","WAS"], // 194 · avg 207.73
  ["Darnell Mooney","WR","NYG"], // 195 · avg 208.22
  ["Jacoby Brissett","QB","ARI"], // 196 · avg 209.17
  ["Eddy Pineiro","K","SF"], // 197 · avg 210.21
  ["Tyler Loop","K","BAL"], // 198 · avg 210.24
  ["Greg Dulcich","TE","MIA"], // 199 · avg 210.94
  ["Evan McPherson","K","CIN"], // 200 · avg 215.31
  ["Brandon Aiyuk","WR","SF"], // 201 · avg 216.16
  ["Dontayvion Wicks","WR","PHI"], // 202 · avg 217.18
  ["Pat Bryant","WR","DEN"], // 203 · avg 217.45
  ["Cairo Santos","K","CHI"], // 204 · avg 217.78
  ["Andy Borregales","K","NE"], // 205 · avg 220.26
  ["Jaylen Wright","RB","MIA"], // 206 · avg 220.98
  ["Gunnar Helm","TE","TEN"], // 207 · avg 222.79
  ["Malik Washington","WR","MIA"], // 208 · avg 223.62
  ["Rashod Bateman","WR","BAL"], // 209 · avg 224.74
  ["Tank Dell","WR","HOU"], // 210 · avg 225.78
  ["Chimere Dike","WR","TEN"], // 211 · avg 225.89
  ["Chase McLaughlin","K","TB"], // 212 · avg 226.96
  ["MarShawn Lloyd","RB","GB"], // 213 · avg 227.96
  ["Jake Bates","K","DET"], // 214 · avg 228.73
  ["Tyreek Hill","WR","FA"], // 215 · avg 229.27
  ["Terrance Ferguson","TE","LAR"], // 216 · avg 231.35
  ["De'Zhaun Stribling","WR","SF"], // 217 · avg 232.26
  ["Germie Bernard","WR","PIT"], // 218 · avg 232.37
  ["Ollie Gordon II","RB","MIA"], // 219 · avg 232.93
  ["Nick Folk","K","ATL"], // 220 · avg 234.53
  ["Harrison Mevis","K","LAR"], // 221 · avg 234.66
  ["Cooper Kupp","WR","SEA"], // 222 · avg 235.48
  ["Aaron Rodgers","QB","PIT"], // 223 · avg 235.55
  ["Pat Freiermuth","TE","PIT"], // 224 · avg 237.52
  ["Elic Ayomanor","WR","TEN"], // 225 · avg 238.01
  ["Brandon McManus","K","FA"], // 226 · avg 238.59
  ["Zachariah Branch","WR","ATL"], // 227 · avg 238.63
  ["Blake Grupe","K","IND"], // 228 · avg 239.29
  ["Justice Hill","RB","BAL"], // 229 · avg 240.43
  ["Daniel Carlson","K","LV"], // 230 · avg 241.84
  ["Demond Claiborne","RB","MIN"], // 231 · avg 242.10
  ["Jaydon Blue","RB","DAL"], // 232 · avg 242.71
  ["David Njoku","TE","LAC"], // 233 · avg 242.88
  ["Ryan Fitzgerald","K","CAR"], // 234 · avg 244.13
  ["Geno Smith","QB","NYJ"], // 235 · avg 244.17
  ["Cade Otton","TE","TB"], // 236 · avg 244.57
  ["Harrison Butker","K","KC"], // 237 · avg 245.16
  ["Chris Bell","WR","MIA"], // 238 · avg 245.46
  ["Chris Boswell","K","PIT"], // 239 · avg 245.70
  ["Keon Coleman","WR","BUF"], // 240 · avg 247.43
  ["Jake Moody","K","WAS"], // 241 · avg 248.00
  ["Elijah Sarratt","WR","BAL"], // 242 · avg 249.88
  ["Trey Smack","K","GB"], // 243 · avg 249.93
  ["Devin Neal","RB","NO"], // 244 · avg 250.08
  ["Ben Sauls","K","NYG"], // 245 · avg 252.42
  ["Ty Johnson","RB","BUF"], // 246 · avg 252.74
  ["Colby Parkinson","TE","LAR"], // 247 · avg 252.84
  ["Jack Bech","WR","LV"], // 248 · avg 252.98
  ["Ted Hurst III","WR","TB"], // 249 · avg 254.00
  ["Kaleb Johnson","RB","PIT"], // 250 · avg 254.72
  ["Chris Brooks","RB","GB"], // 251 · avg 255.01
  ["Christian Kirk","WR","SF"], // 252 · avg 255.68
  ["Jordan James","RB","SF"], // 253 · avg 256.25
  ["Isaiah Davis","RB","NYJ"], // 254 · avg 257.04
  ["DJ Giddens","RB","IND"], // 255 · avg 257.50
  ["Malachi Fields","WR","NYG"], // 256 · avg 257.56
  ["Spencer Shrader","K","IND"], // 257 · avg 257.61
  ["Evan Engram","TE","DEN"], // 258 · avg 257.84
  ["Fernando Mendoza","QB","LV"], // 259 · avg 258.25
  ["Malik Davis","RB","DAL"], // 260 · avg 258.65
  ["Tory Horton","WR","SEA"], // 261 · avg 259.45
  ["Marvin Mims Jr.","WR","DEN"], // 262 · avg 259.72
  ["George Holani","RB","SEA"], // 263 · avg 259.84
  ["Tyler Bass","K","BUF"], // 264 · avg 260.14
  ["Will Reichard","K","MIN"], // 265 · avg 260.42
  ["Trey Benson","RB","ARI"], // 266 · avg 261.27
  ["Mike Gesicki","TE","CIN"], // 267 · avg 261.55
  ["Eli Stowers","TE","PHI"], // 268 · avg 262.69
  ["Chris Brazzell II","WR","CAR"], // 269 · avg 262.89
  ["Tyquan Thornton","WR","KC"], // 270 · avg 263.43
  ["Samaje Perine","RB","CIN"], // 271 · avg 264.05
  ["Darius Slayton","WR","NYG"], // 272 · avg 264.83
  ["Kaelon Black","RB","SF"], // 273 · avg 265.63
  ["Kyle Williams","WR","NE"], // 274 · avg 265.77
  ["Theo Johnson","TE","NYG"], // 275 · avg 266.26
  ["Andrei Iosivas","WR","CIN"], // 276 · avg 266.53
  ["Xavier Legette","WR","CAR"], // 277 · avg 267.90
  ["Kendre Miller","RB","NO"], // 278 · avg 268.12
  ["Najee Harris","RB","LAC"], // 279 · avg 269.20
  ["Wil Lutz","K","DEN"], // 280 · avg 269.79
  ["Mason Taylor","TE","NYJ"], // 281 · avg 270.38
  ["Keenan Allen","WR","LAC"], // 282 · avg 271.64
  ["Tua Tagovailoa","QB","ATL"], // 283 · avg 275.30
  ["Devaughn Vele","WR","NO"], // 284 · avg 275.33
  ["Mack Hollins","WR","NE"], // 285 · avg 275.53
  ["Seth McGowan","RB","IND"], // 286 · avg 275.78
  ["Joey Slye","K","TEN"], // 287 · avg 275.93
  ["LeQuint Allen Jr.","RB","JAX"], // 288 · avg 276.35
  ["Jerome Ford","RB","WAS"], // 289 · avg 279.05
  ["Brashard Smith","RB","KC"], // 290 · avg 280.17
  ["Ja'Kobi Lane","WR","BAL"], // 291 · avg 280.38
  ["Skyler Bell","WR","BUF"], // 292 · avg 280.82
  ["Adam Randall","RB","BAL"], // 293 · avg 281.15
  ["Charlie Smyth","K","NO"], // 294 · avg 281.43
  ["Jake Elliott","K","PHI"], // 295 · avg 281.84
  ["Emari Demercado","RB","KC"], // 296 · avg 282.81
  ["Michael Penix Jr.","QB","ATL"], // 297 · avg 283.18
  ["Devin Singletary","RB","NYG"], // 298 · avg 283.39
  ["Jake Tonges","TE","SF"], // 299 · avg 283.47
  ["Hollywood Brown","WR","PHI"], // 300 · avg 283.70
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
const OVERALL_RANK = {};
RAW_DB.forEach(([name], i) => { OVERALL_RANK[norm(name)] = i + 1; }); // 1–300 consensus board order
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
  const [theme, setTheme] = useState(readStoredTheme);
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
    setEditRow(null);
    setView(d.view === "board" ? "room" : (d.view || "room"));
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
    const byeConflict = assessByeConflict(
      players,
      { name: assistant.name, pos, team: assistant.team, bye: assistant.bye },
      SLOT_BY_ID,
    );

    // need weighting
    let mult;
    if (dup) mult = 0.45;
    else if (fillsDedicated) mult = 1.15;
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
  }, [assistant, players, posCounts, openStarters, maxBid, spotsLeft, budgetHealth, SLOT_BY_ID]);

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
      return {
        ...p, key: k, status, price, star: !!b.star,
        est: adjEst(p.pos, p.name), tier: tierOf(p.name),
        rank: POS_RANK[norm(p.name)] || 999,
        overall: OVERALL_RANK[norm(p.name)] || null,
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
    return boardShowGone ? sorted : sorted.slice(0, 120);
  }, [board, players, boardFilter, boardShowGone, boardStarsOnly, adjEst]);

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
    if (spotsLeft <= 0) return { overall: null, need: null, needReason: null };

    const draftedNames = new Set(players.map((p) => norm(p.name)));
    const pool = [];
    PLAYER_DB.forEach((p) => {
      if (draftedNames.has(norm(p.name))) return;
      const k = boardKey(p.name);
      const b = board[k];
      if (b?.status === "gone" || b?.status === "mine") return;
      pool.push({
        ...p,
        key: k,
        star: !!b?.star,
        est: adjEst(p.pos, p.name),
        rank: POS_RANK[norm(p.name)] || 999,
        overall: OVERALL_RANK[norm(p.name)] || 9999,
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

    // Best = highest on the top-300 overall board (not auction $)
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
    } else if (flexOpen > 0) {
      need = pool.filter((p) => settings.flexEligible[p.pos]).sort(rankPick)[0] || null;
      needReason = need ? `FLEX ${need.pos}` : null;
    }

    return { overall, need, needReason };
  }, [spotsLeft, players, board, adjEst, posNeed, posCounts, flexOpen, settings.flexEligible, SLOT_BY_ID]);

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
                          {alternatives.map((p) => {
                            const altBye = assessByeConflict(players, p, SLOT_BY_ID);
                            return (
                            <tr key={p.id} className={altBye ? `bye-row-hit lv-${altBye.level}` : ""}>
                              <td className="alt-tier">T{p.tier}</td>
                              <td className="alt-name">
                                <button type="button" className="linklike" onClick={() => pickAssistantPlayer(p)} aria-label={`Load ${p.name} into assistant`}>
                                  {p.name}
                                </button>
                              </td>
                              <td className="alt-team">{p.team || "—"}</td>
                              <td className={`alt-bye${altBye ? ` hit lv-${altBye.level}` : ""}`} title={altBye?.message || undefined}>
                                {p.bye ?? "—"}
                                {altBye ? <span className="bye-dot" aria-hidden="true" /> : null}
                              </td>
                              <td className="alt-est num">{p.est != null ? money(p.est) : "—"}</td>
                              <td>
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

  const suggestPanel = (() => {
    const { overall, need, needReason } = nominateSuggestions;
    if (!overall && !need) return null;
    const same = overall && need && overall.key === need.key;
    const rows = same
      ? [{ key: "both", player: overall, label: "Best + fills need", reason: needReason }]
      : [
          overall && { key: "overall", player: overall, label: "Best available", reason: null },
          need && { key: "need", player: need, label: "Fills need", reason: needReason },
        ].filter(Boolean);
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
            <button
              key={row.key}
              type="button"
              className={`suggest-row${bye ? ` has-bye-warn lv-${bye.level}` : ""}`}
              onClick={() => loadSuggestion(row.player)}
              aria-label={`Load ${row.player.name} into assistant${bye ? `. ${bye.message}` : ""}`}
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
            </button>
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
                        <span className="tps-open">{s.starter ? (s.pos === "FLEX" ? `Needs ${s.accepts.join("/")}` : "Open") : "Open"}</span>
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
        <span className="panel-side">{boardAvailableCount} left · {boardShowGone ? "showing drafted" : "hiding drafted"}</span>
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
                  <button className={`chip ${boardShowGone ? "on" : ""}`} aria-pressed={boardShowGone} onClick={() => setBoardShowGone((v) => !v)}>
                    <span className="chip-full">{boardShowGone ? "Showing drafted" : "Hiding drafted"}</span>
                    <span className="chip-short">{boardShowGone ? "Show taken" : "Hide taken"}</span>
                  </button>
                </div>
              </div>
              {boardRows.length === 0 ? (
                <div className="empty-note">No players match these filters. Clear a position chip, or turn off ★ Starred / Hiding drafted to widen the list.</div>
              ) : (
                <div className="table-scroll board-scroll">
                <table className="flat board-table">
                  <thead><tr>
                    <th className="col-star"></th>
                    <th className="num col-rank" title="Top-300 overall consensus rank">#</th>
                    <th className="num col-posrank hide-xs" title="Rank within position">Pos#</th>
                    <th className="col-player">Player</th>
                    <th className="col-pos">Pos</th>
                    <th className="hide-xs">Team</th>
                    <th className="hide-xs">Bye</th>
                    <th className="num col-est">Est</th>
                    <th className="num hide-tiny">Paid</th>
                    <th className="col-status">Status</th>
                  </tr></thead>
                  <tbody>
                    {boardRows.map((r) => (
                      <tr key={r.key} className={r.status !== "available" ? "row-taken" : ""}>
                        <td className="col-star"><button className={`star-btn ${r.star ? "on" : ""}`} title="Star player" aria-pressed={r.star} aria-label={`Star ${r.name}`}
                          onClick={() => toggleStar(r.name, { pos: r.pos, team: r.team, bye: r.bye })}><Ic name="star" solid={r.star} fb={r.star ? "★" : "☆"} /></button></td>
                        <td className="num rank-cell col-rank">{r.overall ?? "—"}</td>
                        <td className="num rank-cell col-posrank hide-xs">{r.rank < 999 ? r.rank : "—"}</td>
                        <td className="pname col-player"><button className="linklike" onClick={() => loadSuggestion(r)} title="Load into Draft Assistant">{r.name}</button></td>
                        <td className="col-pos"><span className={`posb p-${r.pos}`}>{r.pos}</span></td>
                        <td className="hide-xs">{r.team || "—"}</td>
                        <td className="hide-xs">{r.bye || "—"}</td>
                        <td className="num col-est">{r.est != null ? money(r.est) : "—"}</td>
                        <td className={`num hide-tiny ${r.status === "mine" ? "money" : ""}`}>{r.price != null ? money(r.price) : "—"}</td>
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
            <div className="room-cue-row">
              {suggestPanel}
              {needsPanel}
            </div>
            {byeInfo.level > 0 ? (
              <div className={`room-bye-alert ${byeToneClass}`} role="status">
                <span className="room-bye-alert-label">Bye watch</span>
                <span className="room-bye-alert-msg">{byeInfo.issues[0]}</span>
                {byeInfo.issues.length > 1 ? (
                  <span className="room-bye-alert-more">+{byeInfo.issues.length - 1} more on My Team</span>
                ) : null}
              </div>
            ) : null}
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

      <button
        type="button"
        className="theme-toggle"
        onClick={changeTheme}
        aria-pressed={theme === "light"}
        aria-label={theme === "light" ? "Light theme on. Switch to dark" : "Dark theme on. Switch to light"}
        title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      >
        <span className="theme-toggle-label">{theme === "light" ? "Light" : "Dark"}</span>
      </button>

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

  return (
    <div className={`board-status-dd status-${value}${open ? " open" : ""}`} ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className="board-status-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Status for ${playerName}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="board-status-value">{current.label}</span>
        <span className="board-status-caret" aria-hidden="true">{place === "up" && open ? "▴" : "▾"}</span>
      </button>
      {open && menuStyle ? (
        <ul
          id={menuId}
          className={`board-status-menu place-${place}`}
          role="listbox"
          aria-label={`Status for ${playerName}`}
          style={menuStyle}
        >
          {BOARD_STATUS_OPTIONS.map((o) => (
            <li key={o.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={`board-status-option status-${o.value}${o.value === value ? " on" : ""}`}
                onClick={() => {
                  close();
                  if (o.value !== value) onChange(o.value);
                }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
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
