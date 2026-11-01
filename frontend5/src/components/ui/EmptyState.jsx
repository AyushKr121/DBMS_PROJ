import Icon from './Icon';

export default function EmptyState({ icon = 'info', title, text, action }) {
  return (
    <div className="empty">
      <span className="empty__icon"><Icon name={icon} size={22} /></span>
      <h4>{title}</h4>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}
