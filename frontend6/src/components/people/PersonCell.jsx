import Avatar from '@/components/ui/Avatar';
import { fullName } from '@/utils/format';

/** Avatar + name (+ a second line). Pass `middle` (array) to include middle names. */
export default function PersonCell({ person, sub, size = 34, middle }) {
  if (!person) return <span className="muted">Unknown</span>;
  return (
    <div className="person">
      <Avatar person={person} size={size} />
      <div className="grow">
        <div className="person__name">{fullName(person, middle)}</div>
        {sub !== null && <div className="person__sub">{sub ?? person.Email}</div>}
      </div>
    </div>
  );
}
