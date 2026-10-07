import { defineConfig } from 'tsdown';
import json from './package.json' with { type: 'json' };

const shared = {
    hash: false,
    inputOptions: { experimental: { attachDebugInfo: 'none' } } as const,
    minify: true,
};

export default defineConfig([
    {
        ...shared,
        entry: ['src/index.mts', 'src/sync.ts', 'src/async.ts'],
    },
    {
        ...shared,
        define: { VERSION: JSON.stringify(json.version) },
        dts: false,
        entry: ['src/cli.ts'],
    },
    {
        ...shared,
        entry: ['src/index.cts', 'src/sync.ts', 'src/async.ts'],
        format: ['cjs'],
    },
]);
