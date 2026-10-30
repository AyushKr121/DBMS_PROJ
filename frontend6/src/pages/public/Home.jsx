import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

const FEATURES = [
  { icon: 'layers', title: 'Everything lives inside a batch', text: 'Timings, venue, modules, tests, attendance, fees and notices are kept per batch, so nothing gets mixed up between courses.' },
  { icon: 'trending', title: 'Progress you can see', text: 'Students follow module progress, test scores and attendance. Teachers update them as the class moves forward.' },
  { icon: 'card', title: 'Clear fee and salary records', text: 'Every payment gets a reference number. Students and teachers can look up what was paid and when.' },
  { icon: 'bell', title: 'Notices that reach the right people', text: 'Institute-wide announcements, plus notices for one batch only. Unread ones are flagged until you open them.' },
];

const ROLES = [
  ['Students', 'See your batches, modules, test links, scores, attendance, fee status and certificate.'],
  ['Teachers', 'Run your own batches: create tests, enter scores, mark attendance and post batch notices.'],
  ['Assistants', 'Register people, set up courses and batches, enroll students, record fees and salaries.'],
  ['Admins', 'Everything an assistant does, plus account removal and a view of every complaint.'],
];

export default function Home() {
  useDocumentTitle('');
  const { user } = useAuth();
  const s = useResources(['course']);
  const categories = s.loading || s.error ? [] : [...new Set(s.d.course.map((c) => c.Category))].sort();

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1>Learn in focused batches, with every step on record.</h1>
            <p className="hero__lead">
              EduPortal connects students, teachers and the institute office. Pick a course, join a batch and follow your
              progress, attendance, tests and fees without chasing anyone for updates.
            </p>
            <div className="row">
              <Button to="/catalog" variant="accent" icon="book">Browse courses</Button>
              {user ? <Button to={`/${user.role}`} variant="secondary" className="btn--on-dark">Open my dashboard</Button> : <Button to="/login" variant="secondary" className="btn--on-dark">Log in</Button>}
            </div>
          </div>

          <div className="hero__panel" aria-label="Example of a student's batch page">
            <div className="batch-demo">
              <div className="batch-demo__head">
                <div>
                  <strong>Python Programming</strong>
                  <span className="small muted">Mon, Wed · 09:00 – 10:30 · Room 101</span>
                </div>
                <Badge tone="brand">Sample batch</Badge>
              </div>
              <ProgressBar value={2} max={4} label="2 of 4 modules" tone="brand" />
              <div className="batch-demo__grid">
                <div><span className="muted small">Attendance</span><strong>92%</strong></div>
                <div><span className="muted small">Latest test</span><strong>78 / 100</strong></div>
                <div><span className="muted small">Fees</span><Badge tone="success">Paid in full</Badge></div>
              </div>
              <div className="batch-demo__note"><Icon name="bell" size={16} /> Bring laptops for tomorrow's lab.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">What the portal keeps in order</h2>
          <div className="grid-2 features">
            {FEATURES.map((f) => (
              <article key={f.title} className="feature">
                <span className="feature__icon"><Icon name={f.icon} size={22} /></span>
                <div><h3>{f.title}</h3><p className="muted">{f.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="spread">
              <h2 className="section__title">Course categories</h2>
              <Link to="/catalog">See all courses</Link>
            </div>
            <div className="grid-3">
              {categories.slice(0, 6).map((c) => (
                <Link key={c} to={`/catalog?category=${encodeURIComponent(c)}`} className="category-card">
                  <span className="category-card__icon"><Icon name="book" size={22} /></span>
                  <h3>{c}</h3>
                  <span className="muted small">{s.d.course.filter((x) => x.Category === c).length} course(s)</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2 className="section__title">Who uses it</h2>
          <div className="grid-4">
            {ROLES.map(([t, d]) => (
              <div key={t} className="card"><h3>{t}</h3><p className="muted small">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2 className="section__title">How joining works</h2>
          <ol className="steps">
            <li><strong>Visit the institute.</strong><span className="muted">Choose a course and batch with an assistant.</span></li>
            <li><strong>Get your login by email.</strong><span className="muted">The assistant registers you; there is no public sign-up.</span></li>
            <li><strong>Log in and start.</strong><span className="muted">Your batches, notices and fee status are waiting on your dashboard.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}
