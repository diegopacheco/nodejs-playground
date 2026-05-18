import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import type { QueueState } from '../../../domain/queue';

const W = 80;
const GAP = 20;
const H = 50;

export function QueueCanvas() {
  const state = useStore(store, (s) => s.state) as QueueState;
  const event = useStore(store, (s) => s.event);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const width = Math.max(420, state.items.length * (W + GAP) + 120);

  return (
    <svg className="canvas-svg" viewBox={`0 0 ${width} 140`} width="100%">
      <text x={20} y={45} className="label">
        front
      </text>
      <text x={width - 20} y={45} textAnchor="end" className="label">
        back
      </text>
      {state.items.map((it, i) => {
        const x = 60 + i * (W + GAP);
        const cls = affected.has(it.id) ? 'node affected' : onPath.has(it.id) ? 'node path' : 'node';
        return (
          <g key={it.id} className={cls} transform={`translate(${x},60)`}>
            <rect width={W} height={H} rx={6} />
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle">
              {it.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
