import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import type { TreeState } from '../../../domain/tree';

type Pos = { id: string; x: number; y: number; value: number };

function layoutTree(state: TreeState): { positions: Pos[]; edges: Array<[Pos, Pos]>; width: number; height: number } {
  const positions: Pos[] = [];
  const idToPos = new Map<string, Pos>();
  let counter = 0;
  const inorder = (id: string | null, depth: number) => {
    if (!id) return;
    const n = state.nodes[id];
    inorder(n.left, depth + 1);
    const p: Pos = { id, x: counter * 70 + 40, y: depth * 80 + 40, value: n.value };
    counter += 1;
    positions.push(p);
    idToPos.set(id, p);
    inorder(n.right, depth + 1);
  };
  inorder(state.root, 0);
  const edges: Array<[Pos, Pos]> = [];
  for (const p of positions) {
    const n = state.nodes[p.id];
    if (n.left) edges.push([p, idToPos.get(n.left)!]);
    if (n.right) edges.push([p, idToPos.get(n.right)!]);
  }
  const width = Math.max(400, counter * 70 + 80);
  const height = Math.max(160, positions.reduce((m, p) => Math.max(m, p.y), 0) + 80);
  return { positions, edges, width, height };
}

export function TreeCanvas() {
  const state = useStore(store, (s) => s.state) as TreeState;
  const event = useStore(store, (s) => s.event);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const { positions, edges, width, height } = layoutTree(state);

  return (
    <svg className="canvas-svg" viewBox={`0 0 ${width} ${height}`} width="100%">
      {edges.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="edge" />
      ))}
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
