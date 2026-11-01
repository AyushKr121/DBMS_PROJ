export default function Card({ title, subtitle, actions, children, className = '', flush = false, as: Tag = 'section', ...rest }) {
  return (
    <Tag className={`card ${flush ? 'card--flush' : ''} ${className}`} {...rest}>
      {(title || actions) && (
        <header className="card__head">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__sub muted small">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </header>
      )}
      <div className="card__body">{children}</div>
    </Tag>
  );
}
