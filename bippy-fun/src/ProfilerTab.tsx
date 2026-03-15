import { useState, useEffect, useContext, createContext } from "react";
import { onRenderMapChange, clearRenderMap, type RenderEntry } from "./bippy-profiler";

const ThemeContext = createContext("dark");
ThemeContext.displayName = "ThemeContext";

function ProfilerTab() {
  const [entries, setEntries] = useState<RenderEntry[]>([]);

  useEffect(() => {
    const unsub = onRenderMapChange((map) => {
      setEntries(Array.from(map.values()).sort((a, b) => b.count - a.count));
    });
    return unsub;
  }, []);

  return (
    <ThemeContext.Provider value="dark">
      <div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <CounterWidget label="Counter A" />
          <CounterWidget label="Counter B" />
          <ToggleWidget />
          <TimerWidget />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, color: "#0f0" }}>Live Re-render Count</h3>
          <button
            onClick={clearRenderMap}
            style={{
              background: "#333",
              color: "#fff",
              border: "1px solid #555",
              padding: "4px 12px",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            Reset
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #333" }}>
              <Th>Component</Th>
              <Th>Renders</Th>
              <Th>Bar</Th>
              <Th>Last Render</Th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const maxCount = Math.max(...entries.map((x) => x.count), 1);
              const pct = (e.count / maxCount) * 100;
              const heat = e.count > 20 ? "#f00" : e.count > 10 ? "#ff0" : "#0f0";
              return (
                <tr key={e.name} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "6px 8px", color: "#ccc" }}>{e.name}</td>
                  <td style={{ padding: "6px 8px", color: heat, fontWeight: "bold", textAlign: "center" }}>
                    {e.count}
                  </td>
                  <td style={{ padding: "6px 8px", width: "40%" }}>
                    <div
                      style={{
                        height: 14,
                        width: `${pct}%`,
                        background: heat,
                        borderRadius: 2,
                        transition: "width 0.2s",
                      }}
                    />
                  </td>
                  <td style={{ padding: "6px 8px", color: "#666", fontSize: 11 }}>
                    {e.lastRenderTime.toFixed(0)}ms
                  </td>
                </tr>
              );
            })}
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 20, textAlign: "center", color: "#555" }}>
                  Interact with the widgets above to see re-renders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ThemeContext.Provider>
  );
}

function CounterWidget({ label }: { label: string }) {
  const [count, setCount] = useState(0);
  const theme = useContext(ThemeContext);

  return (
    <div
      style={{
        background: theme === "dark" ? "#111" : "#eee",
        border: "1px solid #333",
        padding: 12,
        borderRadius: 4,
        textAlign: "center",
        minWidth: 120,
      }}
    >
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, color: "#0f0", marginBottom: 8 }}>{count}</div>
      <div style={{ display: "flex", gap: 4 }}>
        <Btn onClick={() => setCount((c) => c - 1)}>-</Btn>
        <Btn onClick={() => setCount((c) => c + 1)}>+</Btn>
      </div>
    </div>
  );
}

function ToggleWidget() {
  const [on, setOn] = useState(false);

  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #333",
        padding: 12,
        borderRadius: 4,
        textAlign: "center",
        minWidth: 120,
      }}
    >
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>Toggle</div>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{on ? "ON" : "OFF"}</div>
      <Btn onClick={() => setOn((v) => !v)}>flip</Btn>
    </div>
  );
}

function TimerWidget() {
  const [ticks, setTicks] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTicks((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #333",
        padding: 12,
        borderRadius: 4,
        textAlign: "center",
        minWidth: 120,
      }}
    >
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>Timer</div>
      <div style={{ fontSize: 28, color: running ? "#ff0" : "#0f0", marginBottom: 8 }}>{ticks}</div>
      <Btn onClick={() => setRunning((r) => !r)}>{running ? "stop" : "start"}</Btn>
    </div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#222",
        color: "#0f0",
        border: "1px solid #444",
        padding: "4px 12px",
        cursor: "pointer",
        fontFamily: "monospace",
        borderRadius: 2,
      }}
    >
      {children}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: "6px 8px", textAlign: "left", color: "#888", fontWeight: "normal", fontSize: 11 }}>
      {children}
    </th>
  );
}

export default ProfilerTab;
