
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
        