# in-container

Check if the current process is running inside a container (Docker, Podman).

- Zero dependencies
- Async, non-blocking detection (no `execSync`/`spawnSync`)
- Results cached per-process — safe to call repeatedly
- Ships with TypeScript types out of the box
- Resolves `false` (never throws) on platforms without container-specific paths, e.g. Windows or macOS hosts

## Install

```sh
npm install in-container
```

## Usage

```js
import { inContainer } from 'in-container';

if (await inContainer()) {
    console.log('Running inside a container');
}
```

```js
import { inDocker } from 'in-container';

if (await inDocker()) {
    console.log('Running inside a Docker container');
}
```

```js
import { inPodman } from 'in-container';

if (await inPodman()) {
    console.log('Running inside a Podman container');
}
```

## API

### `inDocker()`

Returns `Promise<boolean>` — whether the current process appears to be running inside a Docker container.

Detected via `/.dockerenv`, a `docker` cgroup segment in `/proc/self/cgroup`, or a `/docker/containers/` mount in `/proc/self/mountinfo`. Resolves `false` on platforms without those paths (e.g. Windows, macOS hosts).

The result is cached after the first call, since it cannot change for the lifetime of the process.

### `inPodman()`

Returns `Promise<boolean>` — whether the current process appears to be running inside a Podman container.

Detected via `/run/.containerenv` or a `libpod`/`podman` cgroup segment in `/proc/self/cgroup`. Resolves `false` on platforms without those paths (e.g. Windows, macOS hosts).

The result is cached after the first call, since it cannot change for the lifetime of the process.

### `inContainer()`

Returns `Promise<boolean>` — whether the current process appears to be running inside a Docker or Podman container. Equivalent to `(await inDocker()) || (await inPodman())`.

## Requirements

This package is ESM-only. Import it with `import`; it cannot be `require()`-d from CommonJS.

## License

MIT
