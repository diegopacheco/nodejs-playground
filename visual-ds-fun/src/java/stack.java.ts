import type { Op } from '../domain/types';

export const source = `public class Stack {
    private int[] data = new int[16];
    private int top = 0;

    public void push(int v) {
        if (top == data.length) grow();
        data[top++] = v;
    }

    public Integer peek() {
        if (top == 0) return null;
        return data[top - 1];
    }

    public Integer pop() {
        if (top == 0) return null;
        return data[--top];
    }

    public int find(int v) {
        for (int i = top - 1; i >= 0; i--)
            if (data[i] == v) return i;
        return -1;
    }

    public boolean update(int oldV, int newV) {
        int i = find(oldV);
        if (i < 0) return false;
        data[i] = newV;
        return true;
    }

    private void grow() {
        int[] n = new int[data.length * 2];
        System.arraycopy(data, 0, n, 0, top);
        data = n;
    }
}
`;

export const lineMap: Record<Op, [number, number]> = {
  insert: [5, 8],
  find: [20, 24],
  update: [26, 31],
  delete: [15, 18],
};
