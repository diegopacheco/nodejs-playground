export type Op = 'insert' | 'update' | 'find' | 'delete';

export type OpEvent = {
  op: Op;
  ok: boolean;
  affected: string[];
  path: string[];
  message?: string;
};

export type DsKind =
  | 'dll'
  | 'stack'
  | 'queue'
  | 'graph'
  | 'tree'
  | 'trie'
  | 'lsm'
  | 'bplus';

export type OpResult<S> = { state: S; event: OpEvent };

export function emptyEvent(op: Op, ok: boolean, message?: string): OpEvent {
  return { op, ok, affected: [], path: [], message };
}

let counter = 0;
export function nextId(prefix = 'n'): string {
  counter += 1;
  return `${prefix}${counter}`;
}

export function resetIdsForTests(): void {
  counter = 0;
}
