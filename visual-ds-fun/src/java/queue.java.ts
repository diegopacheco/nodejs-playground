import type { Op } from '../domain/types';

export const source = `import java.util.ArrayDeque;

public class Queue {
    private final ArrayDeque<Integer> data = new ArrayDeque<>();

    public void enqueue(int v) {
        data.addLast(v);
    }

    public Integer dequeue() {
        return data.pollFirst();
    }

    public Integer peek() {
        return data.peekFirst();
    }

    public boolean find(int v) {
        return data.contains(v);
    }

    public boolean update(int oldV, int newV) {
        if (!data.remove(oldV)) return false;
        data.addLast(newV);
        return true;
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [7, 9],
  find: [19, 21],
  update: [23, 27],
  delete: [11, 13],
};
