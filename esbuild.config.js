import { build } from 'esbuild';
import { copyFile } from 'node:fs/promises';

await build({
    entryPoints: ['./src/index.js'],
    outfile: 'dist/index.js',
    minify: true,
});

await copyFile('./src/index.d.ts', 'dist/index.d.ts');
