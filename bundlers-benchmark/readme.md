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
🥇 RSPACK
   Average: 447ms
   Range: 416-496ms
   Success Rate: 100.0%
   Bundle Size: 5.4KB

🥈 VITE
   Average: 476ms
   Range: 443-491ms
   Success Rate: 100.0%
   Bundle Size: 3.7KB

🥉 WEBPACK
   Average: 1446ms
   Range: 1377-1544ms
   Success Rate: 100.0%
   Bundle Size: 7.3KB


📦 BUNDLE SIZE
----------------------------------------
🥇 vite: 3.7KB
🥈 rspack: 5.4KB
🥉 webpack: 7.3KB

💾 Results saved to benchmark-results-2025-08-16T00-26-22-143Z.json

```