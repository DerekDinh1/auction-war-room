/** Flaticon UIcons subset — font is embedded in warroom.css */
export default function Icon({ name, n, className = "" }) {
  return (
    <i
      className={`fi ic-${name || n}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
