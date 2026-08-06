import { build } from 'esbuild';
import { copyFile } from 'node:fs/promises';

await build({
    entryPoints: ['./index.js'],
    outfile: 'dist/index.js',
    minify: true,
});

await copyFile('./index.d.ts', 'dist/index.d.ts');
