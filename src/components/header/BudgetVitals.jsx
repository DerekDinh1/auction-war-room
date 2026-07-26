import { money } from "../../lib/format.js";

/**
 * Compact budget vitals for the sticky command header.
 * Shows remaining budget and max safe bid side-by-side.
 */
export default function BudgetVitals({
  remaining,
  spent,
  budget = 200,
  maxBid,
  spotsLeft,
  budgetTone = "good",
}) {
  return (
    <div className="budget-vitals" aria-label="Budget vitals">
      <div className={`vital ${budgetTone}`}>
        <div className="vital-copy">
          <span className="vital-label">Budget left</span>
          <span className="vital-foot">
            of {money(budget)} · spent {money(spent)}
          </span>
        </div>
        <span className="vital-num">{money(remaining)}</span>
      </div>
      <div className={`vital prime ${budgetTone}`}>
        <div className="vital-copy">
          <span className="vital-label">Max bid</span>
          <span className="vital-foot">keeps $1 per open spot</span>
        </div>
        <span className="vital-num">{spotsLeft > 0 ? money(maxBid) : "—"}</span>
      </div>
    </div>
  );
}
