import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { motionTokens, scalePop } from "../../lib/motion.js";

/**
 * Season / year project switcher for the command header.
 */
export default function SeasonSwitcher({ seasons, activeId, onSelect, onCreateNext }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const reduce = useReducedMotion();
  const active = seasons.find((s) => s.id === activeId) || seasons[0];

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!active) return null;

  const pop = scalePop(reduce);

  return (
    <div className="season-switcher" ref={wrapRef}>
      <motion.button
        ref={triggerRef}
        type="button"
        className="season-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="season-menu"
        onClick={() => setOpen((v) => !v)}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={motionTokens.spring.tap}
      >
        <span className="season-kicker">Season</span>
        <span className="season-label">{active.label}</span>
        <motion.span
          className="season-caret"
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: motionTokens.duration.fast }}
        >
          ▾
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="season-menu"
            id="season-menu"
            role="menu"
            aria-label="Seasons"
            initial={pop.initial}
            animate={pop.animate}
            exit={pop.exit}
            transition={reduce ? { duration: 0.12 } : motionTokens.spring.snappy}
            style={{ transformOrigin: "top left" }}
          >
            {seasons.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                role="menuitemradio"
                aria-checked={s.id === activeId}
                className={`season-option ${s.id === activeId ? "on" : ""}`}
                onClick={() => {
                  onSelect(s.id);
                  close();
                }}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: motionTokens.duration.fast }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <span className="season-option-name">{s.name}</span>
                <span className="season-option-meta">
                  {(s.players?.length || 0)} picks
                </span>
              </motion.button>
            ))}
            <motion.button
              type="button"
              role="menuitem"
              className="season-option create"
              onClick={() => {
                close();
                onCreateNext();
              }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              + Start next season
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
