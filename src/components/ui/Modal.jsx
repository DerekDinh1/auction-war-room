import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Icon from "./Icon.jsx";
import { motionTokens, scalePop } from "../../lib/motion.js";

export default function Modal({ title, children, onClose }) {
  const boxRef = useRef(null);
  const closeRef = useRef(onClose);
  const reduce = useReducedMotion();
  closeRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    const box = boxRef.current;
    const shell = document.getElementById("awr-shell");
    const mobileNav = document.querySelector(".viewnav-mobile");
    const first = box && box.querySelector("input, select, textarea, button");
    if (first) first.focus();
    else if (box) box.focus();

    // Hide background from AT while dialog is open (aria-modal support varies)
    if (shell) shell.setAttribute("inert", "");
    if (mobileNav) mobileNav.setAttribute("inert", "");

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !box) return;
      const items = [...box.querySelectorAll("button, input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter(
        (el) => !el.disabled,
      );
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (shell) shell.removeAttribute("inert");
      if (mobileNav) mobileNav.removeAttribute("inert");
      if (opener && opener.isConnected && typeof opener.focus === "function") opener.focus();
    };
  }, []);

  const pop = scalePop(reduce);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-veil"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: motionTokens.duration.fast }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="modal"
          ref={boxRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          initial={pop.initial}
          animate={pop.animate}
          exit={pop.exit}
          transition={reduce ? { duration: 0.12 } : motionTokens.spring.soft}
        >
          <div className="modal-head">
            <h2 className="eyebrow">{title}</h2>
            <motion.button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Close dialog"
              whileTap={reduce ? undefined : { scale: 0.9 }}
            >
              <Icon name="cross-small" />
            </motion.button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
