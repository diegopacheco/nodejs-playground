import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '@tanstack/react-store';
import hljs from 'highlight.js/lib/core';
import java from 'highlight.js/lib/languages/java';
import 'highlight.js/styles/github-dark.css';
import { store } from '../store';
import { javaFor } from '../../java';

hljs.registerLanguage('java', java);

export function CodePane() {
  const kind = useStore(store, (s) => s.kind);
  const event = useStore(store, (s) => s.event);
  const { source, lineMap } = javaFor(kind);

  const lines = useMemo(() => source.split('\n'), [source]);
  const highlighted = useMemo(
    () => lines.map((l) => hljs.highlight(l, { language: 'java' }).value),
    [lines],
  );

  const range = event ? lineMap[event.op] : null;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!range || !containerRef.current) return;
    const el = containerRef.current.querySelector(`[data-line="${range[0]}"]`);
    if (el && 'scrollIntoView' in el) {
      (el as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [range]);

  return (
    <div className="code-pane" ref={containerRef}>
      <pre>
        {highlighted.map((html, i) => {
          const n = i + 1;
          const active = range && n >= range[0] && n <= range[1];
          return (
            <div
              key={i}
              data-line={n}
              className={`code-line${active ? ' active' : ''}`}
            >
              <span className="gutter">{n}</span>
              <code
                className="hljs"
                dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }}
              />
            </div>
          );
        })}
      </pre>
    </div>
  );
}
