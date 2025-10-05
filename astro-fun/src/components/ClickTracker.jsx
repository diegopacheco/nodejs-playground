import { useState } from 'react';

export default function ClickTracker() {
  const [clicks, setClicks] = useState([]);

  const handleClick = () => {
    const timestamp = new Date().toLocaleTimeString();
    setClicks([...clicks, timestamp]);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #2196F3', borderRadius: '8px', margin: '10px 0' }}>
      <h3>Click Tracker Island</h3>
      <button onClick={handleClick} style={{ padding: '8px 16px', marginBottom: '10px' }}>
        Track Click
      </button>
      <p>Total clicks: {clicks.length}</p>
      {clicks.length > 0 && (
        <div>
          <h4>Click History:</h4>
          <ul>
            {clicks.slice(-5).map((time, idx) => (
              <li key={idx}>{time}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
