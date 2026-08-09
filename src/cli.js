#!/usr/bin/env node
/// <reference path="./cli.d.ts" />
import { parseArgs } from 'node:util';
import { inDocker, inPodman } from './index.js';

const options = {
    docker: { type: 'boolean', short: 'd', desc: 'Only check for Docker' },
    podman: { type: 'boolean', short: 'p', desc: 'Only check for Podman' },
    json: { type: 'boolean', short: 'j', desc: 'Print the result as JSON' },
    quiet: { type: 'boolean', short: 'q', desc: 'Only set the exit code' },
    help: { type: 'boolean', short: 'h', desc: 'Print this help message' },
    version: { type: 'boolean', short: 'v', desc: 'Print the version number' },
};

const exitCodes = {
    0: 'running inside a container',
    1: 'not running inside a container',
    2: 'invalid usage',
};

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

const select = (values, docker, podman) => {
    if (values.docker && values.podman)
        throw new Error('--docker and --podman cannot be used together');
    if (values.docker) return docker;
    if (values.podman) return podman;
    return docker || podman;
};

const run = async () => {
    const { values } = parseArgs({ options });
    if (values.help) {
        console.log(usage);
        return;
    }
    if (values.version) {
        console.log(VERSION);
        return;
    }
    const [docker, podman] = await Promise.all([inDocker(), inPodman()]);
    const container = select(values, docker, podman);
    if (!values.quiet) {
        console.log(
            values.json
                ? JSON.stringify({ container, docker, podman })
                : String(container),
        );
    }
    process.exitCode = container ? 0 : 1;
};

await run().catch((err) => {
    console.error(`${err.message}\n\n${usage}`);
    process.exitCode = 2;
});
