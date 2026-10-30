import { Link } from 'react-router-dom';
import { byKey, hhmm } from '@/utils/format';
import { daysOf, todayName } from '@/utils/batch';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

/** "Classes today": batches whose Schedule includes today's weekday, ordered by start time. */
export default function TodayClasses({ role, batches, courses, schedule }) {
  const name = todayName();
  const todays = batches
    .filter((b) => daysOf(schedule, b.Batch_id).includes(name))
    .sort((a, b) => String(a.Start_time).localeCompare(String(b.Start_time)));
  return (
    <Card title={`Classes today (${name})`}>
      {todays.length === 0 ? (
        <EmptyState icon="calendar" title="No classes today" text="Nothing is scheduled for today." />
      ) : (
        <ul className="link-list">
          {todays.map((b) => (
            <li key={b.Batch_id}>
              <Link to={`/${role}/batches/${b.Batch_id}`}><strong>{byKey(courses, 'Course_id', b.Course_id)?.Course_Name}</strong></Link>
              <span className="muted">{hhmm(b.Start_time)} – {hhmm(b.End_time)} · {b.Venue || 'Venue not set'}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
