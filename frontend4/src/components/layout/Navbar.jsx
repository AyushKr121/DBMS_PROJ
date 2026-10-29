import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { INSTITUTE } from '@/utils/constants';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label={`${INSTITUTE.name} home`}>
      <span className="logo__mark"><Icon name="graduation" size={20} /></span>
      <span className="logo__text">Edu<b>Portal</b></span>
    </Link>
  );
}

/** Public navbar: logo, course catalog, about us, then dashboard + generated profile picture or Login. */
export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [pathname]);

  const doLogout = async () => { await logout(); navigate('/'); };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Logo />
        <button type="button" className="navbar__toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <Icon name={open ? 'x' : 'menu'} size={22} />
        </button>
        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Main">
          <NavLink to="/catalog">Course catalog</NavLink>
          <NavLink to="/about">About us</NavLink>
          {user ? (
            <>
              <NavLink to={`/${user.role}`} end>Dashboard</NavLink>
              <Link to={`/${user.role}/profile`} className="navbar__me" aria-label="My profile">
                <Avatar person={user.profile} size={34} />
              </Link>
              <Button variant="secondary" size="sm" icon="logout" onClick={doLogout}>Log out</Button>
            </>
          ) : (
            <Button to="/login" size="sm">Log in</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
