# Visual DS Fun — Design Doc

## 1. Goal
A web application to **visually explore data structures**. The user picks a data structure, performs operations (insert / update / find / delete), and sees:
- The data structure rendered visually with animations.
- The equivalent **Java** class & method code with syntax highlighting and line numbers.
- A memory layout view showing how the structure is laid out in memory next to the class.

## 2. Scope
### Supported data structures
- Doubly Linked List (DLL)
- Stack
- Queue
- Graph
- Tree (Binary Search Tree)
- Trie
- LSM Tree
- B+ Tree

### Supported operations (per DS)
- Insert
- Update
- Find
- Delete

Not every operation maps 1:1 to every DS; where an operation is not idiomatic (e.g. update on a stack), the UI will disable it and the reason will be shown.

## 3. Non-Goals
- Persistence across sessions.
- Multi-user / collaboration.
- Authentication.
- Backend services / databases.
- Executing the Java code (it is shown for learning, not run).

## 4. Tech Stack
- **Runtime**: Bun (latest) for dev/build; Node.js (latest LTS) as fallback compatibility target.
- **Bundler / dev server**: Vite.
- **UI**: React + TypeScript (strict).
- **State / data**: TanStack Store (UI state) + TanStack Query (if any async loading of code snippets).
- **Routing**: TanStack Router.
- **Tables (where useful, e.g. memory cells)**: TanStack Table.
- **Animations**: CSS transitions + Web Animations API; framer-motion only if strictly necessary (prefer none — keep deps minimal).
- **Syntax highlighting**: a single small lib (e.g. `shiki` or `highlight.js`) — exactly one, chosen for line-number support.
- **Tests**: Vitest + React Testing Library.
- **Lint/format**: Biome (single tool, replaces eslint+prettier).

Rule: **the least number of libraries possible**. Anything not on this list must be justified.

## 5. Architecture — Separation of Concerns

```
src/
  domain/                  pure TS — no React, no DOM
    ds/
      dll.ts
      stack.ts
      queue.ts
      graph.ts
      tree.ts
      trie.ts
      lsm.ts
      bplus.ts
    types.ts               shared DS interfaces
    events.ts              OpEvent union: Inserted | Updated | Found | Deleted
  memory/                  memory-layout model (pure TS)
    layout.ts              maps a DS instance → cells (address, value, refs)
  java/                    Java source as static strings + metadata
    snippets/
      dll.java.ts
      stack.java.ts
      ...
    highlightRanges.ts     op → line ranges to highlight during animation
  ui/
    components/
      DsPicker.tsx
      OpBar.tsx            insert/update/find/delete controls
      Canvas/              visual renderers per DS
        DllCanvas.tsx
        ...
      CodePane.tsx         syntax-highlighted Java + line numbers
      MemoryPane.tsx       memory cells next to class
      Layout.tsx           3-pane layout: visual | code | memory
    store/                 TanStack Store slices
      selection.ts
      operations.ts
      animation.ts
    hooks/
    routes/                TanStack Router routes (/, /:ds)
  main.tsx
  app.tsx
```

### Layering rules
- `domain/` knows nothing about React, Java, or rendering.
- `memory/` consumes `domain/` only.
- `java/` is static data — no logic.
- `ui/` consumes `domain/`, `memory/`, `java/`. Never the reverse.

### Data flow
1. User picks DS → router param updates → store loads the matching `domain` module.
2. User triggers operation → store calls domain method → domain returns new state + `OpEvent`.
3. `OpEvent` drives:
   - Canvas animation (highlight affected nodes, animate transitions).
   - CodePane line highlight (`highlightRanges[op]`).
   - MemoryPane cell highlight (changed addresses).

## 6. Visualization
- Each DS has its own canvas component using **SVG** (simpler than canvas for node/edge structures, easy to animate via CSS).
- Nodes: rounded rects with value; pointers: arrows.
- Animations:
  - Insert: node fades + scales in; pointer arrows draw in.
  - Delete: node fades out; pointers re-route.
  - Find: pulse along the traversal path.
  - Update: color flash on the node.
- Target animation duration: 300–600ms per step. User can adjust speed (0.5x / 1x / 2x) and step through manually.

## 7. Code Pane (Java)
- Java source stored as `.java.ts` modules exporting `{ source: string, lineMap: Record<Op, [start, end]> }`.
- Syntax highlighting performed once on mount and cached.
- Line numbers rendered in a gutter column.
- During an operation, the corresponding line range is highlighted (background tint) for the duration of the animation.

## 8. Memory Pane
- Renders a vertical table of memory "cells": `address | value | refs`.
- Addresses are synthetic (e.g. `0x0001`, `0x0002`) — stable per node lifetime.
- For pointer-based DS (DLL, tree, trie, graph): each node = one cell; refs link to other cells.
- For array-backed DS (stack/queue when array-impl, B+ tree pages, LSM SSTables): cells grouped into contiguous blocks.
- Class fields are shown above the cells so users see the relationship between the **class definition** and the **runtime layout**.

## 9. UI Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  [DS Picker ▼]   [Insert] [Update] [Find] [Delete]   [Speed ▼]  │
├──────────────────────────┬────────────────┬─────────────────────┤
│                          │                │                     │
│   Visual Canvas (SVG)    │   Java Code    │   Memory Layout     │
│                          │   (lines +     │   (class +          │
│                          │   highlight)   │   cells)            │
│                          │                │                     │
└──────────────────────────┴────────────────┴─────────────────────┘
```
- Responsive: on narrow screens the three panes stack vertically.

## 10. Scripts
- `run.sh` — install deps (if needed) and start Vite dev server via Bun.
- `stop.sh` — find and kill the dev server process bound to the project port.
- No comments in either script (per project rules). No sleeps > 1s.

## 11. Testing Strategy
- **Domain modules**: pure unit tests — each operation verified against expected state + emitted event.
- **Memory mapping**: snapshot tests of `layout(ds)` for known inputs.
- **UI**: smoke tests per route — DS picker renders, op buttons exist, canvas mounts.
- Tests encode *why* (Rule 9): e.g. "deleting head of DLL must re-link prev=null on new head" — not just "length decreases".

## 12. Visualization Constraints
- **Keep item counts small.** The app must not pre-populate or auto-generate many items — the user adds them one by one.
- Suggested soft caps (warn the user, don't hard-block):
  - DLL / Stack / Queue: ~8 nodes
  - Tree (BST): ~10 nodes
  - Trie: ~8 keys, short strings
  - Graph: ~6 nodes
  - B+ Tree: small order (e.g. 3–4) and ~10 keys total
  - LSM Tree: 2 levels, ~6 keys
- Rationale: animations and memory cells stay legible; the goal is **understanding**, not stress-testing.
- No "seed with random data" button. No "fill with N items". Initial state is empty.

## 13. MVP
1. Project scaffold (Vite + React + TS + TanStack + Bun) + `run.sh` / `stop.sh`.
2. Domain layer for Stack + Queue + DLL.
3. UI shell (3-pane layout, DS picker, op bar).
4. Canvas + Code + Memory panes for Stack.
5. Extend to DLL, Queue.
6. Tree, Trie.
7. Graph.
8. B+ Tree.
9. LSM Tree.
10. Animation polish + speed control.

## 14. Success Criteria
- User can pick any of the 8 data structures and run the 4 operations (where applicable).
- For every operation the user sees: visual change, highlighted Java lines, updated memory cells — synchronized.
- `./run.sh` starts the app; `./stop.sh` stops it cleanly.
- Domain layer has > 90% line coverage; tests verify intent, not just shape.
- No dependency added that isn't listed in §4 without an entry in this doc.
