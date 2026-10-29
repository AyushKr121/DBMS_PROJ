/** Multi-select as toggle chips (used for schedule days). */
export default function ChipSelect({ options, value, onChange, label }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <label key={o} className={`chip ${value.includes(o) ? 'on' : ''}`}>
          <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} />
          {o.slice(0, 3)}
        </label>
      ))}
    </div>
  );
}
