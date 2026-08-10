import { existsSync, readFileSync } from 'node:fs';
import { dockerCgroupPattern, podmanCgroupPattern } from './patterns.js';

let cgroup: string | null = null;
let mountInfo: string | null = null;
let dockerResult: boolean | null = null;
let podmanResult: boolean | null = null;

const readCgroup = () =>
    (cgroup ??= existsSync('/proc/self/cgroup')
        ? readFileSync('/proc/self/cgroup', 'utf8')
        : '');

const readMountInfo = () =>
    (mountInfo ??= existsSync('/proc/self/mountinfo')
        ? readFileSync('/proc/self/mountinfo', 'utf8')
        : '');

/**
 * Whether the current process appears to be running inside a Docker container.
 *
 * Detected via `/.dockerenv`, a `docker` cgroup segment in `/proc/self/cgroup`,
 * or a `/docker/containers/` mount in `/proc/self/mountinfo`. Returns `false`
 * on platforms without those paths (e.g. Windows, macOS hosts).
 *
 * The result is cached after the first call, since it cannot change for the
 * lifetime of the process.
 */
export const inDocker = () => {
    if (dockerResult == null) {
        dockerResult =
            existsSync('/.dockerenv') ||
            dockerCgroupPattern.test(readCgroup()) ||
            readMountInfo().includes('/docker/containers/');
    }
    return dockerResult;
};

/**
 * Whether the current process appears to be running inside a Podman container.
 *
 * Detected via `/run/.containerenv` or a `libpod`/`podman` cgroup segment in
 * `/proc/self/cgroup`. Returns `false` on platforms without those paths
 * (e.g. Windows, macOS hosts).
 *
 * The result is cached after the first call, since it cannot change for the
 * lifetime of the process.
 */
export const inPodman = () => {
    if (podmanResult == null) {
        podmanResult =
            existsSync('/run/.containerenv') ||
            podmanCgroupPattern.test(readCgroup());
    }
    return podmanResult;
};

/**
 * Whether the current process appears to be running inside a Docker or Podman
 * container — equivalent to `inDocker() || inPodman()`.
 */
export const inContainer = () => inDocker() || inPodman();
