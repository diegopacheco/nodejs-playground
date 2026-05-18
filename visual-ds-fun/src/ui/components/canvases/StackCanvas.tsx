import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import type { StackState } from '../../../domain/stack';

const W = 120;
const H = 44;

export function StackCanvas() {
  const state = useStore(store, (s) => s.state) as StackState;
  const event = useStore(store, (s) => s.event);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const total = state.items.length;
  const height = Math.max(200, total * (H + 8) + 80);

  return (
    <svg className="canvas-svg" viewBox={`0 0 320 ${height}`} width="100%">
      {state.items.map((it, i) => {
        const fromTop = total - 1 - i;
        const y = 40 + fromTop * (H + 8);
        const cls = affected.has(it.id) ? 'node affected' : onPath.has(it.id) ? 'node path' : 'node';
        return (
          <g key={it.id} className={cls} transform={`translate(100,${y})`}>
            <rect width={W} height={H} rx={6} />
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle">
              {it.value}
            </text>
            {i === total - 1 && (
              <text x={-12} y={H / 2 + 5} textAnchor="end" className="label">
                top →
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
