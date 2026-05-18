import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import type { GraphState } from '../../../domain/graph';

export function GraphCanvas() {
  const state = useStore(store, (s) => s.state) as GraphState;
  const event = useStore(store, (s) => s.event);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const n = state.order.length;
  const cx = 220;
  const cy = 180;
  const r = Math.max(60, 20 * n);
  const positions = state.order.map((id, i) => {
    const angle = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
    return { id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), value: state.nodes[id].value };
  });
  const byId = new Map(positions.map((p) => [p.id, p]));
  const width = cx * 2;
  const height = cy * 2;

  return (
    <svg className="canvas-svg" viewBox={`0 0 ${width} ${height}`} width="100%">
      {state.edges.map(([a, b], i) => {
        const pa = byId.get(a);
        const pb = byId.get(b);
        if (!pa || !pb) return null;
        return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="edge" />;
      })}
      {positions.map((p) => {
        const cls = affected.has(p.id) ? 'node affected' : onPath.has(p.id) ? 'node path' : 'node';
        return (
          <g key={p.id} className={cls} transform={`translate(${p.x - 22},${p.y - 22})`}>
            <circle cx={22} cy={22} r={22} />
            <text x={22} y={27} textAnchor="middle">
              {p.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
