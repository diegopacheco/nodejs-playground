import type { Op } from '../domain/types';

export const source = `import java.util.*;

public class BPlusTree {
    static final int ORDER = 3;
    static class Node {
        boolean leaf;
        List<Integer> keys = new ArrayList<>();
        List<Node> children = new ArrayList<>();
        Node next;
    }

    Node root = new Node() {{ leaf = true; }};

    public Node findLeaf(int key) {
        Node c = root;
        while (!c.leaf) {
            int i = 0;
            while (i < c.keys.size() && key >= c.keys.get(i)) i++;
            c = c.children.get(i);
        }
        return c;
    }

    public boolean find(int key) {
        return findLeaf(key).keys.contains(key);
    }

    public void insert(int key) {
        Node leaf = findLeaf(key);
        int i = 0;
        while (i < leaf.keys.size() && leaf.keys.get(i) < key) i++;
        leaf.keys.add(i, key);
    }

    public boolean update(int oldKey, int newKey) {
        if (!find(oldKey)) return false;
        delete(oldKey);
        insert(newKey);
        return true;
    }

    public boolean delete(int key) {
        Node leaf = findLeaf(key);
        return leaf.keys.remove((Integer) key);
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [28, 33],
  find: [24, 26],
  update: [35, 40],
  delete: [42, 45],
};
