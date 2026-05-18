import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import type { TrieState } from '../../../domain/trie';

type Pos = { id: string; x: number; y: number; char: string; end: boolean };

function layoutTrie(state: TrieState): { positions: Pos[]; edges: Array<[Pos, Pos]>; width: number; height: number } {
  const positions: Pos[] = [];
  const idToPos = new Map<string, Pos>();
  let counter = 0;
  const walk = (id: string, depth: number) => {
    const n = state.nodes[id];
    const childIds = Object.values(n.children);
    childIds.forEach((c) => walk(c, depth + 1));
    const x = childIds.length
      ? (idToPos.get(childIds[0])!.x + idToPos.get(childIds[childIds.length - 1])!.x) / 2
      : counter * 60 + 40;
    if (!childIds.length) counter += 1;
    const p: Pos = { id, x, y: depth * 80 + 40, char: n.char || 'root', end: n.end };
    positions.push(p);
    idToPos.set(id, p);
  };
  walk(state.root, 0);
  const edges: Array<[Pos, Pos]> = [];
  for (const p of positions) {
    const n = state.nodes[p.id];
    for (const c of Object.values(n.children)) {
      edges.push([p, idToPos.get(c)!]);
    }
  }
  const width = Math.max(400, counter * 60 + 80);
  const height = Math.max(160, positions.reduce((m, p) => Math.max(m, p.y), 0) + 80);
  return { positions, edges, width, height };
}

export function TrieCanvas() {
  const state = useStore(store, (s) => s.state) as TrieState;
  const event = useStore(store, (s) => s.event);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const { positions, edges, width, height } = layoutTrie(state);

  return (
    <svg className="canvas-svg" viewBox={`0 0 ${width} ${height}`} width="100%">
      {edges.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="edge" />
      ))}
      {positions.map((p) => {
        const cls = `${affected.has(p.id) ? 'node affected' : onPath.has(p.id) ? 'node path' : 'node'}${p.end ? ' end' : ''}`;
        return (
          <g key={p.id} className={cls} transform={`translate(${p.x - 20},${p.y - 20})`}>
            <circle cx={20} cy={20} r={20} />
            <text x={20} y={25} textAnchor="middle">
              {p.char}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
