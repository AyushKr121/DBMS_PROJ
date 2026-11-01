import { Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  const { pathname } = useLocation();
  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main" className="site__main"><ErrorBoundary resetKey={pathname}><Outlet /></ErrorBoundary></main>
      <Footer />
    </div>
  );
}
