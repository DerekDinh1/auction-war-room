import { useEffect, useState } from "react";
import Icon from "../ui/Icon.jsx";
import BudgetVitals from "./BudgetVitals.jsx";
import SeasonSwitcher from "./SeasonSwitcher.jsx";
import { money } from "../../lib/format.js";

/**
 * Sticky command header: brand, season switcher, compact budget vitals, draft meta, quick-add.
 */
export default function CommandHeader({
  settingsLabel,
  seasons,
  activeSeasonId,
  onSelectSeason,
  onCreateNextSeason,
  remaining,
  spent,
  budget,
  maxBid,
  spotsLeft,
  budgetTone,
  drafted,
  rosterSpots,
  avgPerSpot,
  healthLetter,
  quick,
  quickRef,
  quickOpen,
  quickSugg,
  quickParsed,
  onQuickChange,
  onQuickFocus,
  onQuickBlur,
  onQuickKeyDown,
  onSelectQuick,
  onRunQuickAdd,
}) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const listId = "quick-ac-list";
  const expanded = quickOpen && quickSugg.length > 0;
  const activeId =
    expanded && activeIdx >= 0 && quickSugg[activeIdx]
      ? `${listId}-opt-${quickSugg[activeIdx].id}`
      : undefined;

  useEffect(() => {
    setActiveIdx(-1);
  }, [quick]);

  const handleKeyDown = (e) => {
    if (quickSugg.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % quickSugg.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i <= 0 ? quickSugg.length - 1 : i - 1));
        return;
      }
      if (e.key === "Enter" && activeIdx >= 0 && quickSugg[activeIdx]) {
        e.preventDefault();
        onSelectQuick(quickSugg[activeIdx]);
        setActiveIdx(-1);
        return;
      }
    }
    onQuickKeyDown?.(e);
  };

  return (
    <header className="command">
      <div className="command-top">
        <div className="brand">
          <h1 className="brand-title">
            <Icon name="bolt" className="brand-bolt" /> Auction War Room
          </h1>
          <p className="brand-sub">{settingsLabel}</p>
          {seasons?.length > 0 && (
            <SeasonSwitcher
              seasons={seasons}
              activeId={activeSeasonId}
              onSelect={onSelectSeason}
              onCreateNext={onCreateNextSeason}
            />
          )}
        </div>

        <BudgetVitals
          remaining={remaining}
          spent={spent}
          budget={budget}
          maxBid={maxBid}
          spotsLeft={spotsLeft}
          budgetTone={budgetTone}
        />

        <div className="meta-strip" aria-label="Draft snapshot">
          <span>
            <strong>{drafted}</strong>
            <em>/{rosterSpots}</em> drafted
          </span>
          <span>
            <strong>{spotsLeft}</strong> left
          </span>
          <span>
            <strong>{spotsLeft > 0 ? money(avgPerSpot) : "—"}</strong> avg
          </span>
          <span className={`meta-grade grade g${healthLetter}`}>
            Grade <strong>{healthLetter}</strong>
          </span>
        </div>
      </div>

      <div className="quickbar">
        <div className="ac-wrap quick-ac">
          <input
            ref={quickRef}
            className="quick-input"
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-label="Quick add: player name and price"
            value={quick}
            placeholder='Quick add — "Ja&#39;Marr Chase, WR, CIN, 52" or just "Chase 52"'
            onChange={onQuickChange}
            onFocus={onQuickFocus}
            onBlur={onQuickBlur}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {expanded && (
            <div className="ac-list" id={listId} role="listbox" aria-label="Quick-add player suggestions">
              {quickSugg.map((p, i) => (
                <button
                  key={p.id}
                  id={`${listId}-opt-${p.id}`}
                  type="button"
                  role="option"
                  aria-selected={i === activeIdx}
                  className={`ac-item${i === activeIdx ? " active" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectQuick(p);
                    setActiveIdx(-1);
                  }}
                >
                  <span>{p.name}</span>
                  <span className="ac-meta">
                    {p.pos} · {p.team} · Bye {p.bye}
                    {quickParsed && quickParsed.price != null
                      ? ` — add for ${money(quickParsed.price)}`
                      : ""}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="btn primary big" onClick={onRunQuickAdd}>
          Add pick
        </button>
      </div>

      {budgetTone !== "good" && spotsLeft > 0 && (
        <div
          className={`ticker ${budgetTone}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {budgetTone === "danger"
            ? `Budget critical — max bid is ${money(maxBid)} with ${spotsLeft} spots to fill.`
            : `Budget getting tight — averaging ${money(avgPerSpot)} per remaining spot.`}
        </div>
      )}
    </header>
  );
}
