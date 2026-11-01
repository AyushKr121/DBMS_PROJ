import { Link } from 'react-router-dom';
import { INSTITUTE } from '@/utils/constants';
import { Logo } from './Navbar';
import Icon from '@/components/ui/Icon';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo light />
          <p>Batch-wise coaching, with attendance, tests, fees and notices in one place.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/catalog">Course catalog</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/login">Log in</Link></li>
          </ul>
        </div>
        <div>
          <h4>Visit or write to us</h4>
          <ul>
            <li><Icon name="pin" size={14} /> {INSTITUTE.city}</li>
            <li><Icon name="mail" size={14} /> {INSTITUTE.email}</li>
            <li><Icon name="phone" size={14} /> {INSTITUTE.phone}</li>
          </ul>
        </div>
      </div>
      <div className="footer__bar">© {new Date().getFullYear()} {INSTITUTE.name}. Admissions are handled in person by our assistants.</div>
    </footer>
  );
}
