import { type OpResult, emptyEvent, nextId } from './types';

export type BPlusNode = {
  id: string;
  leaf: boolean;
  keys: number[];
  children: string[];
  next: string | null;
};

export type BPlusState = {
  nodes: Record<string, BPlusNode>;
  root: string;
  order: number;
};

const ORDER = 3;

export function create(): BPlusState {
  const root = nextId('bp');
  return {
    nodes: { [root]: { id: root, leaf: true, keys: [], children: [], next: null } },
    root,
    order: ORDER,
  };
}

function findLeaf(state: BPlusState, key: number): { path: string[]; leafId: string } {
  const path: string[] = [];
  let curId = state.root;
  while (true) {
    path.push(curId);
    const node = state.nodes[curId];
    if (node.leaf) return { path, leafId: curId };
    let i = 0;
    while (i < node.keys.length && key >= node.keys[i]) i += 1;
    curId = node.children[i];
  }
}

export function find(state: BPlusState, key: number): OpResult<BPlusState> {
  const { path, leafId } = findLeaf(state, key);
  const leaf = state.nodes[leafId];
  const idx = leaf.keys.indexOf(key);
  if (idx === -1) {
    return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
  }
  return { state, event: { op: 'find', ok: true, affected: [leafId], path } };
}

export function insert(state: BPlusState, key: number): OpResult<BPlusState> {
  const f = find(state, key);
  if (f.event.ok) return { state, event: emptyEvent('insert', false, 'duplicate') };
  const nodes: Record<string, BPlusNode> = { ...state.nodes };
  const order = state.order;

  const insertInLeaf = (leafId: string, k: number): { promotedKey: number; rightId: string } | null => {
    const leaf = nodes[leafId];
    const keys = leaf.keys.slice();
    let i = 0;
    while (i < keys.length && keys[i] < k) i += 1;
    keys.splice(i, 0, k);
    if (keys.length < order) {
      nodes[leafId] = { ...leaf, keys };
      return null;
    }
    const mid = Math.ceil(keys.length / 2);
    const leftKeys = keys.slice(0, mid);
    const rightKeys = keys.slice(mid);
    const rightId = nextId('bp');
    nodes[rightId] = { id: rightId, leaf: true, keys: rightKeys, children: [], next: leaf.next };
    nodes[leafId] = { ...leaf, keys: leftKeys, next: rightId };
    return { promotedKey: rightKeys[0], rightId };
  };

  const insertInInternal = (
    nodeId: string,
    k: number,
    rightChildId: string,
  ): { promotedKey: number; rightId: string } | null => {
    const node = nodes[nodeId];
    const keys = node.keys.slice();
    const children = node.children.slice();
    let i = 0;
    while (i < keys.length && keys[i] < k) i += 1;
    keys.splice(i, 0, k);
    children.splice(i + 1, 0, rightChildId);
    if (keys.length < order) {
      nodes[nodeId] = { ...node, keys, children };
      return null;
    }
    const mid = Math.floor(keys.length / 2);
    const promoted = keys[mid];
    const leftKeys = keys.slice(0, mid);
    const rightKeys = keys.slice(mid + 1);
    const leftChildren = children.slice(0, mid + 1);
    const rightChildren = children.slice(mid + 1);
    const rightId = nextId('bp');
    nodes[rightId] = { id: rightId, leaf: false, keys: rightKeys, children: rightChildren, next: null };
    nodes[nodeId] = { ...node, keys: leftKeys, children: leftChildren };
    return { promotedKey: promoted, rightId };
  };

  const { path, leafId } = findLeaf(state, key);
  let split = insertInLeaf(leafId, key);
  for (let i = path.length - 2; i >= 0 && split; i -= 1) {
    split = insertInInternal(path[i], split.promotedKey, split.rightId);
  }
  let root = state.root;
  if (split) {
    const newRootId = nextId('bp');
    nodes[newRootId] = {
      id: newRootId,
      leaf: false,
      keys: [split.promotedKey],
      children: [state.root, split.rightId],
      next: null,
    };
    root = newRootId;
  }
  return {
    state: { nodes, root, order },
    event: { op: 'insert', ok: true, affected: [leafId], path },
  };
}

export function update(state: BPlusState, _oldKey: number, _newKey: number): OpResult<BPlusState> {
  return { state, event: emptyEvent('update', false, 'not supported; delete then insert') };
}

export function remove(state: BPlusState, key: number): OpResult<BPlusState> {
  const f = find(state, key);
  if (!f.event.ok) return { state, event: emptyEvent('delete', false, 'not found') };
  const nodes = { ...state.nodes };
  const leafId = f.event.affected[0];
  const leaf = nodes[leafId];
  const keys = leaf.keys.filter((k) => k !== key);
  nodes[leafId] = { ...leaf, keys };
  return {
    state: { ...state, nodes },
    event: { op: 'delete', ok: true, affected: [leafId], path: f.event.path },
  };
}
