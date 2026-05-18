import { describe, expect, it, beforeEach } from 'vitest';
import * as trie from '../trie';
import { resetIdsForTests } from '../types';

describe('trie', () => {
  beforeEach(() => resetIdsForTests());

  it('find returns false for prefix-only matches so consumers must distinguish words from prefixes', () => {
    let s = trie.create();
    s = trie.insert(s, 'cat').state;
    expect(trie.find(s, 'cat').event.ok).toBe(true);
    expect(trie.find(s, 'ca').event.ok).toBe(false);
  });

  it('delete prunes dead branches so memory does not leak', () => {
    let s = trie.create();
    s = trie.insert(s, 'car').state;
    s = trie.insert(s, 'cat').state;
    s = trie.remove(s, 'car').state;
    expect(trie.find(s, 'car').event.ok).toBe(false);
    expect(trie.find(s, 'cat').event.ok).toBe(true);
  });
});
