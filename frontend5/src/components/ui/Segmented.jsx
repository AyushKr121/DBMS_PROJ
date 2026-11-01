/** Segmented choice, e.g. Present / Half day / Absent. options: [{ value, label, tone }] */
export default function Segmented({ options, value, onChange, label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={Number(value) === Number(o.value)}
          className={`is-${o.tone || 'neutral'}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
