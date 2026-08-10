import { defineConfig } from 'tsdown';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

const shared = {
    minify: true,
    hash: false,
};

export default defineConfig([
    {
        ...shared,
        entry: ['src/index.ts', 'src/sync.ts', 'src/async.ts'],
    },
    {
        ...shared,
        entry: ['src/cli.ts'],
        dts: false,
        define: { VERSION: JSON.stringify(version) },
    },
    {
        ...shared,
        entry: ['src/index.ts', 'src/sync.ts', 'src/async.ts'],
        format: ['cjs'],
    },
]);
