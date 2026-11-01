import { NavLink } from 'react-router-dom';

/** State tabs. tabs: [{ key, label, count? }] */
export function Tabs({ tabs, value, onChange, label = 'Sections' }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          className={`tabs__tab ${value === t.key ? 'is-active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}{t.count != null && <span className="tabs__count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Router tabs: tabs: [{ to, label, dot? }] (relative to the current route). */
export function TabNav({ tabs, label = 'Sections' }) {
  return (
    <nav className="tabnav" aria-label={label}>
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => `tabnav__link ${isActive ? 'is-active' : ''}`}>
          {t.label}{t.dot && <span className="dot" aria-label="new" />}
        </NavLink>
      ))}
    </nav>
  );
}
