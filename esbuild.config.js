import { build } from 'esbuild';
import { copyFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

await build({
    entryPoints: ['./src/index.js', './src/cli.js'],
    outdir: 'dist',
    define: { VERSION: JSON.stringify(version) },
    minify: true,
    allowOverwrite: true,
});

await copyFile('./src/index.d.ts', 'dist/index.d.ts');
