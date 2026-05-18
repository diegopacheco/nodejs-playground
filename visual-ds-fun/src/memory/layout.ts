import type { DllState } from '../domain/dll';
import type { StackState } from '../domain/stack';
import type { QueueState } from '../domain/queue';
import type { TreeState } from '../domain/tree';
import type { TrieState } from '../domain/trie';
import type { GraphState } from '../domain/graph';
import type { LsmState } from '../domain/lsm';
import type { BPlusState } from '../domain/bplus';
import type { DsKind } from '../domain/types';

export type Cell = {
  id: string;
  address: string;
  label: string;
  value: string;
  refs: { name: string; target?: string }[];
};

const addr = (i: number) => `0x${(i + 1).toString(16).padStart(4, '0')}`;

function dllCells(s: DllState): Cell[] {
  const ids = Object.keys(s.nodes);
  return ids.map((id, i) => {
    const n = s.nodes[id];
    return {
      id,
      address: addr(i),
      label: 'Node',
      value: String(n.value),
      refs: [
        { name: 'prev', target: n.prev ?? undefined },
        { name: 'next', target: n.next ?? undefined },
      ],
    };
  });
}

function stackCells(s: StackState): Cell[] {
  return s.items.map((it, i) => ({
    id: it.id,
    address: addr(i),
    label: `[${i}]`,
    value: String(it.value),
    refs: [],
  }));
}

function queueCells(s: QueueState): Cell[] {
  return s.items.map((it, i) => ({
    id: it.id,
    address: addr(i),
    label: `[${i}]`,
    value: String(it.value),
    refs: [],
  }));
}

function treeCells(s: TreeState): Cell[] {
  const ids = Object.keys(s.nodes);
  return ids.map((id, i) => {
    const n = s.nodes[id];
    return {
      id,
      address: addr(i),
      label: 'Node',
      value: String(n.value),
      refs: [
        { name: 'left', target: n.left ?? undefined },
        { name: 'right', target: n.right ?? undefined },
      ],
    };
  });
}

function trieCells(s: TrieState): Cell[] {
  const ids = Object.keys(s.nodes);
  return ids.map((id, i) => {
    const n = s.nodes[id];
    return {
      id,
      address: addr(i),
      label: id === s.root ? 'Root' : 'Node',
      value: `'${n.char}'${n.end ? ' end' : ''}`,
      refs: Object.entries(n.children).map(([ch, t]) => ({ name: ch, target: t })),
    };
  });
}

function graphCells(s: GraphState): Cell[] {
  return s.order.map((id, i) => {
    const n = s.nodes[id];
    const adj = s.edges
      .filter(([a, b]) => a === id || b === id)
      .map(([a, b]) => (a === id ? b : a));
    return {
      id,
      address: addr(i),
      label: 'Node',
      value: String(n.value),
      refs: adj.map((t) => ({ name: 'adj', target: t })),
    };
  });
}

function lsmCells(s: LsmState): Cell[] {
  const cells: Cell[] = [];
  let i = 0;
  for (const e of s.memtable) {
    cells.push({
      id: e.id,
      address: addr(i++),
      label: 'mem',
      value: `${e.key}=${e.tombstone ? '∅' : e.value}`,
      refs: [],
    });
  }
  s.levels.forEach((lvl, li) => {
    for (const e of lvl.entries) {
      cells.push({
        id: e.id,
        address: addr(i++),
        label: `L${li}`,
        value: `${e.key}=${e.tombstone ? '∅' : e.value}`,
        refs: [],
      });
    }
  });
  return cells;
}

function bplusCells(s: BPlusState): Cell[] {
  const ids = Object.keys(s.nodes);
  return ids.map((id, i) => {
    const n = s.nodes[id];
    return {
      id,
      address: addr(i),
      label: n.leaf ? 'Leaf' : 'Internal',
      value: `[${n.keys.join(',')}]`,
      refs: [
        ...n.children.map((t) => ({ name: 'child', target: t })),
        ...(n.next ? [{ name: 'next', target: n.next }] : []),
      ],
    };
  });
}

export function layout(kind: DsKind, state: unknown): Cell[] {
  switch (kind) {
    case 'dll':
      return dllCells(state as DllState);
    case 'stack':
      return stackCells(state as StackState);
    case 'queue':
      return queueCells(state as QueueState);
    case 'tree':
      return treeCells(state as TreeState);
    case 'trie':
      return trieCells(state as TrieState);
    case 'graph':
      return graphCells(state as GraphState);
    case 'lsm':
      return lsmCells(state as LsmState);
    case 'bplus':
      return bplusCells(state as BPlusState);
  }
}
