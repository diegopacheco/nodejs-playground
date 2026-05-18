import { type OpResult, emptyEvent, nextId } from './types';

export type GraphNode = { id: string; value: number };
export type GraphState = {
  nodes: Record<string, GraphNode>;
  order: string[];
  edges: Array<[string, string]>;
};

export function create(): GraphState {
  return { nodes: {}, order: [], edges: [] };
}

export function insert(state: GraphState, value: number): OpResult<GraphState> {
  const id = nextId('g');
  const node = { id, value };
  const nodes = { ...state.nodes, [id]: node };
  const order = [...state.order, id];
  const edges = state.edges.slice();
  if (state.order.length > 0) {
    const prev = state.order[state.order.length - 1];
    edges.push([prev, id]);
  }
  return {
    state: { nodes, order, edges },
    event: { op: 'insert', ok: true, affected: [id], path: [] },
  };
}

export function find(state: GraphState, value: number): OpResult<GraphState> {
  if (state.order.length === 0) {
    return { state, event: { op: 'find', ok: false, affected: [], path: [], message: 'empty' } };
  }
  const start = state.order[0];
  const adj: Record<string, string[]> = {};
  for (const id of state.order) adj[id] = [];
  for (const [a, b] of state.edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const seen = new Set<string>([start]);
  const queue = [start];
  const path: string[] = [];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    path.push(cur);
    if (state.nodes[cur].value === value) {
      return { state, event: { op: 'find', ok: true, affected: [cur], path } };
    }
    for (const nb of adj[cur]) {
      if (!seen.has(nb)) {
        seen.add(nb);
        queue.push(nb);
      }
    }
  }
  return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
}

export function update(state: GraphState, oldValue: number, newValue: number): OpResult<GraphState> {
  const f = find(state, oldValue);
  if (!f.event.ok) return { state, event: emptyEvent('update', false, 'not found') };
  const id = f.event.affected[0];
  const nodes = { ...state.nodes, [id]: { ...state.nodes[id], value: newValue } };
  return {
    state: { ...state, nodes },
    event: { op: 'update', ok: true, affected: [id], path: f.event.path },
  };
}

export function remove(state: GraphState, value: number): OpResult<GraphState> {
  const f = find(state, value);
  if (!f.event.ok) return { state, event: emptyEvent('delete', false, 'not found') };
  const id = f.event.affected[0];
  const nodes = { ...state.nodes };
  delete nodes[id];
  const order = state.order.filter((x) => x !== id);
  const edges = state.edges.filter(([a, b]) => a !== id && b !== id);
  return {
    state: { nodes, order, edges },
    event: { op: 'delete', ok: true, affected: [id], path: f.event.path },
  };
}
