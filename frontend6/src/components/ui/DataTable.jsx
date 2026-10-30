import { useEffect, useMemo, useState } from 'react';
import Button from './Button';
import EmptyState from './EmptyState';

/**
 * columns: [{ key, header, render?(row, i), sortValue?(row), align: 'num'|'right', className, actions }]
 * Columns with `sortValue` (or a plain `key`) can be sorted by clicking their header.
 */
export default function DataTable({ columns, rows, rowKey, empty, pageSize = 10, initialSort, stack = true, footer, dense }) {
  const [sort, setSort] = useState(initialSort || null); // { key, dir }
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = col.sortValue || ((r) => r[col.key]);
    const out = [...rows].sort((a, b) => {
      const x = val(a); const y = val(b);
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      if (typeof x === 'number' && typeof y === 'number') return x - y;
      return String(x).localeCompare(String(y), undefined, { numeric: true, sensitivity: 'base' });
    });
    return sort.dir === 'desc' ? out.reverse() : out;
  }, [rows, sort, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => { if (page > pages - 1) setPage(pages - 1); }, [pages, page]);
  const view = pageSize ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;

  if (!rows.length) return empty || <EmptyState title="Nothing here yet" />;

  const toggle = (c) => {
    if (!(c.sortValue || c.key) || c.actions) return;
    setSort((s) => (s?.key === c.key ? (s.dir === 'asc' ? { key: c.key, dir: 'desc' } : null) : { key: c.key, dir: 'asc' }));
  };

  return (
    <div>
      <div className="table-wrap">
        <table className={`table ${stack ? 'table--stack' : ''} ${dense ? 'table--dense' : ''}`}>
          <thead>
            <tr>
              {columns.map((c) => {
                const sortable = !c.actions && (c.sortValue || c.key);
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key || c.header}
                    className={`${sortable ? 'sortable' : ''} ${c.align === 'num' ? 'num' : ''}`}
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    onClick={() => toggle(c)}
                  >
                    {c.header}{active ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={rowKey ? rowKey(r) : i}>
                {columns.map((c) => (
                  <td
                    key={c.key || c.header}
                    data-label={typeof c.header === 'string' ? c.header : undefined}
                    className={`${c.align === 'num' ? 'num' : ''} ${c.actions ? 'cell-actions-td' : ''} ${c.className || ''}`}
                  >
                    {c.actions ? <div className="cell-actions">{c.render(r, i)}</div> : c.render ? c.render(r, page * pageSize + i) : r[c.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(pages > 1 || footer) && (
        <div className="table-footer">
          <span>{footer || `${sorted.length} rows`}</span>
          {pages > 1 && (
            <div className="row">
              <Button variant="subtle" size="sm" icon="chevronLeft" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page" />
              <span>Page {page + 1} of {pages}</span>
              <Button variant="subtle" size="sm" icon="chevronRight" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next page" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
