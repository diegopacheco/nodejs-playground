import { type OpResult, emptyEvent, nextId } from './types';

export type QueueItem = { id: string; value: number };
export type QueueState = { items: QueueItem[] };

export function create(): QueueState {
  return { items: [] };
}

export function insert(state: QueueState, value: number): OpResult<QueueState> {
  const item = { id: nextId('q'), value };
  return {
    state: { items: [...state.items, item] },
    event: { op: 'insert', ok: true, affected: [item.id], path: [] },
  };
}

export function find(state: QueueState, value: number): OpResult<QueueState> {
  const path: string[] = [];
  for (const it of state.items) {
    path.push(it.id);
    if (it.value === value) {
      return { state, event: { op: 'find', ok: true, affected: [it.id], path } };
    }
  }
  return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
}

export function update(state: QueueState, oldValue: number, newValue: number): OpResult<QueueState> {
  const idx = state.items.findIndex((i) => i.value === oldValue);
  if (idx === -1) return { state, event: emptyEvent('update', false, 'not found') };
  const items = state.items.slice();
  items[idx] = { ...items[idx], value: newValue };
  return {
    state: { items },
    event: { op: 'update', ok: true, affected: [items[idx].id], path: [] },
  };
}

export function remove(state: QueueState): OpResult<QueueState> {
  if (state.items.length === 0) return { state, event: emptyEvent('delete', false, 'empty') };
  const head = state.items[0];
  return {
    state: { items: state.items.slice(1) },
    event: { op: 'delete', ok: true, affected: [head.id], path: [] },
  };
}
