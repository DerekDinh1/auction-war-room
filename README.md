# Auction War Room

NFL fantasy football auction draft tracker. Organized by **season projects** (e.g. 2026–27), so each auction year keeps its own roster, board, and settings.

## Live

https://derekdinh1.github.io/auction-war-room/

## Develop

```bash
npm install
npm run dev
```

Open the Local URL Vite prints (includes `/auction-war-room/` base path).

## Seasons (projects)

- **2026–27** is created by default (and migrates any older single-draft save).
- Switch seasons from the header dropdown, or manage them under **Settings**.
- **Start next season** copies league settings into a fresh empty board for the following year.

## Project layout

```
src/
  components/
    header/     CommandHeader, BudgetVitals, SeasonSwitcher, SeasonsPanel, ViewNav
    ui/         Icon, Modal
  lib/          seasons, storage, format
  styles/       warroom.css
  AuctionWarRoom.jsx
```

## Build

```bash
npm run build
npm run preview
```

Push to `master` to redeploy GitHub Pages via Actions.
