import { useEffect, useMemo, useState } from "react";
import boardUpdates from "../data/board-updates.json";

const DISMISS_KEY = "awr-board-updates-dismissed";

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

function highlightText(h) {
  if (h.type === "rise") return `${h.name} ↑ #${h.from}→#${h.to}`;
  if (h.type === "drop") return `${h.name} ↓ #${h.from}→#${h.to}`;
  if (h.type === "entered") return `${h.name} joined at #${h.rank}`;
  if (h.type === "exited") return `${h.name} left (was #${h.rank})`;
  return h.name;
}

/**
 * Collapsible banner summarizing the latest board refresh.
 * Dismissed until the next generatedAt changes.
 */
export default function BoardUpdatesBanner() {
  const updates = boardUpdates;
  const stamp = updates?.generatedAt || "";
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(null); // null = not hydrated yet

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DISMISS_KEY);
      setDismissed(saved === stamp);
    } catch {
      setDismissed(false);
    }
  }, [stamp]);

  const highlights = useMemo(() => (updates?.highlights || []).slice(0, 10), [updates]);

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
          <ul className="board-updates-list">
            {highlights.map((h) => (
              <li key={`${h.type}-${h.name}`} className={`board-updates-item type-${h.type}`}>
                <span className="board-updates-chip">{h.type}</span>
                <span className="board-updates-text">{highlightText(h)}</span>
                {h.pos ? <span className="board-updates-meta">{h.pos}{h.team ? ` · ${h.team}` : ""}</span> : null}
              </li>
            ))}
          </ul>
          {updates.previousGeneratedAt ? (
            <p className="board-updates-foot">
              Compared to {formatDay(updates.previousGeneratedAt)} · {updates.injuryAdjustments} injury adjustments on board
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
