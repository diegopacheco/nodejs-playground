import type { Op } from '../domain/types';

export const source = `public class DoublyLinkedList {
    static class Node {
        int value;
        Node prev, next;
        Node(int v) { this.value = v; }
    }

    Node head, tail;

    public void insert(int v) {
        Node n = new Node(v);
        n.prev = tail;
        if (tail != null) tail.next = n;
        else head = n;
        tail = n;
    }

    public Node find(int v) {
        for (Node c = head; c != null; c = c.next)
            if (c.value == v) return c;
        return null;
    }

    public boolean update(int oldV, int newV) {
        Node n = find(oldV);
        if (n == null) return false;
        n.value = newV;
        return true;
    }

    public boolean delete(int v) {
        Node n = find(v);
        if (n == null) return false;
        if (n.prev != null) n.prev.next = n.next; else head = n.next;
        if (n.next != null) n.next.prev = n.prev; else tail = n.prev;
        return true;
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [11, 17],
  find: [19, 23],
  update: [25, 30],
  delete: [32, 38],
};
