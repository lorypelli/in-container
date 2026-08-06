/**
 * Whether the current process appears to be running inside a Docker container.
 *
 * Detected via `/.dockerenv` or a `docker` entry in `/proc/self/cgroup`.
 * Resolves `false` on platforms without those paths (e.g. Windows, macOS hosts).
 */
export declare const inDocker: () => Promise<boolean>;

/**
 * Whether the current process appears to be running inside a Podman container.
 *
 * Detected via `/run/.containerenv` or a `podman` entry in `/proc/self/cgroup`.
 * Resolves `false` on platforms without those paths (e.g. Windows, macOS hosts).
 */
export declare const inPodman: () => Promise<boolean>;

/**
 * Whether the current process appears to be running inside a Docker or Podman
 * container — equivalent to `(await inDocker()) || (await inPodman())`.
 */
export declare const inContainer: () => Promise<boolean>;
