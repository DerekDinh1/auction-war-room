import { useState } from "react";
import Modal from "./Modal.jsx";
import { money } from "../../lib/format.js";

export default function PricePrompt({ target, onCancel, onConfirm, mode = "mine", onSkip = null }) {
  const gone = mode === "gone";
  const suggest = target.maxBid != null ? Math.round(target.maxBid) : null;
  const [price, setPrice] = useState(() => (suggest != null ? String(suggest) : ""));
  const ok = price !== "" && Number.isFinite(Number(price));
  return (
    <Modal title={gone ? `${target.name} went to another team — final price?` : `You won ${target.name} — for how much?`} onClose={onCancel}>
      <div className="price-ask">
        <input className="field big-field" inputMode="numeric" /* Modal focuses this via effect; autoFocus would fire before the effect captures the opener */ aria-label={gone ? "Final sale price in dollars" : "Winning bid in dollars"}
          placeholder={suggest != null ? `${gone ? "Sold for" : "Winning bid"} — e.g. ${suggest}` : (gone ? "Sold for $" : "Winning bid $")}
          onFocus={(e) => e.target.select()}
          value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => { if (e.key === "Enter" && ok) onConfirm(Math.round(Number(price))); }} />
        {suggest != null && price !== String(suggest) && (
          <button className="btn tiny-fill" onClick={() => setPrice(String(suggest))}>Use {money(suggest)}</button>
        )}
        <span className="hint">
          {target.est != null ? `Estimated value ${money(target.est)}. ` : ""}
          {gone ? "Prices feed your market-inflation read — skip if you didn't catch it." : ""}
        </span>
      </div>
      <div className="modal-actions">
        <button className="btn" onClick={onCancel}>Cancel</button>
        {onSkip && <button className="btn" onClick={onSkip}>Skip price</button>}
        <button className="btn primary" disabled={!ok} onClick={() => onConfirm(Math.round(Number(price)))}>{gone ? "Mark gone" : "Add to roster"}</button>
      </div>
    </Modal>
  );
}
