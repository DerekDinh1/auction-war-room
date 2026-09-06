import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import Icon from "../ui/Icon.jsx";
import { motionTokens } from "../../lib/motion.js";

/** True when a field that typically opens the soft keyboard is focused. */
function isEditableFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag === "INPUT") {
    const type = (el.getAttribute("type") || "text").toLowerCase();
    return !["button", "checkbox", "radio", "submit", "reset", "file", "image", "hidden", "range", "color"].includes(type);
  }
  return Boolean(el.isContentEditable);
}

/**
 * View switcher.
 * - desktop: in-document underline tabs under the header
 * - mobile: portaled to document.body + docked to visualViewport so
 *   iOS Safari does not hide/clip the bar on tall pages (My Team).
 *   Soft-keyboard gaps are ignored so the bar stays at the layout bottom
 *   (behind the keyboard) instead of floating over the form while typing.
 */
export default function ViewNav({ items, view, onChange, variant = "desktop" }) {
  const isMobile = variant === "mobile";
  const navRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isMobile) return;
    const el = navRef.current;
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!el) return;

    // Safari URL/toolbar chrome shifts are small; soft keyboards are large.
    const KEYBOARD_GAP_PX = 120;

    const sync = () => {
      if (!vv) {
        el.style.removeProperty("--vv-bottom");
        el.style.removeProperty("--vv-left");
        el.style.removeProperty("--vv-width");
        return;
      }
      // Layout-viewport bottom can sit below the visible area while the
      // Safari chrome shows/hides. Offset so the bar stays in view — but
      // do not lift for the software keyboard (search / form focus).
      const gap = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      const skipKeyboardLift = isEditableFocused() || gap > KEYBOARD_GAP_PX;
      const bottom = skipKeyboardLift ? 0 : gap;
      el.style.setProperty("--vv-bottom", `${bottom}px`);
      el.style.setProperty("--vv-left", `${vv.offsetLeft}px`);
      el.style.setProperty("--vv-width", `${vv.width}px`);
    };

    sync();
    if (!vv) return undefined;
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    window.addEventListener("orientationchange", sync);
    // focusin/out: keyboard open/close often lags vv.resize; re-sync on focus.
    // Defer focusout so activeElement reflects the post-blur target.
    const syncAfterFocusOut = () => {
      requestAnimationFrame(sync);
    };
    document.addEventListener("focusin", sync);
    document.addEventListener("focusout", syncAfterFocusOut);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      window.removeEventListener("orientationchange", sync);
      document.removeEventListener("focusin", sync);
      document.removeEventListener("focusout", syncAfterFocusOut);
    };
  }, [isMobile, view]);

  const nav = (
    <nav
      ref={navRef}
      className={`viewnav viewnav-${variant}`}
      aria-label="Views"
    >
      {items.map((v) => {
        const on = view === v.id;
        return (
          <motion.button
            key={v.id}
            type="button"
            className={`navbtn ${on ? "on" : ""}`}
            aria-current={on ? "page" : undefined}
            onClick={() => onChange(v.id)}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            transition={motionTokens.spring.tap}
          >
            <span className="navicon" aria-hidden="true">
              <Icon name={v.icon} />
            </span>
            <span className="navlabel">{v.label}</span>
            {v.badge ? (
              <motion.span
                className="navbadge"
                aria-label={`${v.badge} items`}
                key={String(v.badge)}
                initial={reduce ? false : { scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={motionTokens.spring.snappy}
              >
                {v.badge}
              </motion.span>
            ) : null}
            {on && !isMobile ? (
              <motion.span
                className="nav-underline"
                layoutId="nav-underline"
                transition={reduce ? { duration: 0 } : motionTokens.spring.snappy}
              />
            ) : null}
          </motion.button>
        );
      })}
    </nav>
  );

  if (isMobile && typeof document !== "undefined") {
    return createPortal(nav, document.body);
  }
  return nav;
}
