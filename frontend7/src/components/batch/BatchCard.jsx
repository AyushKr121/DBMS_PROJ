import { Link } from 'react-router-dom';
import { hhmm } from '@/utils/format';
import { shortDays } from '@/utils/batch';
import Icon from '@/components/ui/Icon';
import ProgressBar from '@/components/ui/ProgressBar';

/** Clickable summary of one batch. `to` opens that batch's own workspace. */
export default function BatchCard({ batch, course, teacher, days = [], badges, to, footer }) {
  return (
    <Link to={to} className="batch-card">
      <div className="batch-card__head">
        <div>
          <h3 className="batch-card__title">{course?.course_Name || 'Course'}</h3>
          <span className="muted small">{course?.category}</span>
        </div>
        {badges && <div className="batch-card__badges">{badges}</div>}
      </div>
      <ul className="batch-card__meta">
        <li><Icon name="clock" size={14} /> {hhmm(batch.start_time)} – {hhmm(batch.end_time)} · {shortDays(days)}</li>
        <li><Icon name="pin" size={14} /> {batch.venue || 'Venue not set'}</li>
        {teacher !== undefined && <li><Icon name="user" size={14} /> {teacher ? `${teacher.first_name} ${teacher.last_name || ''}`.trim() : 'No teacher assigned'}</li>}
      </ul>
      <ProgressBar value={Math.min(batch.modules_Completed || 0, course?.no_of_modules ?? (batch.modules_Completed || 0))} max={course?.no_of_modules || 0} suffix="modules" />
      {footer}
    </Link>
  );
}
