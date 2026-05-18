import { describe, expect, it, beforeEach } from 'vitest';
import * as stack from '../stack';
import { resetIdsForTests } from '../types';

describe('stack', () => {
  beforeEach(() => resetIdsForTests());

  it('insert pushes to the top so pop returns LIFO order', () => {
    let s = stack.create();
    s = stack.insert(s, 1).state;
    s = stack.insert(s, 2).state;
    s = stack.insert(s, 3).state;
    const popped: number[] = [];
    for (let i = 0; i < 3; i += 1) {
      const r = stack.remove(s);
      popped.push(s.items[s.items.length - 1].value);
      s = r.state;
    }
    expect(popped).toEqual([3, 2, 1]);
  });

  it('find emits a path from top down so visualization matches LIFO scan', () => {
    let s = stack.create();
    s = stack.insert(s, 10).state;
    s = stack.insert(s, 20).state;
    s = stack.insert(s, 30).state;
    const r = stack.find(s, 10);
    expect(r.event.ok).toBe(true);
    expect(r.event.path.length).toBe(3);
  });
});
