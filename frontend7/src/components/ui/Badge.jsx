/** tone: neutral | brand | success | warning | danger | info */
export default function Badge({ tone = 'neutral', children, className = '' }) {
  return <span className={`badge badge--${tone} ${className}`}>{children}</span>;
}
