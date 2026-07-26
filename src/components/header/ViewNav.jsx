import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import Icon from "../ui/Icon.jsx";

/**
 * View switcher.
 * - desktop: in-document underline tabs under the header
 * - mobile: portaled to document.body + docked to visualViewport so
 *   iOS Safari does not hide/clip the bar on tall pages (My Team)
 */
export default function ViewNav({ items, view, onChange, variant = "desktop" }) {
  const isMobile = variant === "mobile";
  const navRef = useRef(null);

  useEffect(() => {
    if (!isMobile) return;
    const el = navRef.current;
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!el) return;

    const sync = () => {
      if (!vv) {
        el.style.removeProperty("--vv-bottom");
        el.style.removeProperty("--vv-left");
        el.style.removeProperty("--vv-width");
        return;
      }
      // Layout-viewport bottom can sit below the visible area while the
      // Safari chrome shows/hides. Offset so the bar stays in view.
      const bottom = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      el.style.setProperty("--vv-bottom", `${bottom}px`);
      el.style.setProperty("--vv-left", `${vv.offsetLeft}px`);
      el.style.setProperty("--vv-width", `${vv.width}px`);
    };

    sync();
    if (!vv) return undefined;
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [isMobile, view]);

  const nav = (
    <nav
      ref={navRef}
      className={`viewnav viewnav-${variant}`}
      aria-label="Views"
    >
      {items.map((v) => (
        <button
          key={v.id}
          type="button"
          className={`navbtn ${view === v.id ? "on" : ""}`}
          aria-current={view === v.id ? "page" : undefined}
          onClick={() => onChange(v.id)}
        >
          <span className="navicon" aria-hidden="true">
            <Icon name={v.icon} />
          </span>
          <span className="navlabel">{v.label}</span>
          {v.badge ? (
            <span className="navbadge" aria-label={`${v.badge} items`}>
              {v.badge}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );

  if (isMobile && typeof document !== "undefined") {
    return createPortal(nav, document.body);
  }
  return nav;
}
