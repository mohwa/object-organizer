import babel from 'rollup-plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export const OUTPUT_PATH = 'dist';
export const OUTPUT_NAME = 'objectOrganizer';

export function mergeEntryConfig(options = {}) {
  const plugins = options.plugins || [];
  const output = options.output || {};

  delete options.plugins;
  delete options.output;

  return {
    input: 'lib/index.js',
    output: {
      freeze: false,
      interop: false,
      sourcemap: true,
      ...output,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
      nodeResolve(),
      commonjs({
        include: 'node_modules/**/*',
        sourceMap: true,
      }),
      ...plugins,
    ],
    ...options,
  };
}
