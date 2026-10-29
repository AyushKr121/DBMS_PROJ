import { clamp } from '@/utils/format';

/** value / max as a bar. tone: brand | success | warning | danger */
export default function ProgressBar({ value = 0, max = 100, label, tone = 'brand', showText = true, suffix }) {
  const pct = max ? clamp(Math.round((Number(value) / Number(max)) * 100), 0, 100) : 0;
  return (
    <div className="progress">
      <div className="progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label || 'Progress'}>
        <div className={`progress__bar progress__bar--${tone}`} style={{ width: `${pct}%` }} />
      </div>
      {showText && (
        <div className="progress__text small muted">
          {label ?? `${value} of ${max}${suffix ? ` ${suffix}` : ''}`} <strong>({pct}%)</strong>
        </div>
      )}
    </div>
  );
}
