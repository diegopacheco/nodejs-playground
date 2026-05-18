import { type OpResult, emptyEvent, nextId } from './types';

export type DllNode = {
  id: string;
  value: number;
  prev: string | null;
  next: string | null;
};

export type DllState = {
  nodes: Record<string, DllNode>;
  head: string | null;
  tail: string | null;
};

export function create(): DllState {
  return { nodes: {}, head: null, tail: null };
}

export function insert(state: DllState, value: number): OpResult<DllState> {
  const id = nextId('dll');
  const node: DllNode = { id, value, prev: state.tail, next: null };
  const nodes = { ...state.nodes, [id]: node };
  if (state.tail) {
    nodes[state.tail] = { ...nodes[state.tail], next: id };
  }
  const next: DllState = {
    nodes,
    head: state.head ?? id,
    tail: id,
  };
  return { state: next, event: { op: 'insert', ok: true, affected: [id], path: [] } };
}

export function find(state: DllState, value: number): OpResult<DllState> {
  const path: string[] = [];
  let cur = state.head;
  while (cur) {
    path.push(cur);
    if (state.nodes[cur].value === value) {
      return { state, event: { op: 'find', ok: true, affected: [cur], path } };
    }
    cur = state.nodes[cur].next;
  }
  return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
}

export function update(state: DllState, oldValue: number, newValue: number): OpResult<DllState> {
  const found = find(state, oldValue);
  if (!found.event.ok) return { state, event: emptyEvent('update', false, 'not found') };
  const id = found.event.affected[0];
  const nodes = { ...state.nodes, [id]: { ...state.nodes[id], value: newValue } };
  return {
    state: { ...state, nodes },
    event: { op: 'update', ok: true, affected: [id], path: found.event.path },
  };
}

export function remove(state: DllState, value: number): OpResult<DllState> {
  const found = find(state, value);
  if (!found.event.ok) return { state, event: emptyEvent('delete', false, 'not found') };
  const id = found.event.affected[0];
  const node = state.nodes[id];
  const nodes: Record<string, DllNode> = { ...state.nodes };
  if (node.prev) nodes[node.prev] = { ...nodes[node.prev], next: node.next };
  if (node.next) nodes[node.next] = { ...nodes[node.next], prev: node.prev };
  delete nodes[id];
  const head = state.head === id ? node.next : state.head;
  const tail = state.tail === id ? node.prev : state.tail;
  return {
    state: { nodes, head, tail },
    event: { op: 'delete', ok: true, affected: [id], path: found.event.path },
  };
}

export function toList(state: DllState): DllNode[] {
  const out: DllNode[] = [];
  let cur = state.head;
  while (cur) {
    out.push(state.nodes[cur]);
    cur = state.nodes[cur].next;
  }
  return out;
}
