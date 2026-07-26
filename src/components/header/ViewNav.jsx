import Icon from "../ui/Icon.jsx";

export default function ViewNav({ items, view, onChange }) {
  return (
    <nav className="viewnav" aria-label="Views">
      {items.map((v) => (
        <button
          key={v.id}
          className={`navbtn ${view === v.id ? "on" : ""}`}
          aria-current={view === v.id ? "page" : undefined}
          onClick={() => onChange(v.id)}
        >
          <span className="navicon">
            <Icon name={v.icon} />
          </span>
          <span className="navlabel">{v.label}</span>
          {v.badge ? <span className="navbadge">{v.badge}</span> : null}
        </button>
      ))}
    </nav>
  );
}
