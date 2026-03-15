import { useState, useEffect } from "react";
import { startInstrumentation } from "./bippy-profiler";
import ProfilerTab from "./ProfilerTab";
import InspectorTab from "./InspectorTab";

startInstrumentation();

function App() {
  const [tab, setTab] = useState<"profiler" | "inspector">("profiler");

  return (
    <div style={{ fontFamily: "monospace", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Bippy Fun</h1>
      <p style={{ color: "#888", marginTop: 0, marginBottom: 20 }}>
        React internals exposed via bippy - re-render profiler & live state inspector
      </p>

      <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
        <TabButton active={tab === "profiler"} onClick={() => setTab("profiler")}>
          Re-render Profiler
        </TabButton>
        <TabButton active={tab === "inspector"} onClick={() => setTab("inspector")}>
          State Inspector
        </TabButton>
      </div>

      {tab === "profiler" ? <ProfilerTab /> : <InspectorTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 24px",
        border: "2px solid #333",
        borderBottom: active ? "2px solid #000" : "2px solid #333",
        background: active ? "#000" : "#1a1a1a",
        color: active ? "#0f0" : "#888",
        cursor: "pointer",
        fontFamily: "monospace",
        fontSize: 14,
        fontWeight: active ? "bold" : "normal",
      }}
    >
      {children}
    </button>
  );
}

export default App;
