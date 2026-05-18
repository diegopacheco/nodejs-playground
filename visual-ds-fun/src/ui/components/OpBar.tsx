import { useState } from 'react';
import { useStore } from '@tanstack/react-store';
import { store, doInsert, doFind, doUpdate, doDelete, reset, setSpeed } from '../store';
import { registry } from '../registry';

export function OpBar() {
  const kind = useStore(store, (s) => s.kind);
  const speed = useStore(store, (s) => s.speed);
  const event = useStore(store, (s) => s.event);
  const adapter = registry[kind];
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const placeholder =
    adapter.inputKind === 'text' ? 'key' : adapter.inputKind === 'kv' ? 'k:v' : 'value';

  return (
    <div className="opbar">
      <input
        className="op-input"
        placeholder={placeholder}
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <input
        className="op-input"
        placeholder="new value (update)"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />
      <button onClick={() => a && doInsert(a)}>Insert</button>
      <button onClick={() => a && doFind(a)}>Find</button>
      <button onClick={() => a && b && doUpdate(a, b)}>Update</button>
      <button onClick={() => doDelete(a)}>Delete</button>
      <button onClick={reset}>Reset</button>
      <label className="speed">
        Speed:
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
        </select>
      </label>
      {event && (
        <span className={`status ${event.ok ? 'ok' : 'bad'}`}>
          {event.op} {event.ok ? 'ok' : `failed${event.message ? ': ' + event.message : ''}`}
        </span>
      )}
    </div>
  );
}
