import { useState } from 'react';

export default function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div style={{ padding: '20px', border: '2px solid #4CAF50', borderRadius: '8px', margin: '10px 0' }}>
      <h3>Interactive Counter Island</h3>
      <p>Current count: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)} style={{ marginRight: '10px', padding: '8px 16px' }}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)} style={{ marginRight: '10px', padding: '8px 16px' }}>
        Decrement
      </button>
      <button onClick={() => setCount(0)} style={{ padding: '8px 16px' }}>
        Reset
      </button>
    </div>
  );
}
