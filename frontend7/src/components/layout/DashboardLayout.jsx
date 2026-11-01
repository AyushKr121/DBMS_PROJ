import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/** Shell used after login: sidebar (always visible on desktop, drawer on mobile) + top bar + page. */
export default function DashboardLayout({ role }) {
  const { refreshUnread } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); refreshUnread(); }, [pathname, refreshUnread]);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="dash">
      <a className="skip-link" href="#content">Skip to content</a>
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
      <div className="dash__main">
        <Topbar role={role} onMenu={() => setOpen(true)} />
        <main id="content" className="dash__content"><Outlet /></main>
      </div>
    </div>
  );
}
