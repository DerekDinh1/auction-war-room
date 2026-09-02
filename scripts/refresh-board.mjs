#!/usr/bin/env node
/**
 * Refresh top-350 board from multi-source FantasyPros consensus + injury/handcuff adjustments.
 *
 * Sources: FantasyPros PPR, Half-PPR, Standard draft rankings
 * Injury: scripts/player-health.json (update daily)
 * Handcuffs: scripts/handcuffs.json
 *
 * Usage: node scripts/refresh-board.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PLAYERS_JS = join(ROOT, 'src/data/players.js');
const HEALTH_JS = join(ROOT, 'src/data/health.js');

const FP_URLS = {
  PPR: 'https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php',
  HALF: 'https://www.fantasypros.com/nfl/rankings/half-point-ppr-cheatsheets.php',
  STD: 'https://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php',
};

const STATUS_ADJ = {
  active: { starter: 0, handcuff: 0 },
  Q: { starter: 12, handcuff: -28 },
  D: { starter: 22, handcuff: -38 },
  OUT: { starter: 45, handcuff: -50 },
  PUP: { starter: 35, handcuff: -20 },
  IR: { starter: 100, handcuff: -55 },
  OFS: { starter: 800, handcuff: -15 },
};

const norm = (s) => (s || '').toLowerCase().replace(/['']/g, "'").replace(/[.-]/g, '').trim();


function loadPreviousPlayers() {
  try {
    return JSON.parse(readFileSync(join(__dirname, 'top350-players.json'), 'utf8'));
  } catch {
    return null;
  }
}

function loadPreviousMeta() {
  try {
    return JSON.parse(readFileSync(join(__dirname, 'top350-meta.json'), 'utf8'));
  } catch {
    return null;
  }
}


const HEALTH_SNAPSHOT = join(__dirname, 'player-health-snapshot.json');
const STATUS_ORDER = { OFS: 0, IR: 1, OUT: 2, PUP: 3, D: 4, Q: 5, active: 9 };

function loadHealthSnapshot() {
  try {
    return JSON.parse(readFileSync(HEALTH_SNAPSHOT, 'utf8'));
  } catch {
    return null;
  }
}

function saveHealthSnapshot(health) {
  writeFileSync(
    HEALTH_SNAPSHOT,
    JSON.stringify({ updatedAt: health.updatedAt, players: health.players || {} }, null, 2) + '\n',
  );
}

function noteSnippet(note, max = 72) {
  const s = String(note || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function buildInjuryUpdates(prevHealth, nextHealth, top350) {
  const boardLookup = new Map((top350 || []).map((p) => [p.name, p]));
  const prev = prevHealth?.players || {};
  const next = nextHealth?.players || {};
  const names = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const highlights = [];

  for (const name of names) {
    const o = prev[name];
    const c = next[name];
    if (!o && c) {
      highlights.push({
        type: 'new',
        name,
        status: c.status,
        note: noteSnippet(c.note),
        pos: boardLookup.get(name)?.pos || null,
        team: boardLookup.get(name)?.team || null,
      });
      continue;
    }
    if (o && !c) {
      highlights.push({ type: 'removed', name, status: o.status, note: noteSnippet(o.note) });
      continue;
    }
    if (!o || !c) continue;
    if (o.status !== c.status) {
      highlights.push({
        type: 'status',
        name,
        from: o.status,
        to: c.status,
        note: noteSnippet(c.note),
        pos: boardLookup.get(name)?.pos || null,
        team: boardLookup.get(name)?.team || null,
      });
    } else if (o.note !== c.note) {
      highlights.push({
        type: 'note',
        name,
        status: c.status,
        note: noteSnippet(c.note),
        pos: boardLookup.get(name)?.pos || null,
        team: boardLookup.get(name)?.team || null,
      });
    }
  }

  highlights.sort((a, b) => (STATUS_ORDER[a.to || a.status] ?? 9) - (STATUS_ORDER[b.to || b.status] ?? 9));

  const watch = Object.entries(next)
    .filter(([, h]) => h?.status && h.status !== 'active')
    .map(([name, h]) => ({
      name,
      status: h.status,
      note: noteSnippet(h.note),
      pos: boardLookup.get(name)?.pos || null,
      team: boardLookup.get(name)?.team || null,
    }))
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));

  return { injuryHighlights: highlights, injuryWatch: watch };
}

function buildBoardUpdates(prevPlayers, nextPlayers, prevMeta, nextMeta) {
  const indexed = (players) => {
    const m = new Map();
    (players || []).forEach((p, i) => m.set(p.name, { rank: i + 1, pos: p.pos, team: p.team }));
    return m;
  };
  const om = indexed(prevPlayers);
  const nm = indexed(nextPlayers);
  const oldNames = new Set(om.keys());
  const newNames = new Set(nm.keys());
  const entered = [...newNames].filter((n) => !oldNames.has(n)).sort((a, b) => nm.get(a).rank - nm.get(b).rank);
  const exited = [...oldNames].filter((n) => !newNames.has(n)).sort((a, b) => om.get(a).rank - om.get(b).rank);
  const moves = [];
  for (const name of oldNames) {
    if (!newNames.has(name)) continue;
    const from = om.get(name).rank;
    const to = nm.get(name).rank;
    if (from === to) continue;
    const cur = nm.get(name);
    moves.push({ name, pos: cur.pos, team: cur.team, from, to, delta: from - to, abs: Math.abs(from - to) });
  }
  moves.sort((a, b) => b.abs - a.abs);

  const highlights = [];
  for (const m of moves.slice(0, 8)) {
    highlights.push({
      type: m.delta > 0 ? 'rise' : 'drop',
      name: m.name,
      pos: m.pos,
      team: m.team,
      from: m.from,
      to: m.to,
    });
  }
  for (const name of entered.slice(0, 5)) {
    const cur = nm.get(name);
    highlights.push({ type: 'entered', name, pos: cur.pos, team: cur.team, rank: cur.rank });
  }
  for (const name of exited.slice(0, 5)) {
    const cur = om.get(name);
    highlights.push({ type: 'exited', name, pos: cur.pos, team: cur.team, rank: cur.rank });
  }

  const rankChanges = moves.length;
  const summary = prevPlayers
    ? `Top-350 re-ranked from FantasyPros · ${rankChanges} rank moves · ${entered.length} in · ${exited.length} out`
    : `Top-350 board refreshed from FantasyPros (${nextMeta.count || 350} players)`;

  return {
    generatedAt: nextMeta.generatedAt,
    previousGeneratedAt: prevMeta?.generatedAt || null,
    summary,
    rankChanges,
    enteredCount: entered.length,
    exitedCount: exited.length,
    injuryAdjustments: nextMeta.injuryAdjustments || 0,
    count: nextMeta.count || 350,
    highlights,
  };
}


async function fetchPlayers(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuctionWarRoom/1.0)' } });
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
    const team = p.player_team_id || p.team;
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

  for (const p of players) {
    p.sortAvg = p.avg + (p.adj || 0);
  }
  players.sort((a, b) => a.sortAvg - b.sortAvg || a.avg - b.avg || a.name.localeCompare(b.name));
  return players.slice(0, 350);
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function genRawDb(players, generatedAt) {
  const lines = [
    '// Built-in player list — Top 350 overall (FantasyPros multi-format avg + injury/handcuff adj)',
    '// Average of FantasyPros expert consensus rank_ave across PPR, Half-PPR, and Standard draft rankings',
    `// Generated ${generatedAt} · 350 players · ordered by adjusted consensus rank`,
    'export const RAW_DB = [',
  ];
  players.forEach((p, i) => {
    const tag = p.adj ? ` · adj ${p.adj > 0 ? '+' : ''}${p.adj.toFixed(0)}` : '';
    lines.push(`  ["${esc(p.name)}","${p.pos}","${p.team}"], // ${i + 1} · avg ${p.avg.toFixed(2)}${tag}`);
  });
  lines.push('];');
  lines.push('');
  return lines.join('\n');
}

function genPlayerHealth(health, generatedAt) {
  const lines = [
    `// Player health — updated ${health.updatedAt || generatedAt}`,
    '// Sources: ' + (health.sources || []).join('; '),
    '// Regenerate via: npm run refresh-board',
    'export const PLAYER_HEALTH = {',
  ];
  for (const [name, h] of Object.entries(health.players || {})) {
    const src = JSON.stringify(h.sources || []);
    lines.push(`  [norm("${esc(name)}")]: { status: "${h.status}", note: "${esc(h.note)}", sources: ${src}, updatedAt: "${h.updatedAt}" },`);
  }
  lines.push('};');
  lines.push('');
  return lines.join('\n');
}

function patchDataFiles(rawBlock, healthBlock) {
  const players = readFileSync(PLAYERS_JS, 'utf8').replace(
    /\/\/ Built-in player list — Top 350 overall[\s\S]*?^export const RAW_DB = \[[\s\S]*?\n\];/m,
    rawBlock.trim(),
  );
  writeFileSync(PLAYERS_JS, players);
  const health = readFileSync(HEALTH_JS, 'utf8').replace(
    /\/\/ Player health[\s\S]*?^export const PLAYER_HEALTH = \{[\s\S]*?\n\};/m,
    healthBlock.trim(),
  );
  writeFileSync(HEALTH_JS, health);
}

async function main() {
  console.log('Fetching FantasyPros rankings (PPR + Half-PPR + Standard)...');
  const sources = {};
  for (const [label, url] of Object.entries(FP_URLS)) {
    sources[label] = await fetchPlayers(url);
    console.log(`  ${label}: ${Object.keys(sources[label]).length} players`);
  }

  const health = JSON.parse(readFileSync(join(__dirname, 'player-health.json'), 'utf8'));
  const handcuffs = JSON.parse(readFileSync(join(__dirname, 'handcuffs.json'), 'utf8'));

  let merged = mergeSources(sources);
  console.log(`Merged ${merged.length} players from ${Object.keys(sources).length} sources`);

  const top350 = applyInjuryAdjustments(merged, health, handcuffs);
  console.log(`Top 350 after injury/handcuff adjustments`);

  const jeanty = top350.find((p) => p.name === 'Ashton Jeanty');
  const mike = top350.find((p) => p.name === 'Mike Washington Jr.');
  if (jeanty && mike) {
    console.log(`  Ashton Jeanty: rank #${top350.indexOf(jeanty) + 1} (avg ${jeanty.avg}, adj ${jeanty.adj})`);
    console.log(`  Mike Washington Jr.: rank #${top350.indexOf(mike) + 1} (avg ${mike.avg}, adj ${mike.adj})`);
  }

  const prevPlayers = loadPreviousPlayers();
  const prevMeta = loadPreviousMeta();

  const generatedAt = new Date().toISOString();
  health.updatedAt = generatedAt;

  const meta = {
    generatedAt,
    method: 'Average of FantasyPros PPR + Half-PPR + Standard; injury/handcuff rank adjustments from player-health.json',
    rankingSources: Object.keys(FP_URLS).map((label) => ({ label, url: FP_URLS[label] })),
    healthSources: health.sources,
    healthUpdatedAt: health.updatedAt,
    injuryAdjustments: top350.filter((p) => p.adj).length,
    count: 350,
  };

  const prevHealthSnapshot = loadHealthSnapshot();
  const injury = buildInjuryUpdates(prevHealthSnapshot, health, top350);
  const updates = {
    ...buildBoardUpdates(prevPlayers, top350, prevMeta, meta),
    ...injury,
  };
  if (injury.injuryHighlights.length) {
    updates.summary += ` · ${injury.injuryHighlights.length} injury update${injury.injuryHighlights.length === 1 ? '' : 's'}`;
  }
  const updatesPath = join(ROOT, 'src/data/board-updates.json');

  writeFileSync(join(__dirname, 'top350-players.json'), JSON.stringify(top350, null, 2) + '\n');
  writeFileSync(join(__dirname, 'top350-meta.json'), JSON.stringify(meta, null, 2) + '\n');
  writeFileSync(updatesPath, JSON.stringify(updates, null, 2) + '\n');

  patchDataFiles(genRawDb(top350, generatedAt), genPlayerHealth(health, generatedAt));
  console.log('Patched src/data/players.js and src/data/health.js');
  console.log(`Wrote board updates (${updates.rankChanges} rank moves, ${updates.highlights.length} rank highlights, ${updates.injuryWatch.length} on injury watch)`);
  saveHealthSnapshot(health);
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
