import { Link } from 'react-router-dom';
import Icon from './Icon';

/**
 * variant: primary | secondary | subtle | ghost | danger | danger-outline | accent
 * size:    sm | (default)
 * Pass `to` to render a router link that looks like a button.
 */
export default function Button({ variant = 'primary', size, icon, loading, children, className = '', to, disabled, type = 'button', ...rest }) {
  const cls = ['btn', variant !== 'primary' && `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ');
  const content = (
    <>
      {loading ? <span className="spinner spinner--sm" aria-hidden="true" /> : icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} /> : null}
      {children}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>;
  return <button type={type} className={cls} disabled={disabled || loading} {...rest}>{content}</button>;
}
