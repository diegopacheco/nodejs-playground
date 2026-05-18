import { describe, expect, it, beforeEach } from 'vitest';
import * as dll from '../dll';
import { resetIdsForTests } from '../types';

describe('dll', () => {
  beforeEach(() => resetIdsForTests());

  it('deleting head re-links new head prev to null so traversal terminates', () => {
    let s = dll.create();
    s = dll.insert(s, 1).state;
    s = dll.insert(s, 2).state;
    s = dll.insert(s, 3).state;
    s = dll.remove(s, 1).state;
    expect(s.head).not.toBeNull();
    expect(s.nodes[s.head!].prev).toBeNull();
    expect(dll.toList(s).map((n) => n.value)).toEqual([2, 3]);
  });

  it('deleting tail updates tail and new tail next is null', () => {
    let s = dll.create();
    s = dll.insert(s, 1).state;
    s = dll.insert(s, 2).state;
    s = dll.remove(s, 2).state;
    expect(s.tail).toBe(s.head);
    expect(s.nodes[s.tail!].next).toBeNull();
  });
});
