
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
