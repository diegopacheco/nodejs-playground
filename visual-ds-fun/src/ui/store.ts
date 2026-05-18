import { Store } from '@tanstack/store';
import type { DsKind, OpEvent } from '../domain/types';
import { registry } from './registry';

export type AppState = {
  kind: DsKind;
  state: unknown;
  event: OpEvent | null;
  speed: number;
};

export const store = new Store<AppState>({
  kind: 'stack',
  state: registry.stack.create(),
  event: null,
  speed: 1,
});

export function selectKind(kind: DsKind) {
  store.setState((s) => ({ ...s, kind, state: registry[kind].create(), event: null }));
}

export function setSpeed(speed: number) {
  store.setState((s) => ({ ...s, speed }));
}

export function reset() {
  store.setState((s) => ({ ...s, state: registry[s.kind].create(), event: null }));
}

export function doInsert(value: string) {
  const cur = store.state;
  const r = registry[cur.kind].insert(cur.state, value);
  store.setState((s) => ({ ...s, state: r.state, event: r.event }));
}

export function doFind(value: string) {
  const cur = store.state;
  const r = registry[cur.kind].find(cur.state, value);
  store.setState((s) => ({ ...s, state: r.state, event: r.event }));
}

export function doUpdate(oldValue: string, newValue: string) {
  const cur = store.state;
  const r = registry[cur.kind].update(cur.state, oldValue, newValue);
  store.setState((s) => ({ ...s, state: r.state, event: r.event }));
}

export function doDelete(value: string) {
  const cur = store.state;
  const r = registry[cur.kind].remove(cur.state, value);
  store.setState((s) => ({ ...s, state: r.state, event: r.event }));
}
