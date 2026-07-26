import { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";

export default function Modal({ title, children, onClose }) {
  const boxRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    const box = boxRef.current;
    const first = box && box.querySelector("input, select, textarea, button");
    if (first) first.focus();
    else if (box) box.focus();

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
      if (opener && opener.isConnected && typeof opener.focus === "function") opener.focus();
    };
  }, []);

  return (
    <div
      className="modal-veil"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" ref={boxRef} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <div className="modal-head">
          <span className="eyebrow">{title}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="cross-small" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
