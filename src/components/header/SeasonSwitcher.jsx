import { useEffect, useRef, useState } from "react";

/**
 * Season / year project switcher for the command header.
 */
export default function SeasonSwitcher({ seasons, activeId, onSelect, onCreateNext }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const active = seasons.find((s) => s.id === activeId) || seasons[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!active) return null;

  return (
    <div className="season-switcher" ref={wrapRef}>
      <button
        type="button"
        className="season-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="season-kicker">Season</span>
        <span className="season-label">{active.label}</span>
        <span className="season-caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="season-menu" role="listbox" aria-label="Seasons">
          {seasons.map((s) => (
            <button
              key={s.id}
              type="button"
              role="option"
              aria-selected={s.id === activeId}
              className={`season-option ${s.id === activeId ? "on" : ""}`}
              onClick={() => {
                onSelect(s.id);
                setOpen(false);
              }}
            >
              <span className="season-option-name">{s.name}</span>
              <span className="season-option-meta">
                {(s.players?.length || 0)} picks
              </span>
            </button>
          ))}
          <button
            type="button"
            className="season-option create"
            onClick={() => {
              setOpen(false);
              onCreateNext();
            }}
          >
            + Start next season
          </button>
        </div>
      )}
    </div>
  );
}
