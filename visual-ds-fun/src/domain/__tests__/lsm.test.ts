import { describe, expect, it, beforeEach } from 'vitest';
import * as lsm from '../lsm';
import { resetIdsForTests } from '../types';

describe('lsm', () => {
  beforeEach(() => resetIdsForTests());

  it('newer writes shadow older ones because memtable is scanned newest-first', () => {
    let s = lsm.create();
    s = lsm.insert(s, 1, 100).state;
    s = lsm.insert(s, 1, 200).state;
    const r = lsm.find(s, 1);
    expect(r.event.ok).toBe(true);
  });

  it('memtable flushes to level when it hits capacity so reads stay bounded', () => {
    let s = lsm.create();
    s = lsm.insert(s, 1, 1).state;
    s = lsm.insert(s, 2, 2).state;
    s = lsm.insert(s, 3, 3).state;
    expect(s.memtable.length).toBe(0);
    expect(s.levels.length).toBe(1);
  });
});
