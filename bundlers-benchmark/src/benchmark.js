import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

class BundlerBenchmark {
  constructor() {
    this.results = {};
    this.testProject = './test-project';
    this.bundlers = ['webpack', 'vite', 'rspack', 'esbuild', 'swc', 'rollup', 'parcel'];
  }

  async setup() {
    console.log('Setting up test project...');
    await this.createTestProject();
    for (const bundler of this.bundlers) {
      await this.setupBundler(bundler);
    }
  }

  async createTestProject() {
    const projectStructure = {
      'src/index.js': `
import { createApp } from './app.js';
import './styles.css';
import data from './data.json';

console.log('App starting with data:', data);
createApp();
      `,
      'src/app.js': `
import { utils } from './utils/index.js';
import { components } from './components/index.js';

export function createApp() {
  const appElement = document.getElementById('app') || document.body;
  const app = document.createElement('div');
  app.innerHTML = components.header() + components.main();
  appElement.appendChild(app);
  utils.log('App created');
}
      `,
      'src/utils/index.js': `
export const utils = {
  log: (msg) => console.log('[Utils] ' + msg),
  format: (str) => str.toUpperCase(),
  debounce: (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  }
};
      `,
      'src/components/index.js': `
export const components = {
  header: () => '<h1>Bundler Benchmark Test App</h1>',
  main: () => '<main><p>Testing bundler performance</p></main>'
};
      `,
      'src/styles.css': `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; }
h1 { color: #333; margin: 20px 0; }
main { padding: 20px; background: #f5f5f5; }
      `,
      'src/data.json': JSON.stringify({
        name: 'Benchmark Test',
        version: '1.0.0',
        items: Array.from({ length: 100 }, (_, i) => ({ id: i, value: `Item ${i}` }))
      }),
      'index.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Bundler Benchmark</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/index.js"></script>
</body>
</html>
      `,
      'public/index.html': `
<!DOCTYPE html>
<html>
<head>
  <title>Bundler Benchmark</title>
</head>
<body>
  <script src="./bundle.js"></script>
</body>
</html>
      `,
      'package.json': JSON.stringify({
        name: 'bundler-benchmark',
        version: '1.0.0',
        type: 'module',
        targets: {
          default: {
            distDir: 'dist-parcel'
          }
        },
        scripts: {
          'build:webpack': 'webpack --config webpack.config.js',
          'build:vite': 'vite build --config vite.config.js',
          'build:rspack': 'rspack build --config rspack.config.js',
          'build:esbuild': 'node build-esbuild.js',
          'build:swc': 'swc src -d dist-swc --config-file .swcrc',
          'build:rollup': 'rollup --config rollup.config.js',
          'build:parcel': 'parcel build index.html --dist-dir dist-parcel --no-cache',
          'dev:webpack': 'webpack serve --config webpack.config.js',
          'dev:vite': 'vite --config vite.config.js',
          'dev:rspack': 'rspack dev --config rspack.config.js',
          'dev:esbuild': 'node dev-esbuild.js',
          'dev:swc': 'echo "SWC dev server not available"',
          'dev:rollup': 'echo "Rollup dev server not available"',
          'dev:parcel': 'parcel index.html --dist-dir dist-parcel --port 3007'
        }
      }, null, 2)
    };

    await fs.mkdir(this.testProject, { recursive: true });
    
    for (const [filePath, content] of Object.entries(projectStructure)) {
      const fullPath = path.join(this.testProject, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }
  }

  async setupBundler(bundler) {
    console.log(`Setting up ${bundler}...`);
    
    const configs = {
      webpack: {
        dependencies: ['webpack', 'webpack-cli', 'webpack-dev-server', 'css-loader', 'style-loader', 'html-webpack-plugin'],
        config: `
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(process.cwd(), 'dist-webpack'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\\.json$/,
        type: 'json'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    port: 3001,
    open: false
  }
};
        `
      },
      vite: {
        dependencies: ['vite'],
        config: `
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist-vite',
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    port: 3002,
    open: false
  }
});
        `
      },
      rspack: {
        dependencies: ['@rspack/cli', '@rspack/core'],
        config: `
import path from 'path';

export default {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(process.cwd(), 'dist-rspack'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\\.css$/,
        use: ['css-loader']
      }
    ]
  },
  devServer: {
    port: 3003
  }
};
        `
      },
      esbuild: {
        dependencies: ['esbuild'],
        config: `
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// Ensure dist directory exists
const distDir = 'dist-esbuild';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const cssPlugin = {
  name: 'css',
  setup(build) {
    build.onLoad({ filter: /\\.css$/ }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      return {
        contents: \`
          const style = document.createElement('style');
          style.textContent = \${JSON.stringify(css)};
          document.head.appendChild(style);
        \`,
        loader: 'js'
      };
    });
  }
};

await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist-esbuild/bundle.js',
  minify: true,
  sourcemap: false,
  target: 'es2020',
  format: 'iife',
  plugins: [cssPlugin],
  loader: {
    '.json': 'json'
  }
});
        `,
        buildScript: `build-esbuild.js`
      },
      swc: {
        dependencies: ['@swc/cli', '@swc/core'],
        config: `{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": false,
      "dynamicImport": true,
      "privateMethod": false,
      "functionBind": false,
      "exportDefaultFrom": false,
      "exportNamespaceFrom": false,
      "decorators": false,
      "decoratorsBeforeExport": false,
      "topLevelAwait": false,
      "importMeta": false
    },
    "target": "es2020",
    "minify": {
      "compress": true,
      "mangle": true
    }
  },
  "module": {
    "type": "es6"
  },
  "minify": true
}`,
        configFile: `.swcrc`
      },
      rollup: {
        dependencies: ['rollup', '@rollup/plugin-node-resolve', '@rollup/plugin-commonjs', '@rollup/plugin-json', 'rollup-plugin-css-only'],
        config: `
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-only';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist-rollup/bundle.js',
    format: 'iife',
    name: 'App'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    css({ output: 'bundle.css' })
  ]
};
        `
      },
      parcel: {
        dependencies: ['parcel'],
        config: `{
  "extends": "@parcel/config-default"
}`,
        configFile: `.parcelrc`
      }
    };

    const config = configs[bundler];
    
    const depsToInstall = config.dependencies.join(' ');
    execSync(`cd ${this.testProject} && npm install ${depsToInstall} --save-dev`, { stdio: 'inherit' });
    
    if (bundler === 'esbuild') {
      await fs.writeFile(path.join(this.testProject, 'build-esbuild.js'), config.config);
      const devScript = `
import esbuild from 'esbuild';

const ctx = await esbuild.context({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist-esbuild/bundle.js',
  sourcemap: true,
  target: 'es2020',
  format: 'iife'
});

await ctx.watch();
await ctx.serve({
  servedir: 'dist-esbuild',
  port: 3004
});
`;
      await fs.writeFile(path.join(this.testProject, 'dev-esbuild.js'), devScript);
    } else if (bundler === 'swc') {
      await fs.writeFile(path.join(this.testProject, config.configFile), config.config);
    } else if (bundler === 'parcel') {
      await fs.writeFile(path.join(this.testProject, config.configFile), config.config);
    } else {
      const configFileName = `${bundler}.config.js`;
      await fs.writeFile(path.join(this.testProject, configFileName), config.config);
    }
  }

  async runBuildBenchmark() {
    console.log('\n🚀 Running build benchmarks...\n');
    
    for (const bundler of this.bundlers) {
      console.log(`Testing ${bundler} build performance...`);
      
      const times = [];
      const iterations = 5;
      
      for (let i = 0; i < iterations; i++) {
        const distDir = `dist-${bundler}`;
        try {
          await fs.rm(path.join(this.testProject, distDir), { recursive: true });
        } catch (e) {
        }
        
        const startTime = performance.now();
        
        try {
          execSync(`cd ${this.testProject} && npm run build:${bundler}`, { 
            stdio: 'pipe',
            timeout: 60000
          });
          
          const endTime = performance.now();
          const buildTime = endTime - startTime;
          times.push(buildTime);
          
          console.log(`  Run ${i + 1}: ${Math.round(buildTime)}ms`);
        } catch (error) {
          console.error(`  Run ${i + 1}: Failed - ${error.message}`);
          times.push(null);
        }
      }
      
      const validTimes = times.filter(t => t !== null);
      const avgTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
      const minTime = Math.min(...validTimes);
      const maxTime = Math.max(...validTimes);
      
      this.results[bundler] = {
        buildTimes: validTimes,
        avgBuildTime: avgTime,
        minBuildTime: minTime,
        maxBuildTime: maxTime,
        successRate: validTimes.length / iterations
      };
      
      try {
        const distDir = path.join(this.testProject, `dist-${bundler}`);
        const bundleSize = await this.getBundleSize(distDir);
        this.results[bundler].bundleSize = bundleSize;
      } catch (e) {
        this.results[bundler].bundleSize = null;
      }
      
      console.log(`  Average: ${Math.round(avgTime)}ms\n`);
    }
  }

  async getBundleSize(distDir) {
    const files = await fs.readdir(distDir, { recursive: true });
    let totalSize = 0;
    
    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const filePath = path.join(distDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
    }
    
    return totalSize;
  }

  async runDevServerBenchmark() {
    console.log('\n⚡ Running dev server benchmarks...\n');
    
    for (const bundler of this.bundlers) {
      console.log(`Testing ${bundler} dev server startup...!`);
      
      const startTime = performance.now();
      
      try {
        const result = execSync(`cd ${this.testProject} && timeout 10s npm run dev:${bundler} || true`, { 
          stdio: 'pipe',
          timeout: 15000
        });
        
        const endTime = performance.now();
        const startupTime = endTime - startTime;
        
        this.results[bundler].devStartupTime = startupTime;
        console.log(`  Startup time: ${Math.round(startupTime)}ms\n`);
      } catch (error) {
        console.log(`  Failed to start dev server\n`);
        this.results[bundler].devStartupTime = null;
      }
    }
  }

  printResults() {
    console.log('\n📊 BENCHMARK RESULTS\n');
    console.log('='.repeat(60));
    
    console.log('\n🏗️  BUILD PERFORMANCE');
    console.log('-'.repeat(40));
    
    const sortedByBuild = this.bundlers
      .filter(b => this.results[b].avgBuildTime)
      .sort((a, b) => this.results[a].avgBuildTime - this.results[b].avgBuildTime);
    
    sortedByBuild.forEach((bundler, index) => {
      const result = this.results[bundler];
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
      
      console.log(`${medal} ${bundler.toUpperCase()}`);
      console.log(`   Average: ${Math.round(result.avgBuildTime)}ms`);
      console.log(`   Range: ${Math.round(result.minBuildTime)}-${Math.round(result.maxBuildTime)}ms`);
      console.log(`   Success Rate: ${(result.successRate * 100).toFixed(1)}%`);
      console.log(`   Bundle Size: ${result.bundleSize ? (result.bundleSize / 1024).toFixed(1) + 'KB' : 'N/A'}`);
      console.log('');
    });
    
    console.log('\n📦 BUNDLE SIZE');
    console.log('-'.repeat(40));
    
    const sortedBySize = this.bundlers
      .filter(b => this.results[b].bundleSize)
      .sort((a, b) => this.results[a].bundleSize - this.results[b].bundleSize);
    
    sortedBySize.forEach((bundler, index) => {
      const size = this.results[bundler].bundleSize;
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
      console.log(`${medal} ${bundler}: ${(size / 1024).toFixed(1)}KB`);
    });
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `benchmark-results-${timestamp}.json`;
    
    const fullResults = {
      timestamp: new Date().toISOString(),
      system: {
        platform: process.platform,
        nodeVersion: process.version
      },
      results: this.results
    };
    
    await fs.writeFile(filename, JSON.stringify(fullResults, null, 2));
    console.log(`\n💾 Results saved to ${filename}`);
  }
}

async function runBenchmark() {
  const benchmark = new BundlerBenchmark();
  
  try {
    await benchmark.setup();
    await benchmark.runBuildBenchmark();
    // await benchmark.runDevServerBenchmark(); // Uncomment to test dev servers
    benchmark.printResults();
    await benchmark.saveResults();
  } catch (error) {
    console.error('Benchmark failed:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmark();
}

export { BundlerBenchmark };