import { Link } from 'react-router-dom';
import { byKey, hhmm } from '@/utils/format';
import { daysOf, todayName } from '@/utils/batch';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

/** "Classes today": batches whose Schedule includes today's weekday, ordered by start time. */
export default function TodayClasses({ role, batches, courses, schedule }) {
  const name = todayName();
  const todays = batches
    .filter((b) => daysOf(schedule, b.batch_id).includes(name))
    .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));
  return (
    <Card title={`Classes today (${name})`}>
      {todays.length === 0 ? (
        <EmptyState icon="calendar" title="No classes today" text="Nothing is scheduled for today." />
      ) : (
        <ul className="link-list">
          {todays.map((b) => (
            <li key={b.batch_id}>
              <Link to={`/${role}/batches/${b.batch_id}`}><strong>{byKey(courses, 'course_id', b.course_id)?.course_Name}</strong></Link>
              <span className="muted">{hhmm(b.start_time)} – {hhmm(b.end_time)} · {b.venue || 'Venue not set'}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
