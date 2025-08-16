# Bundlers Benchmark

Benchmark across 3 main bundlers.

## What is a bundler in javascript?

Bundler is a tool that takes your JavaScript code and its dependencies, and packages them into a single file (or a few files) for deployment. This process often includes minification, transpilation, and other optimizations to improve performance.

### Webpack bundler

Webpack is a powerful and flexible module bundler for JavaScript applications. It allows developers to bundle their JavaScript files, along with stylesheets, images, and other assets, into a single file or a set of files for production use.

### RSPack bundler

RSPack is a Rust-based bundler that aims to be a faster alternative to Webpack. It leverages the performance of Rust to provide a more efficient bundling process, making it suitable for large-scale applications.

### Vite bundler

Vite is a modern build tool that focuses on speed and performance. It uses native ES modules in the browser for development, providing a fast and responsive experience. Vite also supports various plugins and optimizations for production builds.

## How to run

```bash
npm run benchmark
```

## Results

```
📊 BENCHMARK RESULTS

============================================================

🏗️  BUILD PERFORMANCE
----------------------------------------
🥇 ESBUILD
   Average: 216ms
   Range: 208-226ms
   Success Rate: 100.0%
   Bundle Size: 3.1KB

🥈 SWC
   Average: 301ms
   Range: 294-313ms
   Success Rate: 100.0%
   Bundle Size: 0.7KB

🥉 ROLLUP
   Average: 329ms
   Range: 316-350ms
   Success Rate: 100.0%
   Bundle Size: 5.4KB

🥉 RSPACK
   Average: 388ms
   Range: 379-400ms
   Success Rate: 100.0%
   Bundle Size: 5.4KB

🥉 VITE
   Average: 445ms
   Range: 424-464ms
   Success Rate: 100.0%
   Bundle Size: 3.7KB

🥉 PARCEL
   Average: 1108ms
   Range: 1072-1162ms
   Success Rate: 100.0%
   Bundle Size: 3.3KB

🥉 WEBPACK
   Average: 1392ms
   Range: 1335-1451ms
   Success Rate: 100.0%
   Bundle Size: 7.3KB


📦 BUNDLE SIZE
----------------------------------------
🥇 swc: 0.7KB
🥈 esbuild: 3.1KB
🥉 parcel: 3.3KB
🥉 vite: 3.7KB
🥉 rspack: 5.4KB
🥉 rollup: 5.4KB
🥉 webpack: 7.3KB

💾 Results saved to benchmark-results-2025-08-16T00-39-54-644Z.json
```