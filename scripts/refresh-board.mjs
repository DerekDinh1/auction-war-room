#!/usr/bin/env node
/**
 * Refresh top-350 board from FantasyPros consensus + Sleeper health + handcuff adjustments.
 *
 * Writes:
 *   src/data/raw-db.json          — board order for the app
 *   src/data/player-health.json   — merged Sleeper + overrides (overrides win)
 *   scripts/top350-players.json   — full ranked payload
 *   scripts/top350-meta.json      — run metadata
 *
 * Manual nuance: edit scripts/player-health-overrides.json (beat-reporter notes, OFS, etc.)
 *
 * Usage: node scripts/refresh-board.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'src/data');

const FP_URLS = {
  PPR: 'https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php',
  HALF: 'https://www.fantasypros.com/nfl/rankings/half-point-ppr-cheatsheets.php',
  STD: 'https://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php',
};
const SLEEPER_URL = 'https://api.sleeper.app/v1/players/nfl';

const MIN_MERGED = 300;
const MIN_PER_SOURCE = 200;
const MAX_TOP50_CHURN = 35; // of 50 — fail if scrape looks scrambled

const STATUS_ADJ = {
  active: { starter: 0, handcuff: 0 },
  Q: { starter: 12, handcuff: -28 },
  D: { starter: 22, handcuff: -38 },
  OUT: { starter: 45, handcuff: -50 },
  PUP: { starter: 35, handcuff: -20 },
  IR: { starter: 100, handcuff: -55 },
  OFS: { starter: 800, handcuff: -15 },
};

const SLEEPER_STATUS = {
  Questionable: 'Q',
  Doubtful: 'D',
  Out: 'OUT',
  IR: 'IR',
  PUP: 'PUP',
  'COVID-19': 'OUT',
  Suspended: 'OUT',
};

const TEAM_ALIASES = { JAC: 'JAX', WSH: 'WAS', ARZ: 'ARI', LA: 'LAR', OAK: 'LV', SD: 'LAC', STL: 'LAR' };

const norm = (s) => (s || '').toLowerCase().replace(/['']/g, "'").replace(/[.\-]/g, '').trim();
const stripSuffix = (s) => norm(s).replace(/\s+(jr|sr|ii|iii|iv|v)$/i, '').trim();
const canonTeam = (t) => TEAM_ALIASES[t] || t;

async function fetchPlayers(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuctionWarRoom/1.0)' } });
  if (!res.ok) throw new Error(`FantasyPros ${url} → HTTP ${res.status}`);
  const html = await res.text();
  const patterns = [
    /"players"\s*:\s*(\[.*?\])\s*,\s*"filters"/s,
    /"players"\s*:\s*(\[.*?\])\s*,\s*"/s,
  ];
  let players = null;
  for (const pat of patterns) {
    const m = html.match(pat);
    if (m) {
      try { players = JSON.parse(m[1]); break; } catch { /* continue */ }
    }
  }
  if (!players) {
    const re = /\{"player_id":\d+,"player_name":"[^"]+"[^}]{0,800}\}/g;
    players = [...html.matchAll(re)].map((x) => JSON.parse(x[0]));
  }
  const out = {};
  for (const p of players) {
    const name = p.player_name;
    if (!name) continue;
    let pos = p.player_position_id || p.position;
    if (pos === 'DST') pos = 'DEF';
    if (pos === 'DEF') continue;
    const team = canonTeam(p.player_team_id || p.team);
    const rank = Number(p.rank_ecr || p.ecr_rank || 9999);
    out[name] = { name, pos, team, rank };
  }
  return out;
}

function mergeSources(sources) {
  const all = new Set();
  for (const d of Object.values(sources)) for (const n of Object.keys(d)) all.add(n);
  const merged = [];
  for (const name of all) {
    const ranks = {};
    let pos = null, team = null;
    for (const [label, d] of Object.entries(sources)) {
      if (d[name]) {
        ranks[label] = d[name].rank;
        pos = d[name].pos;
        team = d[name].team;
      }
    }
    if (Object.keys(ranks).length < 2) continue;
    const avg = Object.values(ranks).reduce((a, b) => a + b, 0) / Object.values(ranks).length;
    merged.push({
      name, pos, team,
      avg: Math.round(avg * 100) / 100,
      ranks: Object.fromEntries(Object.entries(ranks).map(([k, v]) => [k, Math.round(v * 100) / 100])),
      nSources: Object.keys(ranks).length,
      adj: 0,
    });
  }
  return merged;
}

function applyInjuryAdjustments(players, health, handcuffs) {
  const byName = Object.fromEntries(players.map((p) => [norm(p.name), p]));
  const hcMap = {};
  for (const group of Object.values(handcuffs)) {
    if (typeof group !== 'object' || Array.isArray(group)) continue;
    for (const [starter, backups] of Object.entries(group)) {
      if (starter.startsWith('_')) continue;
      hcMap[norm(starter)] = backups.map(norm);
    }
  }

  for (const [name, h] of Object.entries(health.players || {})) {
    const key = norm(name);
    const p = byName[key];
    if (!p) continue;
    const adj = STATUS_ADJ[h.status] || STATUS_ADJ.active;
    p.adj += adj.starter;
    p.healthStatus = h.status;
    p.healthNote = h.note;

    for (const bk of hcMap[key] || []) {
      const backup = byName[bk];
      if (backup) {
        backup.adj += adj.handcuff;
        if (!backup.healthNote) backup.handcuffBoost = `Handcuff for ${name} (${h.status})`;
      }
    }
  }

  for (const p of players) p.sortAvg = p.avg + (p.adj || 0);
  players.sort((a, b) => a.sortAvg - b.sortAvg || a.avg - b.avg || a.name.localeCompare(b.name));
  return players.slice(0, 350);
}

async function fetchSleeperHealth(boardNames) {
  console.log('Fetching Sleeper NFL player map...');
  const res = await fetch(SLEEPER_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuctionWarRoom/1.0)' } });
  if (!res.ok) throw new Error(`Sleeper → HTTP ${res.status}`);
  const all = await res.json();
  const byKey = new Map(); // stripSuffix|pos|team → player
  const byNamePos = new Map();
  for (const p of Object.values(all)) {
    if (!p?.full_name || !p.position) continue;
    if (!['QB', 'RB', 'WR', 'TE', 'K'].includes(p.position)) continue;
    const team = canonTeam(p.team || '');
    const entry = {
      name: p.full_name,
      pos: p.position,
      team,
      injury_status: p.injury_status || null,
      injury_body_part: p.injury_body_part || null,
      injury_notes: p.injury_notes || null,
      practice_participation: p.practice_participation || null,
      depth_chart_order: p.depth_chart_order ?? null,
    };
    const keyName = stripSuffix(p.full_name);
    byKey.set(`${keyName}|${p.position}|${team}`, entry);
    const np = `${keyName}|${p.position}`;
    if (!byNamePos.has(np)) byNamePos.set(np, []);
    byNamePos.get(np).push(entry);
  }

  const today = new Date().toISOString().slice(0, 10);
  const players = {};
  let matched = 0;
  const unmatched = [];

  for (const { name, pos, team } of boardNames) {
    const t = canonTeam(team);
    const keyName = stripSuffix(name);
    let hit = byKey.get(`${keyName}|${pos}|${t}`);
    if (!hit) {
      const alts = byNamePos.get(`${keyName}|${pos}`) || [];
      hit = alts.length === 1 ? alts[0] : alts.find((a) => a.team === t) || null;
    }
    if (!hit) {
      unmatched.push(`${name} (${pos}/${team})`);
      continue;
    }
    matched += 1;
    const status = SLEEPER_STATUS[hit.injury_status];
    if (!status) continue; // healthy / no designation
    const part = hit.injury_body_part || 'injury';
    const detail = hit.injury_notes ? ` — ${hit.injury_notes}` : '';
    players[name] = {
      status,
      note: `${part}${detail}`,
      sources: ['Sleeper'],
      updatedAt: today,
      source: 'sleeper',
    };
  }

  return { players, matched, unmatched, total: boardNames.length };
}

function mergeHealth(sleeperPlayers, overridesDoc) {
  const out = {};
  for (const [name, h] of Object.entries(sleeperPlayers || {})) {
    out[name] = { ...h };
  }
  for (const [name, h] of Object.entries(overridesDoc.players || {})) {
    out[name] = {
      status: h.status,
      note: h.note,
      sources: h.sources || ['Manual override'],
      updatedAt: h.updatedAt || new Date().toISOString().slice(0, 10),
      source: 'override',
    };
  }
  const dates = Object.values(out).map((h) => h.updatedAt).filter(Boolean).sort();
  return {
    updatedAt: new Date().toISOString(),
    healthOldestUpdatedAt: dates[0] || null,
    sources: [
      'Sleeper NFL player API',
      ...(overridesDoc.sources || ['Manual overrides']),
    ],
    players: out,
  };
}

function sanityCheck(sources, merged, top350) {
  const errors = [];
  for (const [label, d] of Object.entries(sources)) {
    const n = Object.keys(d).length;
    if (n < MIN_PER_SOURCE) errors.push(`${label} only returned ${n} players (need ≥${MIN_PER_SOURCE})`);
  }
  if (merged.length < MIN_MERGED) errors.push(`Merged list only ${merged.length} (need ≥${MIN_MERGED})`);
  if (top350.length < 300) errors.push(`Top board only ${top350.length} players`);

  const prevPath = join(__dirname, 'top350-players.json');
  if (existsSync(prevPath)) {
    const prev = JSON.parse(readFileSync(prevPath, 'utf8'));
    const prevTop = new Set(prev.slice(0, 50).map((p) => norm(p.name)));
    const nextTop = top350.slice(0, 50).map((p) => norm(p.name));
    const churn = nextTop.filter((n) => !prevTop.has(n)).length;
    if (churn > MAX_TOP50_CHURN) {
      errors.push(`Top-50 churn ${churn}/${50} looks like a bad scrape (max ${MAX_TOP50_CHURN})`);
    }
  }
  return errors;
}

async function main() {
  console.log('Fetching FantasyPros rankings (PPR + Half-PPR + Standard)...');
  const sources = {};
  for (const [label, url] of Object.entries(FP_URLS)) {
    sources[label] = await fetchPlayers(url);
    console.log(`  ${label}: ${Object.keys(sources[label]).length} players`);
  }

  const overridesPath = existsSync(join(__dirname, 'player-health-overrides.json'))
    ? join(__dirname, 'player-health-overrides.json')
    : join(__dirname, 'player-health.json');
  const overrides = JSON.parse(readFileSync(overridesPath, 'utf8'));
  const handcuffs = JSON.parse(readFileSync(join(__dirname, 'handcuffs.json'), 'utf8'));

  const merged = mergeSources(sources);
  console.log(`Merged ${merged.length} players from ${Object.keys(sources).length} sources`);

  // Provisional board (no injury adj) for Sleeper matching against likely top names
  const provisional = [...merged].sort((a, b) => a.avg - b.avg).slice(0, 400);
  const sleeper = await fetchSleeperHealth(provisional.map((p) => ({ name: p.name, pos: p.pos, team: p.team })));
  console.log(`  Sleeper matched ${sleeper.matched}/${sleeper.total} on provisional board`);
  if (sleeper.unmatched.length) {
    const topMiss = sleeper.unmatched.slice(0, 12);
    console.warn(`  Unmatched sample (${sleeper.unmatched.length}): ${topMiss.join('; ')}`);
  }

  const health = mergeHealth(sleeper.players, overrides);
  console.log(`  Health entries: ${Object.keys(health.players).length} (overrides win)`);

  const top350 = applyInjuryAdjustments(merged, health, handcuffs);
  console.log(`Top 350 after injury/handcuff adjustments`);

  const jeanty = top350.find((p) => p.name === 'Ashton Jeanty');
  const mike = top350.find((p) => p.name === 'Mike Washington Jr.');
  if (jeanty) console.log(`  Ashton Jeanty: #${top350.indexOf(jeanty) + 1} avg=${jeanty.avg} adj=${jeanty.adj} ${jeanty.healthStatus || ''}`);
  if (mike) console.log(`  Mike Washington Jr.: #${top350.indexOf(mike) + 1} avg=${mike.avg} adj=${mike.adj}`);

  const errors = sanityCheck(sources, merged, top350);
  if (errors.length) {
    console.error('\nSANITY GATE FAILED:');
    errors.forEach((e) => console.error(' -', e));
    process.exit(2);
  }

  const generatedAt = new Date().toISOString();
  const meta = {
    generatedAt,
    method: 'FantasyPros PPR+Half+Std avg; Sleeper health + overrides; handcuff adj',
    rankingSources: Object.keys(FP_URLS).map((label) => ({ label, url: FP_URLS[label] })),
    healthSources: health.sources,
    healthUpdatedAt: health.updatedAt,
    healthOldestUpdatedAt: health.healthOldestUpdatedAt,
    sleeperMatched: sleeper.matched,
    sleeperUnmatched: sleeper.unmatched.length,
    injuryAdjustments: top350.filter((p) => p.adj).length,
    count: 350,
    sanity: 'passed',
  };

  const rawDb = {
    generatedAt,
    count: 350,
    players: top350.map((p) => [p.name, p.pos, p.team]),
  };

  writeFileSync(join(__dirname, 'top350-players.json'), JSON.stringify(top350, null, 2) + '\n');
  writeFileSync(join(__dirname, 'top350-meta.json'), JSON.stringify(meta, null, 2) + '\n');
  writeFileSync(join(DATA, 'raw-db.json'), JSON.stringify(rawDb, null, 2) + '\n');
  writeFileSync(join(DATA, 'player-health.json'), JSON.stringify(health, null, 2) + '\n');

  // Keep legacy generated JS as optional debug dumps (not imported by app)
  writeFileSync(join(__dirname, 'raw-db-generated.js'), `// Generated ${generatedAt} — see src/data/raw-db.json\nexport default ${JSON.stringify(rawDb.players)};\n`);

  console.log('Wrote src/data/raw-db.json + src/data/player-health.json');
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
