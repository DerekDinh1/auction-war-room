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
  return (
    <header className="command">
      <div className="command-top">
        <div className="brand">
          <div className="brand-title">
            <Icon name="bolt" className="brand-bolt" /> Auction War Room
          </div>
          <div className="brand-sub">{settingsLabel}</div>
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
            aria-label="Quick add: player name and price"
            value={quick}
            placeholder='Quick add — "Ja&#39;Marr Chase, WR, CIN, 52" or just "Chase 52"'
            onChange={onQuickChange}
            onFocus={onQuickFocus}
            onBlur={onQuickBlur}
            onKeyDown={onQuickKeyDown}
            autoComplete="off"
          />
          {quickOpen && quickSugg.length > 0 && (
            <div className="ac-list">
              {quickSugg.map((p) => (
                <button
                  key={p.id}
                  className="ac-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectQuick(p);
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
        <div className={`ticker ${budgetTone}`}>
          {budgetTone === "danger"
            ? `Budget critical — max bid is ${money(maxBid)} with ${spotsLeft} spots to fill.`
            : `Budget getting tight — averaging ${money(avgPerSpot)} per remaining spot.`}
        </div>
      )}
    </header>
  );
}
