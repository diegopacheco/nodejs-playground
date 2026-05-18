import type { Op } from '../domain/types';

export const source = `import java.util.HashMap;

public class Trie {
    static class Node {
        boolean end;
        HashMap<Character, Node> children = new HashMap<>();
    }

    Node root = new Node();

    public void insert(String key) {
        Node c = root;
        for (char ch : key.toCharArray())
            c = c.children.computeIfAbsent(ch, k -> new Node());
        c.end = true;
    }

    public boolean find(String key) {
        Node c = root;
        for (char ch : key.toCharArray()) {
            c = c.children.get(ch);
            if (c == null) return false;
        }
        return c.end;
    }

    public boolean update(String oldKey, String newKey) {
        if (!find(oldKey)) return false;
        delete(oldKey);
        insert(newKey);
        return true;
    }

    public boolean delete(String key) {
        return delete(root, key, 0);
    }
    private boolean delete(Node n, String key, int i) {
        if (i == key.length()) {
            if (!n.end) return false;
            n.end = false;
            return n.children.isEmpty();
        }
        char ch = key.charAt(i);
        Node nxt = n.children.get(ch);
        if (nxt == null) return false;
        if (delete(nxt, key, i + 1) && !nxt.end) {
            n.children.remove(ch);
            return n.children.isEmpty();
        }
        return false;
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [11, 16],
  find: [18, 25],
  update: [27, 32],
  delete: [34, 53],
};
