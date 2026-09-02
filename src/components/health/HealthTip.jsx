import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { HEALTH_LABELS, healthSnippet } from "../../data/health.js";

export function HealthTip({ label, note, sources, updatedAt, statusClass, variant = "badge" }) {
  const triggerRef = useRef(null);
  const tipRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState(null); // null until measured — avoids flash at 0,0
  const snippet = healthSnippet(note);
  const meta = [sources?.length ? sources.join(", ") : "", updatedAt ? `Updated ${updatedAt}` : ""].filter(Boolean).join(" · ");
  const fallback = [snippet ? `${label} — ${snippet}` : label, note, meta].filter(Boolean).join(" · ");

  const reposition = useCallback(() => {
    const el = triggerRef.current;
    const tip = tipRef.current;
    if (!el || !tip) return;
    const r = el.getBoundingClientRect();
    const tw = tip.offsetWidth || 200;
    const th = tip.offsetHeight || 80;
    const gap = 8;
    const pad = 8;
    const spaceAbove = r.top - pad;
    const spaceBelow = window.innerHeight - r.bottom - pad;
    const side = spaceAbove >= th + gap || spaceAbove >= spaceBelow ? "above" : "below";
    let top = side === "above" ? r.top - th - gap : r.bottom + gap;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - th - pad));
    setPlace({ top, left, side });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPlace(null);
      return undefined;
    }
    reposition();
    // second pass after paint in case first measure used fallback size
    const raf = requestAnimationFrame(reposition);
    const onScroll = () => reposition();
    const onResize = () => reposition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, reposition]);

  if (!note) {
    return <span className={`health-tag ${statusClass}${variant === "injury" ? " injury-tag" : ""}`}>{label}</span>;
  }
  return (
    <span
      ref={triggerRef}
      className={`health-tag has-tip ${statusClass}${variant === "injury" ? " injury-tag" : ""}${open ? " is-open" : ""}`}
      title={open ? undefined : fallback}
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="health-tag-label">{label}</span>
      {open ? (
        <span
          ref={tipRef}
          className={`health-tip side-${place?.side || "above"}${place ? " is-ready" : ""}`}
          role="tooltip"
          style={place ? { top: place.top, left: place.left } : { top: -9999, left: -9999 }}
        >
          <span className="health-tip-snippet">{snippet || note}</span>
          {note && snippet && note.length > snippet.length ? <span className="health-tip-detail">{note}</span> : null}
          {meta ? <span className="health-tip-meta">{meta}</span> : null}
        </span>
      ) : null}
    </span>
  );
}

export function HealthBadge({ health }) {
  if (!health) return <span className="health-tag st-active">—</span>;
  const label = HEALTH_LABELS[health.status] || health.status;
  return (
    <HealthTip
      label={label}
      note={health.note}
      sources={health.sources}
      updatedAt={health.updatedAt}
      statusClass={`st-${health.status}`}
    />
  );
}

export function InjuryTag({ note, label = "OUT" }) {
  return <HealthTip label={label} note={note} statusClass="st-OUT" variant="injury" />;
}
