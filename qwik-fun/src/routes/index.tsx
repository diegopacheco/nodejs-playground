import { component$, useStore } from '@builder.io/qwik';

export default component$(() => {
  const state = useStore({ count: 0, message: '' });

  return (
    <div style="font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px;">
      <h1>Qwik Resumable Framework</h1>
      <p>Instant-on interactivity without hydration</p>

      <div style="margin: 30px 0; padding: 20px; border: 2px solid #4a9eff; border-radius: 8px;">
        <h2>Interactive Counter</h2>
        <p>Current count: <strong>{state.count}</strong></p>
        <button
          onClick$={() => state.count++}
          style="padding: 10px 20px; margin: 5px; cursor: pointer; background: #4a9eff; color: white; border: none; border-radius: 4px;"
        >
          Increment
        </button>
        <button
          onClick$={() => state.count--}
          style="padding: 10px 20px; margin: 5px; cursor: pointer; background: #ff4a6e; color: white; border: none; border-radius: 4px;"
        >
          Decrement
        </button>
        <button
          onClick$={() => (state.count = 0)}
          style="padding: 10px 20px; margin: 5px; cursor: pointer; background: #6c757d; color: white; border: none; border-radius: 4px;"
        >
          Reset
        </button>
      </div>

      <div style="margin: 30px 0; padding: 20px; border: 2px solid #28a745; border-radius: 8px;">
        <h2>Message Input</h2>
        <input
          type="text"
          value={state.message}
          onInput$={(e) => (state.message = (e.target as HTMLInputElement).value)}
          placeholder="Type something..."
          style="padding: 10px; width: 100%; max-width: 400px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;"
        />
        <p>You typed: <strong>{state.message || 'nothing yet'}</strong></p>
      </div>

      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <h3>Why Qwik is Fast</h3>
        <ul>
          <li><strong>No Hydration:</strong> JavaScript loads only when needed</li>
          <li><strong>Resumable:</strong> Continues from server state without re-execution</li>
          <li><strong>Fine-grained Lazy Loading:</strong> Code loads per interaction</li>
          <li><strong>Instant Interactive:</strong> Works immediately without waiting for JS bundle</li>
        </ul>
      </div>
    </div>
  );
});
