import { useEffect, useMemo, useState } from "react";
import boardUpdates from "../data/board-updates.json";

const DISMISS_KEY = "awr-board-updates-dismissed";

const STATUS_LABELS = {
  Q: "Questionable",
  D: "Doubtful",
  OUT: "Out",
  IR: "IR",
  OFS: "Out (season)",
  PUP: "PUP",
};

function formatDay(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function rankHighlightText(h) {
  if (h.type === "rise") return `${h.name} ↑ #${h.from}→#${h.to}`;
  if (h.type === "drop") return `${h.name} ↓ #${h.from}→#${h.to}`;
  if (h.type === "entered") return `${h.name} joined at #${h.rank}`;
  if (h.type === "exited") return `${h.name} left (was #${h.rank})`;
  return h.name;
}

function injuryHighlightText(h) {
  if (h.type === "new") return `${h.name} added (${h.status})`;
  if (h.type === "removed") return `${h.name} cleared from list`;
  if (h.type === "status") return `${h.name} ${h.from} → ${h.to}`;
  if (h.type === "note") return `${h.name} note updated`;
  return h.name;
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status || "—";
}

export default function BoardUpdatesBanner() {
  const updates = boardUpdates;
  const stamp = updates?.generatedAt || "";
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DISMISS_KEY);
      setDismissed(saved === stamp);
    } catch {
      setDismissed(false);
    }
  }, [stamp]);

  const rankHighlights = useMemo(() => (updates?.highlights || []).slice(0, 10), [updates]);
  const injuryChanges = useMemo(() => (updates?.injuryHighlights || []).slice(0, 10), [updates]);
  const injuryWatch = useMemo(() => (updates?.injuryWatch || []).slice(0, 12), [updates]);
  const showInjuryChanges = injuryChanges.length > 0;
  const injuryItems = showInjuryChanges ? injuryChanges : injuryWatch;

  if (!updates?.generatedAt || dismissed !== false) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, stamp);
    } catch { /* ignore */ }
    setDismissed(true);
  };

  return (
    <aside className={`board-updates${open ? " is-open" : ""}`} aria-label="What's updated">
      <div className="board-updates-bar">
        <button
          type="button"
          className="board-updates-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="board-updates-kicker">What&apos;s updated</span>
          <span className="board-updates-date">{formatDay(updates.generatedAt)}</span>
          <span className="board-updates-summary">{updates.summary}</span>
          <span className="board-updates-caret" aria-hidden="true">{open ? "▴" : "▾"}</span>
        </button>
        <button type="button" className="board-updates-dismiss" onClick={dismiss} aria-label="Dismiss update banner">
          ✕
        </button>
      </div>
      {open ? (
        <div className="board-updates-body">
          <div className="board-updates-columns">
            <section className="board-updates-col" aria-label="Rank movers">
              <h3 className="board-updates-col-title">Rank movers</h3>
              <ul className="board-updates-list">
                {rankHighlights.map((h) => (
                  <li key={`rank-${h.type}-${h.name}`} className={`board-updates-item type-${h.type}`}>
                    <span className="board-updates-chip">{h.type}</span>
                    <span className="board-updates-text">{rankHighlightText(h)}</span>
                    {h.pos ? <span className="board-updates-meta">{h.pos}{h.team ? ` · ${h.team}` : ""}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
            <section className="board-updates-col" aria-label="Injury updates">
              <h3 className="board-updates-col-title">
                {showInjuryChanges ? "Injury changes" : "Injury watch"}
              </h3>
              {injuryItems.length === 0 ? (
                <p className="board-updates-empty">No tagged injuries on the board.</p>
              ) : (
                <ul className="board-updates-list">
                  {injuryItems.map((h) => (
                    <li
                      key={`inj-${h.type || "watch"}-${h.name}-${h.status || h.to || ""}`}
                      className={`board-updates-item type-injury status-${h.to || h.status}`}
                    >
                      <span className={`board-updates-chip inj st-${h.to || h.status}`}>
                        {showInjuryChanges && h.type !== "watch" ? h.type : statusLabel(h.status)}
                      </span>
                      <span className="board-updates-text">
                        {showInjuryChanges ? injuryHighlightText(h) : h.name}
                      </span>
                      {h.note ? <span className="board-updates-meta">{h.note}</span> : null}
                      {h.pos ? (
                        <span className="board-updates-meta">{h.pos}{h.team ? ` · ${h.team}` : ""}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
          {updates.previousGeneratedAt ? (
            <p className="board-updates-foot">
              Compared to {formatDay(updates.previousGeneratedAt)} · {updates.injuryAdjustments} injury adjustments on board
              {injuryWatch.length ? ` · ${injuryWatch.length} on injury watch` : ""}
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
