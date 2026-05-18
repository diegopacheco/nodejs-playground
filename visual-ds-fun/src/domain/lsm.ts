import { type OpResult, emptyEvent, nextId } from './types';

export type LsmEntry = { id: string; key: number; value: number; tombstone: boolean };
export type LsmLevel = { id: string; entries: LsmEntry[] };

export type LsmState = {
  memtable: LsmEntry[];
  levels: LsmLevel[];
  memCap: number;
};

const MEM_CAP = 3;

export function create(): LsmState {
  return { memtable: [], levels: [], memCap: MEM_CAP };
}

function flushIfNeeded(state: LsmState): LsmState {
  if (state.memtable.length < state.memCap) return state;
  const sorted = state.memtable.slice().sort((a, b) => a.key - b.key);
  const level: LsmLevel = { id: nextId('lvl'), entries: sorted };
  return { ...state, memtable: [], levels: [level, ...state.levels] };
}

export function insert(state: LsmState, key: number, value: number): OpResult<LsmState> {
  const entry: LsmEntry = { id: nextId('e'), key, value, tombstone: false };
  let next: LsmState = { ...state, memtable: [...state.memtable, entry] };
  next = flushIfNeeded(next);
  return { state: next, event: { op: 'insert', ok: true, affected: [entry.id], path: [] } };
}

export function find(state: LsmState, key: number): OpResult<LsmState> {
  const path: string[] = [];
  for (let i = state.memtable.length - 1; i >= 0; i -= 1) {
    const e = state.memtable[i];
    path.push(e.id);
    if (e.key === key) {
      const ok = !e.tombstone;
      return { state, event: { op: 'find', ok, affected: ok ? [e.id] : [], path, message: ok ? undefined : 'tombstoned' } };
    }
  }
  for (const lvl of state.levels) {
    for (const e of lvl.entries) {
      path.push(e.id);
      if (e.key === key) {
        const ok = !e.tombstone;
        return { state, event: { op: 'find', ok, affected: ok ? [e.id] : [], path, message: ok ? undefined : 'tombstoned' } };
      }
    }
  }
  return { state, event: { op: 'find', ok: false, affected: [], path, message: 'not found' } };
}

export function update(state: LsmState, key: number, newValue: number): OpResult<LsmState> {
  const f = find(state, key);
  if (!f.event.ok) return { state, event: emptyEvent('update', false, 'not found') };
  const ins = insert(state, key, newValue);
  return {
    state: ins.state,
    event: { op: 'update', ok: true, affected: ins.event.affected, path: f.event.path },
  };
}

export function remove(state: LsmState, key: number): OpResult<LsmState> {
  const f = find(state, key);
  if (!f.event.ok) return { state, event: emptyEvent('delete', false, 'not found') };
  const entry: LsmEntry = { id: nextId('e'), key, value: 0, tombstone: true };
  let next: LsmState = { ...state, memtable: [...state.memtable, entry] };
  next = flushIfNeeded(next);
  return {
    state: next,
    event: { op: 'delete', ok: true, affected: [entry.id], path: f.event.path },
  };
}
