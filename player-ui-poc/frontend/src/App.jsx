import React, { useEffect, useState } from "react";
import { FlowPlayer } from "./FlowPlayer.jsx";
import { getFlow, listFlows, listSubmissions, saveSubmission } from "./api.js";

export function App() {
  const [flows, setFlows] = useState([]);
  const [flow, setFlow] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [run, setRun] = useState(0);

  const refreshHistory = () => listSubmissions().then(setHistory).catch(setError);

  useEffect(() => {
    listFlows().then(setFlows).catch(setError);
    refreshHistory();
  }, []);

  const start = async (id) => {
    setResult(null);
    setError(null);
    try {
      setFlow(await getFlow(id));
      setRun((r) => r + 1);
    } catch (e) {
      setError(e);
    }
  };

  const complete = async ({ outcome, data }) => {
    setResult({ outcome, data });
    setFlow(null);
    try {
      await saveSubmission({ flowId: flow.id, outcome, data });
      await refreshHistory();
    } catch (e) {
      setError(e);
    }
  };

  return (
    <main>
      <h1>Player UI POC</h1>
      <nav>
        {flows.map((f) => (
          <button key={f.id} onClick={() => start(f.id)}>
            Start {f.title}
          </button>
        ))}
      </nav>
      {error && <p className="error">{error.message}</p>}
      {flow && (
        <section className="player">
          <FlowPlayer key={run} flow={flow} onComplete={complete} onError={setError} />
        </section>
      )}
      {result && (
        <section>
          <h2>Result: {result.outcome}</h2>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </section>
      )}
      <section>
        <h2>Submissions</h2>
        <table>
          <thead>
            <tr><th>#</th><th>Flow</th><th>Outcome</th><th>Data</th><th>At</th></tr>
          </thead>
          <tbody>
            {history.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.flowId}</td>
                <td>{s.outcome}</td>
                <td><code>{JSON.stringify(s.data)}</code></td>
                <td>{s.at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
