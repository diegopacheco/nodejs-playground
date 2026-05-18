import type { Op } from '../domain/types';

export const source = `import java.util.*;

public class Graph {
    Map<Integer, List<Integer>> adj = new LinkedHashMap<>();

    public void addNode(int v) {
        adj.putIfAbsent(v, new ArrayList<>());
    }

    public void addEdge(int a, int b) {
        adj.get(a).add(b);
        adj.get(b).add(a);
    }

    public boolean find(int v) {
        if (adj.isEmpty()) return false;
        int start = adj.keySet().iterator().next();
        Set<Integer> seen = new HashSet<>();
        Deque<Integer> q = new ArrayDeque<>();
        q.add(start); seen.add(start);
        while (!q.isEmpty()) {
            int cur = q.poll();
            if (cur == v) return true;
            for (int nb : adj.get(cur))
                if (seen.add(nb)) q.add(nb);
        }
        return false;
    }

    public boolean update(int oldV, int newV) {
        if (!adj.containsKey(oldV)) return false;
        List<Integer> nb = adj.remove(oldV);
        adj.put(newV, nb);
        for (List<Integer> l : adj.values())
            for (int i = 0; i < l.size(); i++)
                if (l.get(i) == oldV) l.set(i, newV);
        return true;
    }

    public boolean delete(int v) {
        if (adj.remove(v) == null) return false;
        for (List<Integer> l : adj.values()) l.removeIf(x -> x == v);
        return true;
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [6, 9],
  find: [15, 29],
  update: [31, 39],
  delete: [41, 45],
};
