import { TUI } from "@gridland/web";
import { useKeyboard, useTerminalDimensions } from "@gridland/utils";
import { useState } from "react";

function TerminalContent() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Press SPACE to increment, R to reset");
  const { width, height } = useTerminalDimensions();

  useKeyboard((key) => {
    if (key.name === "space") {
      setCount((c) => c + 1);
    }
    if (key.name === "r") {
      setCount(0);
      setMessage("Counter reset! Press SPACE to increment");
    }
  });

  return (
    <box flexDirection="column" width="100%" height="100%">
      <box
        border
        borderStyle="rounded"
        borderColor={{ r: 0, g: 200, b: 255, a: 1 }}
        flexGrow={0}
        paddingLeft={1}
        paddingRight={1}
      >
        <text color={{ r: 0, g: 255, b: 200, a: 1 }} bold>
          Gridland.io POC - Terminal UI in the Browser
        </text>
      </box>

      <box flexDirection="row" flexGrow={1} marginTop={1}>
        <box
          border
          borderStyle="rounded"
          borderColor={{ r: 255, g: 200, b: 0, a: 1 }}
          width="50%"
          flexDirection="column"
          paddingLeft={1}
          paddingRight={1}
        >
          <text color={{ r: 255, g: 255, b: 255, a: 1 }} bold>
            Counter
          </text>
          <text color={{ r: 0, g: 255, b: 100, a: 1 }} marginTop={1}>
            Value: {count}
          </text>
          <text color={{ r: 180, g: 180, b: 180, a: 1 }} marginTop={1}>
            {message}
          </text>
        </box>

        <box
          border
          borderStyle="rounded"
          borderColor={{ r: 200, g: 100, b: 255, a: 1 }}
          width="50%"
          flexDirection="column"
          paddingLeft={1}
          paddingRight={1}
          marginLeft={1}
        >
          <text color={{ r: 255, g: 255, b: 255, a: 1 }} bold>
            Terminal Info
          </text>
          <text color={{ r: 0, g: 200, b: 255, a: 1 }} marginTop={1}>
            Cols: {width}
          </text>
          <text color={{ r: 0, g: 200, b: 255, a: 1 }}>
            Rows: {height}
          </text>
          <text color={{ r: 255, g: 200, b: 0, a: 1 }} marginTop={1}>
            React 19 + Gridland
          </text>
        </box>
      </box>

      <box
        border
        borderStyle="rounded"
        borderColor={{ r: 100, g: 255, b: 100, a: 1 }}
        marginTop={1}
        flexGrow={0}
        paddingLeft={1}
        paddingRight={1}
      >
        <text color={{ r: 180, g: 180, b: 180, a: 1 }}>
          [SPACE] Increment  [R] Reset  |  Rendering to Canvas via React Reconciler + Yoga Layout
        </text>
      </box>
    </box>
  );
}

export function App() {
  return (
    <TUI
      style={{ width: "90vw", height: "80vh" }}
      fontSize={16}
      backgroundColor="#1a1a2e"
    >
      <TerminalContent />
    </TUI>
  );
}
