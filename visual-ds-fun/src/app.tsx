import { DsPicker } from './ui/components/DsPicker';
import { OpBar } from './ui/components/OpBar';
import { Canvas } from './ui/components/Canvas';
import { CodePane } from './ui/components/CodePane';
import { MemoryPane } from './ui/components/MemoryPane';
import './app.css';

export function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Visual DS Fun</h1>
        <DsPicker />
      </header>
      <OpBar />
      <main className="grid">
        <section className="pane canvas-pane">
          <h3>Visual</h3>
          <Canvas />
        </section>
        <section className="pane code-section">
          <h3>Java</h3>
          <CodePane />
        </section>
        <section className="pane memory-section">
          <MemoryPane />
        </section>
      </main>
    </div>
  );
}
