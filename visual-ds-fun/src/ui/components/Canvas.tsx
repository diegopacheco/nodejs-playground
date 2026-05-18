import { useStore } from '@tanstack/react-store';
import { store } from '../store';
import { DllCanvas } from './canvases/DllCanvas';
import { StackCanvas } from './canvases/StackCanvas';
import { QueueCanvas } from './canvases/QueueCanvas';
import { TreeCanvas } from './canvases/TreeCanvas';
import { TrieCanvas } from './canvases/TrieCanvas';
import { GraphCanvas } from './canvases/GraphCanvas';
import { LsmCanvas } from './canvases/LsmCanvas';
import { BPlusCanvas } from './canvases/BPlusCanvas';

export function Canvas() {
  const kind = useStore(store, (s) => s.kind);
  switch (kind) {
    case 'dll':
      return <DllCanvas />;
    case 'stack':
      return <StackCanvas />;
    case 'queue':
      return <QueueCanvas />;
    case 'tree':
      return <TreeCanvas />;
    case 'trie':
      return <TrieCanvas />;
    case 'graph':
      return <GraphCanvas />;
    case 'lsm':
      return <LsmCanvas />;
    case 'bplus':
      return <BPlusCanvas />;
  }
}
