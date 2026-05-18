import type { Op } from '../domain/types';

export const source = `import java.util.*;

public class LsmTree {
    static final int MEM_CAP = 3;
    static class Entry {
        int key; int value; boolean tombstone;
        Entry(int k, int v, boolean t) { key = k; value = v; tombstone = t; }
    }

    List<Entry> memtable = new ArrayList<>();
    Deque<List<Entry>> levels = new ArrayDeque<>();

    public void insert(int k, int v) {
        memtable.add(new Entry(k, v, false));
        flushIfNeeded();
    }

    public Integer find(int k) {
        for (int i = memtable.size() - 1; i >= 0; i--) {
            Entry e = memtable.get(i);
            if (e.key == k) return e.tombstone ? null : e.value;
        }
        for (List<Entry> lvl : levels)
            for (Entry e : lvl)
                if (e.key == k) return e.tombstone ? null : e.value;
        return null;
    }

    public boolean update(int k, int v) {
        if (find(k) == null) return false;
        insert(k, v);
        return true;
    }

    public boolean delete(int k) {
        if (find(k) == null) return false;
        memtable.add(new Entry(k, 0, true));
        flushIfNeeded();
        return true;
    }

    private void flushIfNeeded() {
        if (memtable.size() < MEM_CAP) return;
        List<Entry> sorted = new ArrayList<>(memtable);
        sorted.sort(Comparator.comparingInt(e -> e.key));
        levels.addFirst(sorted);
        memtable.clear();
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [13, 16],
  find: [18, 27],
  update: [29, 33],
  delete: [35, 40],
};
