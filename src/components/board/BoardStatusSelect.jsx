import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { motionTokens } from "../../lib/motion.js";
import { norm } from "../../lib/names.js";

const BOARD_STATUS_OPTIONS = [
  { value: "available", label: "Open" },
  { value: "mine", label: "Won" },
  { value: "gone", label: "Gone" },
];

export default function BoardStatusSelect({ value, playerName, onChange }) {
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("down");
  const [menuStyle, setMenuStyle] = useState(null);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useMemo(() => `board-status-${norm(playerName).replace(/\s+/g, "-") || "x"}`, [playerName]);
  const current = BOARD_STATUS_OPTIONS.find((o) => o.value === value) || BOARD_STATUS_OPTIONS[0];

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const positionMenu = useCallback(() => {
    const trig = triggerRef.current;
    if (!trig) return;
    const r = trig.getBoundingClientRect();
    const menuH = BOARD_STATUS_OPTIONS.length * 36 + 8;
    const gap = 4;
    const spaceBelow = window.innerHeight - r.bottom - gap;
    const spaceAbove = r.top - gap;
    const goUp = spaceBelow < menuH && spaceAbove > spaceBelow;
    const width = Math.max(r.width, 92);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    setPlace(goUp ? "up" : "down");
    setMenuStyle({
      position: "fixed",
      left,
      width,
      zIndex: 140,
      ...(goUp
        ? { top: "auto", bottom: Math.max(8, window.innerHeight - r.top + gap) }
        : { top: r.bottom + gap, bottom: "auto" }),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }
    positionMenu();
  }, [open, positionMenu]);

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
    const onReposition = () => positionMenu();
    const onScrollClose = () => setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReposition);
    document.addEventListener("scroll", onScrollClose, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReposition);
      document.removeEventListener("scroll", onScrollClose, true);
    };
  }, [open, close, positionMenu]);

  const reduce = useReducedMotion();

  return (
    <div className={`board-status-dd status-${value}${open ? " open" : ""}`} ref={wrapRef}>
      <motion.button
        ref={triggerRef}
        type="button"
        className="board-status-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Status for ${playerName}`}
        onClick={() => setOpen((v) => !v)}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={motionTokens.spring.tap}
      >
        <span className="board-status-value">{current.label}</span>
        <motion.span
          className="board-status-caret"
          aria-hidden="true"
          animate={{ rotate: open ? (place === "up" ? 0 : 180) : 0 }}
          transition={{ duration: motionTokens.duration.fast }}
        >
          ▾
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && menuStyle ? (
          <motion.ul
            id={menuId}
            className={`board-status-menu place-${place}`}
            role="listbox"
            aria-label={`Status for ${playerName}`}
            style={{ ...menuStyle, transformOrigin: place === "up" ? "bottom center" : "top center" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: place === "up" ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: place === "up" ? 4 : -4 }}
            transition={reduce ? { duration: 0.12 } : motionTokens.spring.snappy}
          >
            {BOARD_STATUS_OPTIONS.map((o) => (
              <li key={o.value} role="presentation">
                <motion.button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  className={`board-status-option status-${o.value}${o.value === value ? " on" : ""}`}
                  onClick={() => {
                    close();
                    if (o.value !== value) onChange(o.value);
                  }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                >
                  {o.label}
                </motion.button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
