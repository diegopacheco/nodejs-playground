import { type OpResult, emptyEvent, nextId } from './types';

export type StackItem = { id: string; value: number };
export type StackState = { items: StackItem[] };

export function create(): StackState {
  return { items: [] };
}

export function insert(state: StackState, value: number): OpResult<StackState> {
  const item = { id: nextId('s'), value };
  return {
    state: { items: [...state.items, item] },
    event: { op: 'insert', ok: true, affected: [item.id], path: [] },
  };
}

export function find(state: StackState, value: number): OpResult<StackState> {
  const path: string[] = [];
  for (let i = state.items.length - 1; i >= 0; i -= 1) {
    const it = state.items[i];
    path.push(it.id);
    if (it.value === value) {
      return { state, event: { op: 'find', ok: true, affected: [it.id], path } };
    }
  }
  return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
}

export function update(state: StackState, oldValue: number, newValue: number): OpResult<StackState> {
  const idx = state.items.findIndex((i) => i.value === oldValue);
  if (idx === -1) return { state, event: emptyEvent('update', false, 'not found') };
  const items = state.items.slice();
  items[idx] = { ...items[idx], value: newValue };
  return {
    state: { items },
    event: { op: 'update', ok: true, affected: [items[idx].id], path: [] },
  };
}

export function remove(state: StackState): OpResult<StackState> {
  if (state.items.length === 0) return { state, event: emptyEvent('delete', false, 'empty') };
  const top = state.items[state.items.length - 1];
  return {
    state: { items: state.items.slice(0, -1) },
    event: { op: 'delete', ok: true, affected: [top.id], path: [] },
  };
}
