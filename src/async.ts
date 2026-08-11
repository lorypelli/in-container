import { access, readFile } from 'node:fs/promises';
import { dockerCgroupPattern, podmanCgroupPattern } from './patterns.js';

let cgroupPromise: Promise<string> | null = null;
let mountInfoPromise: Promise<string> | null = null;
let dockerResult: boolean | null = null;
let podmanResult: boolean | null = null;

const exists = (path: string) =>
    access(path).then(
        () => true,
        () => false,
    );

const readCgroup = () =>
    (cgroupPromise ??= readFile('/proc/self/cgroup', 'utf8').then(
        (data) => data,
        () => '',
    ));

const readMountInfo = () =>
    (mountInfoPromise ??= readFile('/proc/self/mountinfo', 'utf8').then(
        (data) => data,
        () => '',
    ));

/**
 * Whether the current process appears to be running inside a Docker container.
 *
 * Detected via `/.dockerenv`, a `docker` cgroup segment in `/proc/self/cgroup`,
 * or a `/docker/containers/` mount in `/proc/self/mountinfo`. Resolves `false`
 * on platforms without those paths (e.g. Windows, macOS hosts).
 *
 * The result is cached after the first call, since it cannot change for the
 * lifetime of the process.
 */
export const inDocker = async () => {
    if (dockerResult == null) {
        const [hasEnv, cgroup, mountInfo] = await Promise.all([
            exists('/.dockerenv'),
            readCgroup(),
            readMountInfo(),
        ]);
        dockerResult =
            hasEnv ||
            dockerCgroupPattern.test(cgroup) ||
            mountInfo.includes('/docker/containers/');
    }
    return dockerResult;
};

/**
 * Whether the current process appears to be running inside a Podman container.
 *
 * Detected via `/run/.containerenv` or a `libpod`/`podman` cgroup segment in
 * `/proc/self/cgroup`. Resolves `false` on platforms without those paths
 * (e.g. Windows, macOS hosts).
 *
 * The result is cached after the first call, since it cannot change for the
 * lifetime of the process.
 */
export const inPodman = async () => {
    if (podmanResult == null) {
        const [hasEnv, cgroup] = await Promise.all([
            exists('/run/.containerenv'),
            readCgroup(),
        ]);
        podmanResult = hasEnv || podmanCgroupPattern.test(cgroup);
    }
    return podmanResult;
};

/**
 * Whether the current process appears to be running inside a Docker or Podman
 * container — equivalent to `(await inDocker()) || (await inPodman())`.
 */
export const inContainer = async () => {
    const [docker, podman] = await Promise.all([inDocker(), inPodman()]);
    return docker || podman;
};
