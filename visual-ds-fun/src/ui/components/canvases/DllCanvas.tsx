import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import { toList, type DllState } from '../../../domain/dll';

const W = 90;
const GAP = 30;
const H = 60;

export function DllCanvas() {
  const state = useStore(store, (s) => s.state) as DllState;
  const event = useStore(store, (s) => s.event);
  const list = toList(state);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const width = Math.max(400, list.length * (W + GAP) + GAP);

  return (
    <svg className="canvas-svg" viewBox={`0 0 ${width} 160`} width="100%">
      {list.map((n, i) => {
        const x = GAP + i * (W + GAP);
        const cls = affected.has(n.id) ? 'node affected' : onPath.has(n.id) ? 'node path' : 'node';
        return (
          <g key={n.id} className={cls} transform={`translate(${x},50)`}>
            <rect width={W} height={H} rx={8} />
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle">
              {n.value}
            </text>
            {i < list.length - 1 && (
              <>
                <line x1={W} y1={H / 2} x2={W + GAP} y2={H / 2} className="edge" markerEnd="url(#arrow)" />
                <line x1={W + GAP} y1={H / 2 + 10} x2={W} y2={H / 2 + 10} className="edge" markerEnd="url(#arrow)" />
              </>
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}
