import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main" className="site__main"><Outlet /></main>
      <Footer />
    </div>
  );
}
