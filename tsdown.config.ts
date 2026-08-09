import { defineConfig } from 'tsdown';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version }: { version: string } = require('./package.json');

const shared = {
    minify: true,
};

export default defineConfig([
    {
        ...shared,
        entry: ['src/index.ts'],
    },
    {
        ...shared,
        entry: ['src/cli.ts'],
        dts: false,
        clean: false,
        define: { VERSION: JSON.stringify(version) },
    },
    {
        ...shared,
        entry: ['src/index.ts'],
        format: ['cjs'],
        clean: false,
    },
]);
