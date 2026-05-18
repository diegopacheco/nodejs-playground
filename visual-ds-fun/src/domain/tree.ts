import { type OpResult, emptyEvent, nextId } from './types';

export type TreeNode = {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
};

export type TreeState = {
  nodes: Record<string, TreeNode>;
  root: string | null;
};

export function create(): TreeState {
  return { nodes: {}, root: null };
}

export function insert(state: TreeState, value: number): OpResult<TreeState> {
  const id = nextId('t');
  const node: TreeNode = { id, value, left: null, right: null };
  const nodes = { ...state.nodes, [id]: node };
  if (!state.root) {
    return {
      state: { nodes, root: id },
      event: { op: 'insert', ok: true, affected: [id], path: [] },
    };
  }
  const path: string[] = [];
  let curId = state.root;
  while (true) {
    path.push(curId);
    const cur = nodes[curId];
    if (value === cur.value) {
      return { state, event: emptyEvent('insert', false, 'duplicate') };
    }
    if (value < cur.value) {
      if (cur.left) {
        curId = cur.left;
      } else {
        nodes[curId] = { ...cur, left: id };
        break;
      }
    } else {
      if (cur.right) {
        curId = cur.right;
      } else {
        nodes[curId] = { ...cur, right: id };
        break;
      }
    }
  }
  return {
    state: { nodes, root: state.root },
    event: { op: 'insert', ok: true, affected: [id], path },
  };
}

export function find(state: TreeState, value: number): OpResult<TreeState> {
  const path: string[] = [];
  let curId = state.root;
  while (curId) {
    path.push(curId);
    const cur = state.nodes[curId];
    if (value === cur.value) {
      return { state, event: { op: 'find', ok: true, affected: [curId], path } };
    }
    curId = value < cur.value ? cur.left : cur.right;
  }
  return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
}

export function update(state: TreeState, oldValue: number, newValue: number): OpResult<TreeState> {
  const found = find(state, oldValue);
  if (!found.event.ok) return { state, event: emptyEvent('update', false, 'not found') };
  const removed = remove(state, oldValue);
  const inserted = insert(removed.state, newValue);
  if (!inserted.event.ok) return { state, event: emptyEvent('update', false, 'duplicate') };
  return {
    state: inserted.state,
    event: { op: 'update', ok: true, affected: inserted.event.affected, path: found.event.path },
  };
}

function minId(state: TreeState, id: string): string {
  let curId = id;
  while (state.nodes[curId].left) curId = state.nodes[curId].left!;
  return curId;
}

export function remove(state: TreeState, value: number): OpResult<TreeState> {
  const found = find(state, value);
  if (!found.event.ok) return { state, event: emptyEvent('delete', false, 'not found') };
  const nodes = { ...state.nodes };
  const removeRec = (id: string | null, v: number): string | null => {
    if (!id) return null;
    const n = nodes[id];
    if (v < n.value) {
      nodes[id] = { ...n, left: removeRec(n.left, v) };
      return id;
    }
    if (v > n.value) {
      nodes[id] = { ...n, right: removeRec(n.right, v) };
      return id;
    }
    if (!n.left) {
      const r = n.right;
      delete nodes[id];
      return r;
    }
    if (!n.right) {
      const l = n.left;
      delete nodes[id];
      return l;
    }
    const succId = minId({ nodes, root: state.root }, n.right);
    const succVal = nodes[succId].value;
    nodes[id] = { ...n, value: succVal, right: removeRec(n.right, succVal) };
    return id;
  };
  const root = removeRec(state.root, value);
  return {
    state: { nodes, root },
    event: { op: 'delete', ok: true, affected: found.event.affected, path: found.event.path },
  };
}
