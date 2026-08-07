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
export declare const inDocker: () => Promise<boolean>;

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
export declare const inPodman: () => Promise<boolean>;

/**
 * Whether the current process appears to be running inside a Docker or Podman
 * container — equivalent to `(await inDocker()) || (await inPodman())`.
 */
export declare const inContainer: () => Promise<boolean>;
