#!/usr/bin/env node
import * as nodeUtil from 'node:util';
import { inDocker, inPodman } from './async.js';

/**
 * The package version, replaced at build time by tsdown's `define`.
 */
declare const VERSION: string;

const options = {
    quiet: { type: 'boolean', short: 'q', desc: 'Only set the exit code' },
    help: { type: 'boolean', short: 'h', desc: 'Print this help message' },
    version: { type: 'boolean', short: 'v', desc: 'Print the version number' },
} as const;

const exitCodes = {
    0: 'running inside a container',
    1: 'not running inside a container',
    2: 'invalid usage',
} as const;

const indent = ' '.repeat(2);

const usage = [
    'Usage: in-container [options]',
    '',
    'Check if the current process is running inside a container (Docker, Podman).',
    '',
    'Options:',
    ...Object.entries(options).map(
        ([name, { short, desc }]) =>
            `${indent}-${short}, --${name}`.padEnd(17) + desc,
    ),
    '',
    'Exit code:',
    ...Object.entries(exitCodes).map(
        ([code, desc]) => `${indent}${code}`.padEnd(5) + desc,
    ),
].join('\n');

const run = async () => {
    if (typeof nodeUtil.parseArgs !== 'function') {
        throw new Error(
            `in-container requires Node.js >=16.17.0 <17.0.0 or >=18.3.0 to parse CLI options (running ${process.version}); the package itself supports older versions when imported as a library.`,
        );
    }
    const { values } = nodeUtil.parseArgs({ options });
    if (values.help) {
        console.log(usage);
        return;
    }
    if (values.version) {
        console.log(VERSION);
        return;
    }
    const [docker, podman] = await Promise.all([inDocker(), inPodman()]);
    const container = docker || podman;
    if (!values.quiet) {
        console.log(JSON.stringify({ container, docker, podman }));
    }
    process.exitCode = container ? 0 : 1;
};

await run().catch((err: Error) => {
    console.error(`${err.message}\n\n${usage}`);
    process.exitCode = 2;
});
