import Icon from './Icon';

/** tone: info | success | warning | danger */
export default function Alert({ tone = 'info', title, children, action, className = '' }) {
  const icon = tone === 'success' ? 'checkCircle' : tone === 'info' ? 'info' : 'alert';
  return (
    <div className={`alert alert--${tone} ${className}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon name={icon} size={18} />
      <div className="alert__body">
        {title && <strong>{title}</strong>}
        {children && <div>{children}</div>}
      </div>
      {action}
    </div>
  );
}
