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
let highlightListeners: Array<(els: HTMLElement[]) => void> = [];

export function getRenderMap(): RenderMap {
  return renderMap;
}

export function clearRenderMap(): void {
  renderMap = new Map();
  notifyListeners();
}

export function onRenderMapChange(cb: (map: RenderMap) => void): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function onHighlight(cb: (els: HTMLElement[]) => void): () => void {
  highlightListeners.push(cb);
  return () => {
    highlightListeners = highlightListeners.filter((l) => l !== cb);
  };
}

function notifyListeners() {
  const snapshot = new Map(renderMap);
  listeners.forEach((cb) => cb(snapshot));
}

function notifyHighlight(els: HTMLElement[]) {
  highlightListeners.forEach((cb) => cb(els));
}

export function startInstrumentation() {
  instrument(
    secure({
      onCommitFiberRoot(_rendererID, root) {
        const highlightEls: HTMLElement[] = [];

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
            highlightEls.push(hostFiber.stateNode);
          }
        });

        notifyListeners();
        if (highlightEls.length > 0) {
          notifyHighlight(highlightEls);
        }
      },
    })
  );
}
