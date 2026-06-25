const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Deno Calculator</title>
<style>
  :root {
    --bg: #0b0e14;
    --panel: #151a23;
    --display: #0f131b;
    --text: #e6e9ef;
    --muted: #8b95a7;
    --key: #1d2430;
    --key-hover: #273141;
    --op: #2f6df6;
    --op-hover: #4880ff;
    --accent: #36c08a;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    background: radial-gradient(1200px 800px at 50% -10%, #16202e, var(--bg));
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .app {
    width: 320px;
    background: var(--panel);
    border-radius: 22px;
    padding: 20px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .brand .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
  .display {
    background: var(--display);
    border-radius: 14px;
    padding: 16px 18px;
    text-align: right;
    margin-bottom: 16px;
    min-height: 92px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .display .history { color: var(--muted); font-size: 14px; min-height: 18px; word-break: break-all; }
  .display .value { font-size: 40px; font-weight: 600; line-height: 1.1; word-break: break-all; }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  button {
    border: none;
    border-radius: 14px;
    padding: 18px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
    background: var(--key);
    cursor: pointer;
    transition: background 0.12s ease, transform 0.05s ease;
  }
  button:hover { background: var(--key-hover); }
  button:active { transform: translateY(1px); }
  button.op { background: var(--op); }
  button.op:hover { background: var(--op-hover); }
  button.fn { color: var(--muted); }
  button.equals { background: var(--accent); color: #06241a; }
  button.equals:hover { filter: brightness(1.08); }
  button.span2 { grid-column: span 2; }
</style>
</head>
<body>
  <div class="app">
    <div class="brand"><span class="dot"></span> Deno Desktop</div>
    <div class="display">
      <div class="history" id="history"></div>
      <div class="value" id="value">0</div>
    </div>
    <div class="grid" id="keys">
      <button class="fn" data-action="clear">AC</button>
      <button class="fn" data-action="negate">+/-</button>
      <button class="fn" data-action="percent">%</button>
      <button class="op" data-op="/">&divide;</button>

      <button data-digit="7">7</button>
      <button data-digit="8">8</button>
      <button data-digit="9">9</button>
      <button class="op" data-op="*">&times;</button>

      <button data-digit="4">4</button>
      <button data-digit="5">5</button>
      <button data-digit="6">6</button>
      <button class="op" data-op="-">&minus;</button>

      <button data-digit="1">1</button>
      <button data-digit="2">2</button>
      <button data-digit="3">3</button>
      <button class="op" data-op="+">+</button>

      <button class="span2" data-digit="0">0</button>
      <button data-action="decimal">.</button>
      <button class="equals" data-action="equals">=</button>
    </div>
  </div>
<script>
  const valueEl = document.getElementById("value");
  const historyEl = document.getElementById("history");
  const state = { current: "0", previous: null, op: null, overwrite: true };

  const symbols = { "/": "\\u00f7", "*": "\\u00d7", "-": "\\u2212", "+": "+" };

  function format(n) {
    if (!isFinite(n)) return "Error";
    const rounded = Math.round((n + Number.EPSILON) * 1e12) / 1e12;
    return String(rounded);
  }

  function render() {
    valueEl.textContent = state.current;
    if (state.previous !== null && state.op) {
      historyEl.textContent = state.previous + " " + symbols[state.op];
    } else {
      historyEl.textContent = "";
    }
  }

  function inputDigit(d) {
    if (state.overwrite) {
      state.current = d;
      state.overwrite = false;
    } else {
      state.current = state.current === "0" ? d : state.current + d;
    }
  }

  function inputDecimal() {
    if (state.overwrite) {
      state.current = "0.";
      state.overwrite = false;
    } else if (!state.current.includes(".")) {
      state.current += ".";
    }
  }

  function compute() {
    const a = parseFloat(state.previous);
    const b = parseFloat(state.current);
    switch (state.op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? Infinity : a / b;
    }
    return b;
  }

  function chooseOp(op) {
    if (state.op && !state.overwrite) {
      state.current = format(compute());
    }
    state.previous = state.current;
    state.op = op;
    state.overwrite = true;
  }

  function equals() {
    if (!state.op) return;
    state.current = format(compute());
    state.previous = null;
    state.op = null;
    state.overwrite = true;
  }

  function clearAll() {
    state.current = "0";
    state.previous = null;
    state.op = null;
    state.overwrite = true;
  }

  function negate() {
    state.current = format(parseFloat(state.current) * -1);
  }

  function percent() {
    state.current = format(parseFloat(state.current) / 100);
  }

  document.getElementById("keys").addEventListener("click", (e) => {
    const t = e.target;
    if (t.dataset.digit !== undefined) inputDigit(t.dataset.digit);
    else if (t.dataset.op !== undefined) chooseOp(t.dataset.op);
    else if (t.dataset.action === "decimal") inputDecimal();
    else if (t.dataset.action === "equals") equals();
    else if (t.dataset.action === "clear") clearAll();
    else if (t.dataset.action === "negate") negate();
    else if (t.dataset.action === "percent") percent();
    render();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
    else if (e.key === ".") inputDecimal();
    else if (["+", "-", "*", "/"].includes(e.key)) chooseOp(e.key);
    else if (e.key === "Enter" || e.key === "=") equals();
    else if (e.key === "Escape") clearAll();
    else if (e.key === "Backspace") {
      state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
      if (state.current === "0") state.overwrite = true;
    } else if (e.key === "%") percent();
    else return;
    render();
  });

  render();
</script>
</body>
</html>`;

Deno.serve(() =>
  new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  })
);

const win = new Deno.BrowserWindow({
  title: "Calculator",
  width: 380,
  height: 600,
  resizable: false,
});

win.addEventListener("close", () => {
  Deno.exit(0);
});
