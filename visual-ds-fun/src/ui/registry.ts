import type { DsKind, OpResult } from '../domain/types';
import * as dll from '../domain/dll';
import * as stack from '../domain/stack';
import * as queueD from '../domain/queue';
import * as tree from '../domain/tree';
import * as trie from '../domain/trie';
import * as graph from '../domain/graph';
import * as lsm from '../domain/lsm';
import * as bplus from '../domain/bplus';

export type DsAdapter = {
  create: () => unknown;
  insert: (state: unknown, value: string) => OpResult<unknown>;
  find: (state: unknown, value: string) => OpResult<unknown>;
  update: (state: unknown, oldValue: string, newValue: string) => OpResult<unknown>;
  remove: (state: unknown, value: string) => OpResult<unknown>;
  kindLabel: string;
  inputKind: 'number' | 'text' | 'kv';
};

const num = (s: string) => Number(s);

const numericAdapter = <S>(m: {
  create: () => S;
  insert: (s: S, v: number) => OpResult<S>;
  find: (s: S, v: number) => OpResult<S>;
  update: (s: S, a: number, b: number) => OpResult<S>;
  remove: (s: S, v: number) => OpResult<S>;
}, label: string): DsAdapter => ({
  create: () => m.create() as unknown,
  insert: (s, v) => m.insert(s as S, num(v)) as OpResult<unknown>,
  find: (s, v) => m.find(s as S, num(v)) as OpResult<unknown>,
  update: (s, a, b) => m.update(s as S, num(a), num(b)) as OpResult<unknown>,
  remove: (s, v) => m.remove(s as S, num(v)) as OpResult<unknown>,
  kindLabel: label,
  inputKind: 'number',
});

const stackAdapter: DsAdapter = {
  create: () => stack.create() as unknown,
  insert: (s, v) => stack.insert(s as stack.StackState, num(v)) as OpResult<unknown>,
  find: (s, v) => stack.find(s as stack.StackState, num(v)) as OpResult<unknown>,
  update: (s, a, b) => stack.update(s as stack.StackState, num(a), num(b)) as OpResult<unknown>,
  remove: (s) => stack.remove(s as stack.StackState) as OpResult<unknown>,
  kindLabel: 'Stack',
  inputKind: 'number',
};

const queueAdapter: DsAdapter = {
  create: () => queueD.create() as unknown,
  insert: (s, v) => queueD.insert(s as queueD.QueueState, num(v)) as OpResult<unknown>,
  find: (s, v) => queueD.find(s as queueD.QueueState, num(v)) as OpResult<unknown>,
  update: (s, a, b) => queueD.update(s as queueD.QueueState, num(a), num(b)) as OpResult<unknown>,
  remove: (s) => queueD.remove(s as queueD.QueueState) as OpResult<unknown>,
  kindLabel: 'Queue',
  inputKind: 'number',
};

const trieAdapter: DsAdapter = {
  create: () => trie.create() as unknown,
  insert: (s, v) => trie.insert(s as trie.TrieState, v) as OpResult<unknown>,
  find: (s, v) => trie.find(s as trie.TrieState, v) as OpResult<unknown>,
  update: (s, a, b) => trie.update(s as trie.TrieState, a, b) as OpResult<unknown>,
  remove: (s, v) => trie.remove(s as trie.TrieState, v) as OpResult<unknown>,
  kindLabel: 'Trie',
  inputKind: 'text',
};

const lsmAdapter: DsAdapter = {
  create: () => lsm.create() as unknown,
  insert: (s, v) => {
    const [k, vv] = v.split(':');
    return lsm.insert(s as lsm.LsmState, num(k), num(vv ?? k)) as OpResult<unknown>;
  },
  find: (s, v) => lsm.find(s as lsm.LsmState, num(v)) as OpResult<unknown>,
  update: (s, k, v) => lsm.update(s as lsm.LsmState, num(k), num(v)) as OpResult<unknown>,
  remove: (s, v) => lsm.remove(s as lsm.LsmState, num(v)) as OpResult<unknown>,
  kindLabel: 'LSM Tree',
  inputKind: 'kv',
};

export const registry: Record<DsKind, DsAdapter> = {
  dll: numericAdapter(dll as never, 'Doubly Linked List'),
  stack: stackAdapter,
  queue: queueAdapter,
  tree: numericAdapter(tree as never, 'Binary Search Tree'),
  trie: trieAdapter,
  graph: numericAdapter(graph as never, 'Graph'),
  lsm: lsmAdapter,
  bplus: numericAdapter(bplus as never, 'B+ Tree'),
};
