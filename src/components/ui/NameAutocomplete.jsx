import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { motionTokens } from "../../lib/motion.js";
import { fuzzyMatch } from "../../lib/search.js";

export default function NameAutocomplete({ value, onChange, onSelect, placeholder, inputRef, posFilter, ariaLabel, listId = "asst-ac-list" }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const reduce = useReducedMotion();
  const sugg = useMemo(() => {
    if (!value || value.length < 2) return [];
    return fuzzyMatch(value, posFilter, 8);
  }, [value, posFilter]);
  const expanded = open && sugg.length > 0;
  const activeId = expanded && activeIdx >= 0 && sugg[activeIdx] ? `${listId}-opt-${sugg[activeIdx].id}` : undefined;

  useEffect(() => { setActiveIdx(-1); }, [value, posFilter]);

  const pick = (p) => {
    onSelect(p);
    setOpen(false);
    setActiveIdx(-1);
  };

  return (
    <div className="ac-wrap">
      <input
        ref={inputRef}
        className="field"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={activeId}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={(e) => {
          if (!sugg.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIdx((i) => (i + 1) % sugg.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            setActiveIdx((i) => (i <= 0 ? sugg.length - 1 : i - 1));
          } else if (e.key === "Enter" && activeIdx >= 0 && sugg[activeIdx]) {
            e.preventDefault();
            pick(sugg[activeIdx]);
          } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIdx(-1);
          }
        }}
        autoComplete="off"
      />
      <AnimatePresence>
        {expanded ? (
          <motion.div
            className="ac-list"
            id={listId}
            role="listbox"
            aria-label="Player suggestions"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={reduce ? { duration: 0.12 } : motionTokens.spring.snappy}
            style={{ transformOrigin: "top center" }}
          >
            {sugg.map((p, i) => (
              <motion.button
                key={p.id}
                id={`${listId}-opt-${p.id}`}
                type="button"
                role="option"
                aria-selected={i === activeIdx}
                className={`ac-item${i === activeIdx ? " active" : ""}`}
                onMouseDown={(e) => { e.preventDefault(); pick(p); }}
                initial={reduce ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: motionTokens.duration.fast }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <span>{p.name}</span>
                <span className="ac-meta">{p.pos} · {p.team} · Bye {p.bye}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
