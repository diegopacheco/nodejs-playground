
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
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      return {
        contents: `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(css)};
          document.head.appendChild(style);
        `,
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
        