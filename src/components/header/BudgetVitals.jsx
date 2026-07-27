import { motion, useReducedMotion } from "motion/react";
import { money } from "../../lib/format.js";
import { motionTokens } from "../../lib/motion.js";

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
  const reduce = useReducedMotion();
  const maxLabel = spotsLeft > 0 ? money(maxBid) : "—";

  return (
    <div className="budget-vitals" aria-label="Budget vitals">
      <div className={`vital ${budgetTone}`}>
        <div className="vital-copy">
          <span className="vital-label">Budget left</span>
          <span className="vital-foot">
            of {money(budget)} · spent {money(spent)}
          </span>
        </div>
        <motion.span
          key={`rem-${remaining}`}
          className="vital-num"
          initial={reduce ? false : { y: 6, opacity: 0.45 }}
          animate={{ y: 0, opacity: 1 }}
          transition={motionTokens.spring.snappy}
        >
          {money(remaining)}
        </motion.span>
      </div>
      <div className={`vital prime ${budgetTone}`}>
        <div className="vital-copy">
          <span className="vital-label">Max bid</span>
          <span className="vital-foot">keeps $1 per open spot</span>
        </div>
        <motion.span
          key={`max-${maxLabel}`}
          className="vital-num"
          initial={reduce ? false : { y: 6, opacity: 0.45 }}
          animate={{ y: 0, opacity: 1 }}
          transition={motionTokens.spring.snappy}
        >
          {maxLabel}
        </motion.span>
      </div>
    </div>
  );
}
