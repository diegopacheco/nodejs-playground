import { useStore } from '@tanstack/react-store';
import { store, selectKind } from '../store';
import { registry } from '../registry';
import type { DsKind } from '../../domain/types';

const kinds: DsKind[] = ['dll', 'stack', 'queue', 'tree', 'trie', 'graph', 'lsm', 'bplus'];

export function DsPicker() {
  const kind = useStore(store, (s) => s.kind);
  return (
    <select
      className="ds-picker"
      value={kind}
      onChange={(e) => selectKind(e.target.value as DsKind)}
    >
      {kinds.map((k) => (
        <option key={k} value={k}>
          {registry[k].kindLabel}
        </option>
      ))}
    </select>
  );
}
