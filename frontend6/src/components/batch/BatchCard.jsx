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
          <h3 className="batch-card__title">{course?.Course_Name || 'Course'}</h3>
          <span className="muted small">{course?.Category}</span>
        </div>
        {badges && <div className="batch-card__badges">{badges}</div>}
      </div>
      <ul className="batch-card__meta">
        <li><Icon name="clock" size={14} /> {hhmm(batch.Start_time)} – {hhmm(batch.End_time)} · {shortDays(days)}</li>
        <li><Icon name="pin" size={14} /> {batch.Venue || 'Venue not set'}</li>
        {teacher !== undefined && <li><Icon name="user" size={14} /> {teacher ? `${teacher.First_name} ${teacher.Last_name || ''}`.trim() : 'No teacher assigned'}</li>}
      </ul>
      <ProgressBar value={Math.min(batch.Modules_Completed || 0, course?.No_of_modules ?? (batch.Modules_Completed || 0))} max={course?.No_of_modules || 0} suffix="modules" />
      {footer}
    </Link>
  );
}
