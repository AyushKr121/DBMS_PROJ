import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/ui/Async';

/** Only lets a logged-in user of `role` through; everybody else is sent to login or to their own dashboard. */
export default function RequireRole({ role, children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <Loader label="Restoring your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

/** Restricts a nested route to some roles (e.g. only admins see the Admins page). */
export function OnlyFor({ roles, children }) {
  const { user } = useAuth();
  if (!roles.includes(user?.role)) return <Navigate to={`/${user?.role || ''}`} replace />;
  return children;
}
