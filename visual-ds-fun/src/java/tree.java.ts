import type { Op } from '../domain/types';

export const source = `public class BST {
    static class Node {
        int value;
        Node left, right;
        Node(int v) { this.value = v; }
    }

    Node root;

    public void insert(int v) {
        root = insert(root, v);
    }
    private Node insert(Node n, int v) {
        if (n == null) return new Node(v);
        if (v < n.value) n.left = insert(n.left, v);
        else if (v > n.value) n.right = insert(n.right, v);
        return n;
    }

    public Node find(int v) {
        Node c = root;
        while (c != null) {
            if (v == c.value) return c;
            c = v < c.value ? c.left : c.right;
        }
        return null;
    }

    public boolean update(int oldV, int newV) {
        if (find(oldV) == null) return false;
        delete(oldV);
        insert(newV);
        return true;
    }

    public void delete(int v) { root = delete(root, v); }
    private Node delete(Node n, int v) {
        if (n == null) return null;
        if (v < n.value) n.left = delete(n.left, v);
        else if (v > n.value) n.right = delete(n.right, v);
        else {
            if (n.left == null) return n.right;
            if (n.right == null) return n.left;
            Node s = n.right;
            while (s.left != null) s = s.left;
            n.value = s.value;
            n.right = delete(n.right, s.value);
        }
        return n;
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [10, 18],
  find: [20, 27],
  update: [29, 34],
  delete: [36, 50],
};
