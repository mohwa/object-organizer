import serve from 'rollup-plugin-serve';
import html from '@rollup/plugin-html';
import { OUTPUT_PATH, mergeEntryConfig } from './utils';

export default [
  mergeEntryConfig({
    input: 'examples/index.js',
    output: {
      file: `${OUTPUT_PATH}/index.js`,
      format: 'iife',
      sourcemap: false,
      plugins: [
        html(),
        serve({
          host: '192.168.200.123',
          port: 9999,
          contentBase: OUTPUT_PATH,
        }),
      ],
    },
  }),
];
