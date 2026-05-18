import { describe, expect, it, beforeEach } from 'vitest';
import * as bplus from '../bplus';
import { resetIdsForTests } from '../types';

describe('bplus', () => {
  beforeEach(() => resetIdsForTests());

  it('inserts split leaves and promote keys so the tree grows in height not width', () => {
    let s = bplus.create();
    [10, 20, 30, 40, 50].forEach((k) => {
      s = bplus.insert(s, k).state;
    });
    expect(s.nodes[s.root].leaf).toBe(false);
    [10, 20, 30, 40, 50].forEach((k) => {
      expect(bplus.find(s, k).event.ok).toBe(true);
    });
  });
});
