import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'client/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/index.js'
  },
  plugins: [
    svelte({
      dev: !production,
      css: css => {
        css.write('dist/app.css')
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    production && terser()
  ]
}
