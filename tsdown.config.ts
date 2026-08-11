import { defineConfig } from 'tsdown';
import json from './package.json' with { type: 'json' };

const shared = {
    minify: true,
    hash: false,
    inputOptions: { experimental: { attachDebugInfo: 'none' } } as const,
};

export default defineConfig([
    {
        ...shared,
        entry: ['src/index.mts', 'src/sync.ts', 'src/async.ts'],
    },
    {
        ...shared,
        entry: ['src/cli.ts'],
        dts: false,
        define: { VERSION: JSON.stringify(json.version) },
    },
    {
        ...shared,
        entry: ['src/index.cts', 'src/sync.ts', 'src/async.ts'],
        format: ['cjs'],
    },
]);
