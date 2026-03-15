import { useState, useEffect, useRef, createContext, useContext, useReducer } from "react";
import { onRenderMapChange, type RenderEntry } from "./bippy-profiler";

const UserContext = createContext({ name: "Diego", role: "Engineer" });
UserContext.displayName = "UserContext";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

type TodoAction =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "remove"; id: number };

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "add":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "remove":
      return state.filter((t) => t.id !== action.id);
  }
}

function InspectorTab() {
  const [entries, setEntries] = useState<RenderEntry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onRenderMapChange((map) => {
      setEntries(Array.from(map.values()));
    });
    return unsub;
  }, []);

  const selectedEntry = entries.find((e) => e.name === selected);

  return (
    <UserContext.Provider value={{ name: "Diego", role: "Engineer" }}>
      <div>
        <p style={{ color: "#888", fontSize: 12, marginTop: 0 }}>
          Bippy exposes React fiber internals: props, state hooks, and context from outside React.
          This was impossible before without modifying React source code.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <TodoApp />
          <FormWidget />
        </div>

        <h3 style={{ color: "#0f0", marginBottom: 8 }}>Live Fiber Inspector</h3>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ border: "1px solid #333", borderRadius: 4, overflow: "hidden" }}>
              {entries.map((e) => (
                <div
                  key={e.name}
                  onClick={() => setSelected(e.name)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    background: selected === e.name ? "#1a3a1a" : "#111",
                    borderBottom: "1px solid #222",
                    color: selected === e.name ? "#0f0" : "#aaa",
                    fontSize: 13,
                  }}
                >
                  {e.name}
                  <span style={{ float: "right", color: "#555" }}>x{e.count}</span>
                </div>
              ))}
              {entries.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#555", fontSize: 12 }}>
                  Interact with widgets to populate the fiber tree
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 2 }}>
            {selectedEntry ? (
              <div style={{ background: "#111", border: "1px solid #333", borderRadius: 4, padding: 16 }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#0f0" }}>
                  {"<"}{selectedEntry.name}{" />"}
                </h4>

                <Section title="Props (from fiber.memoizedProps)">
                  {Object.keys(selectedEntry.props).length > 0 ? (
                    <pre style={{ margin: 0, color: "#ccc", fontSize: 12 }}>
                      {JSON.stringify(selectedEntry.props, null, 2)}
                    </pre>
                  ) : (
                    <Muted>no props</Muted>
                  )}
                </Section>

                <Section title="State Hooks (from fiber.memoizedState)">
                  {selectedEntry.stateKeys.length > 0 ? (
                    selectedEntry.stateKeys.map((k) => (
                      <span
                        key={k}
                        style={{
                          background: "#1a2a1a",
                          border: "1px solid #333",
                          padding: "2px 8px",
                          marginRight: 4,
                          borderRadius: 2,
                          fontSize: 11,
                          color: "#0f0",
                        }}
                      >
                        {k}
                      </span>
                    ))
                  ) : (
                    <Muted>no state hooks</Muted>
                  )}
                </Section>

                <Section title="Contexts (from fiber.dependencies)">
                  {selectedEntry.contexts.length > 0 ? (
                    selectedEntry.contexts.map((c) => (
                      <span
                        key={c}
                        style={{
                          background: "#2a1a1a",
                          border: "1px solid #333",
                          padding: "2px 8px",
                          marginRight: 4,
                          borderRadius: 2,
                          fontSize: 11,
                          color: "#ff0",
                        }}
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <Muted>no contexts consumed</Muted>
                  )}
                </Section>

                <Section title="Render Count">
                  <span style={{ fontSize: 24, color: selectedEntry.count > 10 ? "#f00" : "#0f0", fontWeight: "bold" }}>
                    {selectedEntry.count}
                  </span>
                </Section>
              </div>
            ) : (
              <div
                style={{
                  background: "#111",
                  border: "1px solid #333",
                  borderRadius: 4,
                  padding: 40,
                  textAlign: "center",
                  color: "#555",
                }}
              >
                Select a component to inspect its fiber
              </div>
            )}
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: 1, text: "Try bippy", done: false },
    { id: 2, text: "Inspect fibers", done: false },
  ]);
  const [input, setInput] = useState("");
  const user = useContext(UserContext);

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch({ type: "add", text: input });
    setInput("");
  };

  return (
    <div style={{ background: "#111", border: "1px solid #333", padding: 12, borderRadius: 4, flex: 1 }}>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>
        Todo ({user.name})
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="add todo..."
          style={{
            flex: 1,
            background: "#222",
            border: "1px solid #444",
            color: "#fff",
            padding: "4px 8px",
            fontFamily: "monospace",
          }}
        />
        <SmallBtn onClick={handleAdd}>+</SmallBtn>
      </div>
      {todos.map((t) => (
        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span
            onClick={() => dispatch({ type: "toggle", id: t.id })}
            style={{
              cursor: "pointer",
              color: t.done ? "#555" : "#0f0",
              textDecoration: t.done ? "line-through" : "none",
              flex: 1,
              fontSize: 13,
            }}
          >
            {t.text}
          </span>
          <SmallBtn onClick={() => dispatch({ type: "remove", id: t.id })}>x</SmallBtn>
        </div>
      ))}
    </div>
  );
}

function FormWidget() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: "#111", border: "1px solid #333", padding: 12, borderRadius: 4, flex: 1 }}>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 8 }}>Form</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
        style={{ ...inputStyle, marginBottom: 4, width: "100%", boxSizing: "border-box" }}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        style={{ ...inputStyle, marginBottom: 8, width: "100%", boxSizing: "border-box" }}
      />
      <SmallBtn
        onClick={() => {
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 1500);
        }}
      >
        {submitted ? "sent!" : "submit"}
      </SmallBtn>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#222",
  border: "1px solid #444",
  color: "#fff",
  padding: "4px 8px",
  fontFamily: "monospace",
  display: "block",
};

function SmallBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#222",
        color: "#0f0",
        border: "1px solid #444",
        padding: "2px 8px",
        cursor: "pointer",
        fontFamily: "monospace",
        borderRadius: 2,
        fontSize: 12,
      }}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ color: "#888", fontSize: 10, textTransform: "uppercase", marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#555", fontSize: 12 }}>{children}</span>;
}

export default InspectorTab;
