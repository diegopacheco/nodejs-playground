import type { DsKind, Op } from '../domain/types';
import * as dll from './dll.java';
import * as stack from './stack.java';
import * as queueJ from './queue.java';
import * as tree from './tree.java';
import * as trie from './trie.java';
import * as graph from './graph.java';
import * as lsm from './lsm.java';
import * as bplus from './bplus.java';

const map: Record<DsKind, { source: string; lineMap: Record<Op, [number, number]> }> = {
  dll,
  stack,
  queue: queueJ,
  tree,
  trie,
  graph,
  lsm,
  bplus,
};

export function javaFor(kind: DsKind) {
  return map[kind];
}
