import { describe, expect, it, beforeEach } from 'vitest';
import * as tree from '../tree';
import { resetIdsForTests } from '../types';

describe('bst', () => {
  beforeEach(() => resetIdsForTests());

  it('BST insert preserves ordering so in-order traversal is sorted', () => {
    let s = tree.create();
    [5, 2, 8, 1, 3, 7, 9].forEach((v) => {
      s = tree.insert(s, v).state;
    });
    const seen: number[] = [];
    const walk = (id: string | null) => {
      if (!id) return;
      const n = s.nodes[id];
      walk(n.left);
      seen.push(n.value);
      walk(n.right);
    };
    walk(s.root);
    expect(seen).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it('deleting a node with two children replaces it with in-order successor', () => {
    let s = tree.create();
    [5, 2, 8, 7, 9].forEach((v) => {
      s = tree.insert(s, v).state;
    });
    s = tree.remove(s, 8).state;
    expect(s.root).not.toBeNull();
    const walk = (id: string | null, out: number[]) => {
      if (!id) return;
      const n = s.nodes[id];
      walk(n.left, out);
      out.push(n.value);
      walk(n.right, out);
    };
    const out: number[] = [];
    walk(s.root, out);
    expect(out).toEqual([2, 5, 7, 9]);
  });
});
