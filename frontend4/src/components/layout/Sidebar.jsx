import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NAV } from '@/utils/navigation';
import { ROLE_LABEL } from '@/utils/constants';
import { fullName } from '@/utils/format';
import { Logo } from './Navbar';
import Avatar from '@/components/ui/Avatar';
import Icon from '@/components/ui/Icon';

export default function Sidebar({ role, open, onClose }) {
  const { user, unread } = useAuth();
  const groups = NAV[role] || [];

  return (
    <>
      <div className={`sidebar__scrim ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Sidebar">
        <div className="sidebar__top">
          <Logo light />
          <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close menu"><Icon name="x" size={20} /></button>
        </div>

        <div className="sidebar__me">
          <Avatar person={user.profile} size={42} />
          <div className="sidebar__me-text">
            <strong>{fullName(user.profile)}</strong>
            <span>{ROLE_LABEL[role]}</span>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label={`${ROLE_LABEL[role]} menu`}>
          {groups.map((g, gi) => (
            <div className="sidebar__group" key={gi}>
              {g.title && <div className="sidebar__title">{g.title}</div>}
              {g.items.map((it) => (
                <NavLink
                  key={it.to || 'home'}
                  to={`/${role}${it.to ? `/${it.to}` : ''}`}
                  end={it.end}
                  className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
                >
                  <Icon name={it.icon} size={18} />
                  <span>{it.label}</span>
                  {it.badge === 'unread' && unread > 0 && <em className="sidebar__badge" aria-label={`${unread} unread`}>{unread}</em>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
