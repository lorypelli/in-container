import { defineConfig } from 'tsdown';
import json from './package.json' with { type: 'json' };

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
        define: { VERSION: JSON.stringify(json.version) },
    },
    {
        ...shared,
        entry: ['src/index.ts', 'src/sync.ts', 'src/async.ts'],
        format: ['cjs'],
    },
]);
