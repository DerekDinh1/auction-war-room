# Auction War Room

[![Deploy](https://github.com/DerekDinh1/auction-war-room/actions/workflows/deploy.yml/badge.svg)](https://github.com/DerekDinh1/auction-war-room/actions/workflows/deploy.yml)
[![Pages](https://img.shields.io/badge/live-GitHub%20Pages-222?logo=github)](https://derekdinh1.github.io/auction-war-room/)

> A fast, season-aware NFL fantasy **auction draft tracker** — keep your board, budget, and targets in one place while the room is nominating.

## 🌟 Highlights

- **Draft Room assistant** — bid advice, max bid, and “nominate next” suggestions as the auction moves
- **Full player board** — top-350 consensus rankings with estimated auction values, stars, and Gone/Won tracking
- **2QB / superflex aware** — roster defaults and pricing boost QBs the way a Q/W/R/T league actually drafts
- **Health + handcuffs** — injury tags with hover notes; backups climb when starters get dinged
- **Plan tab targets** — nomination list synced with board stars, saved per season
- **Cross-device sync** — optional Supabase sync code for the active season; local archive when a season ends

## ℹ️ Overview

Auction drafts reward speed and discipline more than snake drafts do. You are juggling remaining budget, open roster spots, bye weeks, and who is still on the board — often while someone else is nominating the next name.

**Auction War Room** is a single-page React app built for that moment. Track what you bought, mark what others paid, plan nomination targets, and keep a live read on market inflation. Each season keeps its own roster, board, settings, and plan so last year’s auction does not bleed into this one.

It is tuned for a typical 12-team, $200 Yahoo auction (including 2QB / superflex), but roster slots and budget are editable in Settings.

### ✍️ Author

Built by [Derek Dinh](https://github.com/DerekDinh1) for personal fantasy drafts and shared here so others can run the same war-room workflow.

## 🚀 Usage

**Try it live:** [derekdinh1.github.io/auction-war-room](https://derekdinh1.github.io/auction-war-room/)

Typical flow during a draft:

1. Open **Draft Room** — load a nominee, enter the current bid, follow the recommended max
2. Use **Nominate next** when it is your turn — best available, fills a need, or your next Plan target
3. Mark players **Won** / **Gone** on the board so estimates and inflation stay honest
4. On the **Plan** tab, star targets and skim Health tags before you spend early budget on a dinged starter

Refresh rankings anytime (optional, for local development):

```bash
npm run refresh-board
```

That pulls FantasyPros multi-format consensus, applies injury / handcuff adjustments from `scripts/player-health.json`, and updates the baked-in board.

## ⬇️ Installation

Requires a recent **Node.js** (the deploy workflow uses Node 22). Works on macOS, Linux, and Windows.

```bash
git clone https://github.com/DerekDinh1/auction-war-room.git
cd auction-war-room
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

| Script | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run refresh-board` | Re-fetch rankings + health adjustments |


## 🔄 Cross-device sync (optional)

Draft state still saves in the browser by default. To keep the **active season** in sync across phone and laptop:

1. Create a free [Supabase](https://supabase.com) project
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql)
3. Copy the project URL and anon key into `.env.local` (see [`.env.example`](.env.example)):

```bash
cp .env.example .env.local
# edit VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

4. Restart `npm run dev` (Vite bakes env at build time)
5. In **Settings → Cross-device sync**, tap **Enable sync**, then enter the same code on your other device

Only the active season is synced (last write wins). Starting the next season downloads a finished-season JSON backup for reference; you can also download/restore a backup anytime from Settings.

For GitHub Pages, add repository secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` so the deploy workflow can inject them at build time.

## 💭 Feedback and Contributing

Found a bug, want a roster slot type, or have a better injury source? [Open an issue](https://github.com/DerekDinh1/auction-war-room/issues) or start a [discussion](https://github.com/DerekDinh1/auction-war-room/discussions).

Pull requests are welcome — keep changes focused, and run `npm run build` before you push.

---

README structure inspired by [Bane Sullivan’s guide](https://github.com/banesullivan/README) on writing a good README.
