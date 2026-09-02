import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { money } from "../../lib/format.js";
import { motionTokens } from "../../lib/motion.js";

function meterEdge(p) {
  if (p >= 90) return "m-edge-end";
  if (p <= 10) return "m-edge-start";
  return "";
}

export default function PriceMeter({ bid, V, recMax, absMax, tier }) {
  const reduce = useReducedMotion();
  const hasBid = bid != null;
  const safeRec = recMax != null ? recMax : 0;
  const safeAbs = absMax != null ? absMax : 0;
  // Scale to the decision range — leftover abs budget must not crush Proj/Rec/Bid into a left pile
  const focusMax = Math.max(V || 0, safeRec, bid || 0, 1);
  const includeAbsOnBar = safeAbs > 0 && safeAbs <= focusMax * 2.25;
  const scale = Math.max(focusMax * 1.5, includeAbsOnBar ? safeAbs : 0, 12);
  const pct = (x) => Math.min(100, Math.max(0, ((x != null ? x : 0) / scale) * 100));
  const greatEnd = V != null ? V * 0.82 : safeRec > 0 ? safeRec * 0.6 : scale * 0.35;
  const fairEnd = V != null ? Math.max(V, safeRec * 0.8) : safeRec > 0 ? safeRec * 0.85 : scale * 0.65;
  const recEnd = safeRec > 0 ? safeRec : scale * 0.85;

  const projPct = V != null ? pct(V) : null;
  const recPct = safeRec > 0 ? pct(safeRec) : null;
  const absPct = safeAbs > 0 ? pct(safeAbs) : null;
  const bidPct = hasBid ? pct(bid) : null;

  return (
    <div className={`meter-wrap${hasBid ? " has-bid" : ""}`}>
      <div className="meter" role="img" aria-label={`Value meter. Recommended max ${money(recMax)}${V != null ? `, projection ${money(V)}` : ""}, absolute max ${money(absMax)}${hasBid ? `, current bid ${money(bid)}` : ""}.`}>
        <div className="zone great" style={{ width: `${pct(greatEnd)}%` }} />
        <div className="zone fair" style={{ width: `${Math.max(0, pct(fairEnd) - pct(greatEnd))}%` }} />
        <div className="zone caution" style={{ width: `${Math.max(0, pct(recEnd) - pct(fairEnd))}%` }} />
        <div className="zone over" style={{ width: `${Math.max(0, 100 - pct(recEnd))}%` }} />
        {projPct != null && <div className={`marker m-proj ${meterEdge(projPct)}`} style={{ left: `${projPct}%` }} title={`Proj ${money(V)}`} />}
        {recPct != null && <div className={`marker m-rec ${meterEdge(recPct)}`} style={{ left: `${recPct}%` }} title={`Rec ${money(recMax)}`} />}
        {includeAbsOnBar && absPct != null && <div className={`marker m-abs ${meterEdge(absPct)}`} style={{ left: `${absPct}%` }} title={`Abs ${money(absMax)}`} />}
        <AnimatePresence>
          {hasBid ? (
            <motion.div
              key="bid-marker"
              className={`bid-marker t-${tier} ${meterEdge(bidPct)}`}
              title={`Bid ${money(bid)}`}
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{
                opacity: 1,
                y: 0,
                left: `${bidPct}%`,
                x: bidPct <= 2 ? "0%" : bidPct >= 98 ? "-100%" : "-50%",
              }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -2 }}
              transition={reduce ? { duration: 0.12 } : motionTokens.spring.snappy}
            >
              <div className="bid-tri" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="meter-legend">
        <span>Great</span>
        <span>Fair</span>
        <span>Caution</span>
        <span>Overpay</span>
      </div>
    </div>
  );
}
