import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResources } from '@/hooks/useResources';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { gate } from '@/components/ui/Async';
import Icon from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, money, timeRange, today } from '@/utils/format';

/** Public course catalog: a card per category; choosing one lists all of its courses. */
export default function Catalog() {
  useDocumentTitle('Course catalog');
  const [params, setParams] = useSearchParams();
  const s = useResources(['course', 'batch', 'schedule']);
  const selected = params.get('category') || '';

  const categories = useMemo(() => {
    if (s.loading || s.error) return [];
    const map = new Map();
    s.d.course.forEach((c) => map.set(c.category, (map.get(c.category) || 0) + 1));
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [s]);

  const g = gate(s);
  if (g) return <div className="container page-public">{g}</div>;

  const courses = s.d.course.filter((c) => c.category === selected).sort((a, b) => a.course_Name.localeCompare(b.course_Name));

  const nextBatch = (courseId) => {
    const upcoming = s.d.batch.filter((b) => b.course_id === courseId && (b.start_date || '') >= today()).sort((a, b) => a.start_date.localeCompare(b.start_date))[0];
    if (!upcoming) return null;
    const days = s.d.schedule.filter((x) => x.batch_id === upcoming.batch_id).map((x) => x.day.slice(0, 3));
    return { ...upcoming, days };
  };

  return (
    <div className="container page-public">
      <h1>Course catalog</h1>
      <p className="lead">Choose a category to see the courses we teach in it.</p>

      {categories.length === 0 ? (
        <EmptyState icon="book" title="No courses published yet" text="Check back soon, or visit the institute for the latest offerings." />
      ) : (
        <div className="grid-3" role="list">
          {categories.map(([name, count]) => (
            <button
              key={name}
              type="button"
              role="listitem"
              className={`category-card category-card--btn ${selected === name ? 'is-selected' : ''}`}
              aria-pressed={selected === name}
              onClick={() => setParams(selected === name ? {} : { category: name })}
            >
              <span className="category-card__icon"><Icon name="book" size={22} /></span>
              <h3>{name}</h3>
              <span className="muted small">{count} course{count === 1 ? '' : 's'}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <section aria-live="polite">
          <h2 className="section__title">{selected}</h2>
          {courses.length === 0 ? (
            <EmptyState title="No courses in this category" />
          ) : (
            <div className="grid-3">
              {courses.map((c) => {
                const nb = nextBatch(c.course_id);
                return (
                  <Card key={c.course_id} className="course-card" title={c.course_Name}>
                    <p className="muted">{c.description || 'Details will be shared at the institute.'}</p>
                    <div className="tags">
                      {c.no_of_modules != null && <Badge>{c.no_of_modules} modules</Badge>}
                      {c.no_of_weeks != null && <Badge>{c.no_of_weeks} weeks</Badge>}
                      {c.material && <Badge tone="info">Study material</Badge>}
                    </div>
                    <div className="course-card__foot">
                      <strong className="course-card__price">{c.price != null ? money(c.price) : 'Fee on request'}</strong>
                      <span className="small muted">
                        {nb ? `Next batch ${formatDate(nb.start_date)}${nb.days.length ? ` · ${nb.days.join(', ')}` : ''} · ${timeRange(nb)}` : 'New batch dates coming soon'}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
