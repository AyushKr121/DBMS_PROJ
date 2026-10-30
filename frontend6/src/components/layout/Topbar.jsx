import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABEL } from '@/utils/constants';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function Topbar({ role, onMenu }) {
  const { user, logout, unread } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <button type="button" className="topbar__menu" onClick={onMenu} aria-label="Open menu"><Icon name="menu" size={22} /></button>
      <div className="topbar__hello">
        <span className="muted">Signed in as</span> <strong>{user.profile.First_name}</strong> <span className="topbar__role">{ROLE_LABEL[role]}</span>
      </div>
      <div className="topbar__right">
        <Link to="/catalog" className="topbar__link">Course catalog</Link>
        <Link to={`/${role}/notifications`} className="topbar__bell" aria-label={unread ? `${unread} unread notifications` : 'Notifications'}>
          <Icon name="bell" size={20} />
          {unread > 0 && <span className="topbar__count">{unread > 99 ? '99+' : unread}</span>}
        </Link>
        <Button variant="subtle" size="sm" icon="logout" onClick={async () => { await logout(); navigate('/'); }}>Log out</Button>
      </div>
    </div>
  );
}
