import { useStore } from '@tanstack/react-store';
import { store } from '../../store';
import type { LsmState } from '../../../domain/lsm';

const W = 70;
const GAP = 10;
const H = 44;

export function LsmCanvas() {
  const state = useStore(store, (s) => s.state) as LsmState;
  const event = useStore(store, (s) => s.event);
  const affected = new Set(event?.affected ?? []);
  const onPath = new Set(event?.path ?? []);
  const rows = 1 + state.levels.length;
  const maxCols = Math.max(
    state.memtable.length,
    ...state.levels.map((l) => l.entries.length),
    1,
  );
  const width = Math.max(420, maxCols * (W + GAP) + 120);
  const height = rows * 70 + 30;

  const renderRow = (label: string, entries: { id: string; key: number; value: number; tombstone: boolean }[], y: number) => (
    <g transform={`translate(0,${y})`}>
      <text x={10} y={H / 2 + 5} className="label">
        {label}
      </text>
      {entries.map((e, i) => {
        const cls = affected.has(e.id) ? 'node affected' : onPath.has(e.id) ? 'node path' : 'node';
        return (
          <g key={e.id} className={`${cls}${e.tombstone ? ' tombstone' : ''}`} transform={`translate(${100 + i * (W + GAP)},0)`}>
            <rect width={W} height={H} rx={4} />
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle">
              {e.key}={e.tombstone ? '∅' : e.value}
            </text>
          </g>
        );
      })}
    </g>
  );

  return (
    <svg className="canvas-svg" viewBox={`0 0 ${width} ${height}`} width="100%">
      {renderRow('mem', state.memtable, 20)}
      {state.levels.map((lvl, li) => renderRow(`L${li}`, lvl.entries, 20 + (li + 1) * 70))}
    </svg>
  );
}
