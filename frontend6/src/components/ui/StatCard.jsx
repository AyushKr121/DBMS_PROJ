import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function StatCard({ label, value, hint, icon, tone = 'brand', to }) {
  const body = (
    <>
      {icon && <span className={`stat__icon stat__icon--${tone}`}><Icon name={icon} size={20} /></span>}
      <div className="stat__text">
        <span className="stat__value">{value}</span>
        <span className="stat__label">{label}</span>
        {hint && <span className="stat__hint">{hint}</span>}
      </div>
    </>
  );
  if (to) return <Link className="stat stat--link" to={to}>{body}</Link>;
  return <div className="stat">{body}</div>;
}
