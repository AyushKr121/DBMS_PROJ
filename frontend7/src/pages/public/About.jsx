import { INSTITUTE } from '@/utils/constants';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Icon from '@/components/ui/Icon';
import Card from '@/components/ui/Card';

export default function About() {
  useDocumentTitle('About us');
  return (
    <div className="container page-public">
      <h1>About {INSTITUTE.name}</h1>
      <p className="lead">
        {INSTITUTE.name} is a coaching institute that teaches in small, scheduled batches. This portal replaces notebooks and
        phone calls: each batch has its own timetable, modules, tests, attendance, fee record and notices.
      </p>

      <div className="grid-3">
        <Card title="Our approach">
          <p className="muted">Courses are broken into modules and taught to a batch by one teacher. Progress is recorded module by module, so students and parents always know where the class stands.</p>
        </Card>
        <Card title="Who runs it">
          <p className="muted">Teachers take the classes. Assistants handle admissions, fees, salaries and day-to-day records at the front desk. Admins oversee the whole institute.</p>
        </Card>
        <Card title="Joining">
          <p className="muted">Accounts are created at the institute by an assistant, and the login details are sent to your email. Public sign-up is not available.</p>
        </Card>
      </div>

      <h2 className="section__title">Find us</h2>
      <Card>
        <ul className="contact-list">
          <li><Icon name="pin" /> {INSTITUTE.city}</li>
          <li><Icon name="mail" /> <a href={`mailto:${INSTITUTE.email}`}>{INSTITUTE.email}</a></li>
          <li><Icon name="phone" /> {INSTITUTE.phone}</li>
        </ul>
      </Card>
    </div>
  );
}
