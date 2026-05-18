import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import type { BPlusState } from '../../../domain/bplus';

type Pos = { id: string; x: number; y: number; keys: number[]; leaf: boolean; width: number };

function layoutBPlus(state: BPlusState): { positions: Pos[]; edges: Array<[Pos, Pos]>; width: number; height: number } {
  const levels: string[][] = [];
  const fill = (id: string, depth: number) => {
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(id);
    const n = state.nodes[id];
    if (!n.leaf) n.children.forEach((c) => fill(c, depth + 1));
  };
  fill(state.root, 0);
  const positions: Pos[] = [];
  const idToPos = new Map<string, Pos>();
  const cellW = 32;
  const pad = 10;
  const gap = 30;
  let canvasWidth = 0;
  levels.forEach((ids, depth) => {
    let x = 20;
    ids.forEach((id) => {
      const n = state.nodes[id];
      const w = Math.max(cellW, n.keys.length * cellW) + pad * 2;
      const p: Pos = { id, x: x + w / 2, y: depth * 90 + 40, keys: n.keys, leaf: n.leaf, width: w };
      positions.push(p);
      idToPos.set(id, p);
      x += w + gap;
    });
    canvasWidth = Math.max(canvasWidth, x);
  });
  const edges: Array<[Pos, Pos]> = [];
  for (const p of positions) {
    const n = state.nodes[p.id];
    n.children.forEach((c) => edges.push([p, idToPos.get(c)!]));
  }
  return {
    positions,
    edges,
    width: Math.max(400, canvasWidth + 20),
    height: levels.length * 90 + 40,
  };
}

export function BPlusCanvas() {
  const state = useStore(store, (s) => s.state) as BPlusState;
  const event = useStore(store, (s) => s.event);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const { positions, edges, width, height } = layoutBPlus(state);

  return (
    <svg className="canvas-svg" viewBox={`0 0 ${width} ${height}`} width="100%">
      {edges.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y + 18} x2={b.x} y2={b.y - 18} className="edge" />
      ))}
      {positions.map((p) => {
        const cls = `${affected.has(p.id) ? 'node affected' : onPath.has(p.id) ? 'node path' : 'node'}${p.leaf ? ' leaf' : ''}`;
        return (
          <g key={p.id} className={cls} transform={`translate(${p.x - p.width / 2},${p.y - 18})`}>
            <rect width={p.width} height={36} rx={4} />
            <text x={p.width / 2} y={22} textAnchor="middle">
              [{p.keys.join(',')}]
            </text>
          </g>
        );
      })}
    </svg>
  );
}
