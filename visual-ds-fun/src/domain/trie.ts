import { type OpResult, emptyEvent, nextId } from './types';

export type TrieNode = {
  id: string;
  char: string;
  end: boolean;
  children: Record<string, string>;
};

export type TrieState = {
  nodes: Record<string, TrieNode>;
  root: string;
};

export function create(): TrieState {
  const root = nextId('tr');
  return {
    root,
    nodes: { [root]: { id: root, char: '', end: false, children: {} } },
  };
}

export function insert(state: TrieState, key: string): OpResult<TrieState> {
  if (!key) return { state, event: emptyEvent('insert', false, 'empty key') };
  const nodes = { ...state.nodes };
  const path: string[] = [state.root];
  const affected: string[] = [];
  let curId = state.root;
  for (const ch of key) {
    const cur = nodes[curId];
    let nextId_ = cur.children[ch];
    if (!nextId_) {
      nextId_ = nextId('tr');
      nodes[nextId_] = { id: nextId_, char: ch, end: false, children: {} };
      nodes[curId] = { ...cur, children: { ...cur.children, [ch]: nextId_ } };
      affected.push(nextId_);
    }
    path.push(nextId_);
    curId = nextId_;
  }
  nodes[curId] = { ...nodes[curId], end: true };
  if (!affected.includes(curId)) affected.push(curId);
  return {
    state: { root: state.root, nodes },
    event: { op: 'insert', ok: true, affected, path },
  };
}

export function find(state: TrieState, key: string): OpResult<TrieState> {
  const path: string[] = [state.root];
  let curId = state.root;
  for (const ch of key) {
    const next = state.nodes[curId].children[ch];
    if (!next) return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
    path.push(next);
    curId = next;
  }
  const ok = state.nodes[curId].end;
  return {
    state,
    event: { op: 'find', ok, affected: ok ? [curId] : [], path, message: ok ? undefined : 'prefix only' },
  };
}

export function update(state: TrieState, oldKey: string, newKey: string): OpResult<TrieState> {
  const f = find(state, oldKey);
  if (!f.event.ok) return { state, event: emptyEvent('update', false, 'not found') };
  const removed = remove(state, oldKey);
  const inserted = insert(removed.state, newKey);
  return {
    state: inserted.state,
    event: { op: 'update', ok: true, affected: inserted.event.affected, path: inserted.event.path },
  };
}

export function remove(state: TrieState, key: string): OpResult<TrieState> {
  const f = find(state, key);
  if (!f.event.ok) return { state, event: emptyEvent('delete', false, 'not found') };
  const nodes = { ...state.nodes };
  const path = f.event.path;
  const leafId = path[path.length - 1];
  nodes[leafId] = { ...nodes[leafId], end: false };
  for (let i = path.length - 1; i > 0; i -= 1) {
    const id = path[i];
    const n = nodes[id];
    if (n.end || Object.keys(n.children).length > 0) break;
    const parentId = path[i - 1];
    const parent = nodes[parentId];
    const childrenCopy = { ...parent.children };
    delete childrenCopy[n.char];
    nodes[parentId] = { ...parent, children: childrenCopy };
    delete nodes[id];
  }
  return {
    state: { root: state.root, nodes },
    event: { op: 'delete', ok: true, affected: [leafId], path },
  };
}
