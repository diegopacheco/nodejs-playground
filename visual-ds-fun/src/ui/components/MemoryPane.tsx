import { useStore } from '@tanstack/react-store';
import { store } from '../store';
import { layout } from '../../memory/layout';

export function MemoryPane() {
  const kind = useStore(store, (s) => s.kind);
  const state = useStore(store, (s) => s.state);
  const event = useStore(store, (s) => s.event);
  const cells = layout(kind, state);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);

  return (
    <div className="mem-pane">
      <h3>Memory</h3>
      <table className="mem-table">
        <thead>
          <tr>
            <th>addr</th>
            <th>label</th>
            <th>value</th>
            <th>refs</th>
          </tr>
        </thead>
        <tbody>
          {cells.map((c) => {
            const cls = affected.has(c.id) ? 'affected' : onPath.has(c.id) ? 'path' : '';
            return (
              <tr key={c.id} className={cls}>
                <td>{c.address}</td>
                <td>{c.label}</td>
                <td>{c.value}</td>
                <td>
                  {c.refs.map((r, i) => (
                    <span key={i} className="ref">
                      {r.name}→{r.target ? r.target : 'null'}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
          {cells.length === 0 && (
            <tr>
              <td colSpan={4} className="empty">
                (empty)
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
