import {
  instrument,
  secure,
  traverseRenderedFibers,
  getDisplayName,
  getNearestHostFiber,
  traverseProps,
  traverseState,
  traverseContexts,
} from "bippy";

export interface RenderEntry {
  name: string;
  count: number;
  lastRenderTime: number;
  props: Record<string, unknown>;
  stateKeys: string[];
  contexts: string[];
}

export type RenderMap = Map<string, RenderEntry>;

let renderMap: RenderMap = new Map();
let listeners: Array<(map: RenderMap) => void> = [];
let processing = false;

export function clearRenderMap(): void {
  renderMap = new Map();
  scheduleNotify();
}

export function onRenderMapChange(cb: (map: RenderMap) => void): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

let pendingNotify = false;
function scheduleNotify() {
  if (pendingNotify) return;
  pendingNotify = true;
  requestAnimationFrame(() => {
    pendingNotify = false;
    const snapshot = new Map(renderMap);
    listeners.forEach((cb) => cb(snapshot));
  });
}

function highlightElement(el: HTMLElement) {
  el.style.outline = "2px solid #0f0";
  el.style.outlineOffset = "-2px";
  setTimeout(() => {
    el.style.outline = "";
    el.style.outlineOffset = "";
  }, 300);
}

export function startInstrumentation() {
  instrument(
    secure({
      onCommitFiberRoot(_rendererID, root) {
        if (processing) return;
        processing = true;

        traverseRenderedFibers(root, (fiber) => {
          const name = getDisplayName(fiber);
          if (!name) return;

          const existing = renderMap.get(name);
          const count = existing ? existing.count + 1 : 1;

          const props: Record<string, unknown> = {};
          traverseProps(fiber, (propName, value) => {
            if (typeof value === "function") {
              props[propName] = "[function]";
            } else if (typeof value === "object" && value !== null) {
              try {
                props[propName] = JSON.parse(JSON.stringify(value));
              } catch {
                props[propName] = "[circular]";
              }
            } else {
              props[propName] = value;
            }
          });

          const stateKeys: string[] = [];
          traverseState(fiber, (_state, index) => {
            stateKeys.push(`hook-${index}`);
          });

          const contexts: string[] = [];
          traverseContexts(fiber, (context) => {
            const ctxName =
              (context as { displayName?: string }).displayName ||
              "UnnamedContext";
            contexts.push(ctxName);
          });

          renderMap.set(name, {
            name,
            count,
            lastRenderTime: performance.now(),
            props,
            stateKeys,
            contexts,
          });

          const hostFiber = getNearestHostFiber(fiber);
          if (hostFiber?.stateNode instanceof HTMLElement) {
            highlightElement(hostFiber.stateNode);
          }
        });

        scheduleNotify();
        processing = false;
      },
    })
  );
}
