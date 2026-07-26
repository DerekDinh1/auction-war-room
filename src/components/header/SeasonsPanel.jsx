/**
 * Seasons management block for Settings.
 */
export default function SeasonsPanel({
  seasons,
  activeId,
  onSelect,
  onCreateNext,
  onRename,
}) {
  const active = seasons.find((s) => s.id === activeId);

  return (
    <section className="panel wide seasons-panel">
      <div className="panel-head">
        <span className="eyebrow">Seasons (projects)</span>
        <span className="panel-side">One season = one auction year</span>
      </div>
      <p className="seasons-blurb">
        Keep each draft year separate. <strong>2026–27</strong> is your current project.
        When next year&apos;s draft rolls around, start a new season — league settings copy over,
        roster and board start fresh.
      </p>
      <div className="season-list">
        {seasons.map((s) => (
          <div key={s.id} className={`season-card ${s.id === activeId ? "on" : ""}`}>
            <div className="season-card-main">
              <div className="season-card-title">{s.name}</div>
              <div className="season-card-meta">
                {s.label} · {(s.players?.length || 0)} drafted
                {s.id === activeId ? " · active" : ""}
              </div>
            </div>
            <div className="season-card-actions">
              {s.id !== activeId && (
                <button type="button" className="btn" onClick={() => onSelect(s.id)}>
                  Switch
                </button>
              )}
              {s.id === activeId && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    const next = window.prompt("Rename season", s.name);
                    if (next && next.trim()) onRename(s.id, next.trim());
                  }}
                >
                  Rename
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="seasons-actions">
        <button type="button" className="btn primary" onClick={onCreateNext}>
          Start next season
          {active ? ` (${Number(active.startYear) + 1}–${String((Number(active.startYear) + 2) % 100).padStart(2, "0")})` : ""}
        </button>
      </div>
      <div className="empty-note">
        Bye weeks and the player pool are still shared until we version them per season —
        double-check team/bye when you open a new year.
      </div>
    </section>
  );
}
