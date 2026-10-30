import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function PageHeader({ title, subtitle, actions, back, children }) {
  return (
    <header className="page-head">
      <div className="page-head__text">
        {back && <Link className="page-head__back" to={back.to}><Icon name="arrowLeft" size={14} /> {back.label}</Link>}
        <h1 className="page-head__title">{title}</h1>
        {subtitle && <p className="muted page-head__sub">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </header>
  );
}
