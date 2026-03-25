# Video.js v10 Beta + React 19

POC using Video.js v10 beta (10.0.0-beta.11) with React 19, TypeScript 5.8, and Vite 6.

Video.js v10 is a complete rewrite with composable components, 88% smaller default bundle,
and a new Streaming Processor Framework (SPF) engine for modular streaming.

## Stack

- **Video.js** v10.0.0-beta.11 (`@videojs/react`)
- **React** 19
- **TypeScript** 5.8
- **Vite** 6
- **Node.js** 24

## Key Features of Video.js v10

- Composable architecture: State, UI, and Media as separate optional components
- SPF engine for modular streaming (HLS/DASH at 19% the size of v8)
- Unstyled primitives with ejectable skins (shadcn/ui-like pattern)
- Default and minimal skin options designed by Sam Potts (Plyr creator)
- Purpose-built presets for video, audio, and background video

## How to Run

```bash
./run.sh
```

Then open http://localhost:4173 in your browser.

## Project Structure

```
├── index.html          HTML entry point
├── src/
│   ├── main.tsx        React root mount
│   └── App.tsx         Player component using @videojs/react
├── vite.config.ts      Vite configuration
├── tsconfig.json       TypeScript configuration
├── package.json        Dependencies
└── run.sh              Build and run script
```
