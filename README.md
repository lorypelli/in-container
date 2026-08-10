# in-container

Check if the current process is running inside a container (Docker, Podman).

- Zero dependencies
- Usable as a library or as a CLI
- Both async and sync flavors
- Resolves/returns `false` (never throws) on platforms without container-specific paths, e.g. Windows or macOS hosts

## Requirements

- **Node.js `>=14.18.0`** to use as a library.
- The CLI additionally requires `>=16.17.0 <17.0.0` or `>=18.3.0`, since it
  relies on `parseArgs` from `node:util`. On older versions it exits `2` with
  an explanatory error instead of failing silently.
- Works from both ESM (`import`) and CommonJS (`require`).

## Install

```sh
npm install in-container
```

## Usage

```js
import { inContainer } from 'in-container/async';

if (await inContainer()) {
    console.log('Running inside a container');
}
```

```js
import { inContainer } from 'in-container/sync';

if (inContainer()) {
    console.log('Running inside a container');
}
```

The package root (`in-container`) re-exports both flavors, suffixed `Async`/`Sync`:

```js
import { inContainerAsync, inContainerSync } from 'in-container';
```

The same applies to `inDocker`/`inDockerAsync`/`inDockerSync` and
`inPodman`/`inPodmanAsync`/`inPodmanSync`.

## API

### `inDocker()`

Whether the current process appears to be running inside a Docker container.
Detected via `/.dockerenv`, a `docker` cgroup segment in `/proc/self/cgroup`,
or a `/docker/containers/` mount in `/proc/self/mountinfo`.

### `inPodman()`

Whether the current process appears to be running inside a Podman container.
Detected via `/run/.containerenv` or a `libpod`/`podman` cgroup segment in
`/proc/self/cgroup`.

### `inContainer()`

Equivalent to `inDocker() || inPodman()` (or the awaited equivalent for the
async version).

## CLI

```sh
npx in-container
```

```
Usage: in-container [options]

Options:
  -q, --quiet    Only set the exit code
  -h, --help     Print this help message
  -v, --version  Print the version number

Exit code:
  0  running inside a container
  1  not running inside a container
  2  invalid usage
```

By default it prints all three results as JSON:

```sh
$ in-container
{"container":true,"docker":true,"podman":false}
```

Use `--quiet` in scripts that only care about the exit code:

```sh
if in-container --quiet; then
    echo 'Running inside a container'
fi
```

## Limitations

Container detection is a heuristic, not a guarantee:

- Only Docker and Podman are detected — other runtimes (containerd, CRI-O,
  LXC, plain namespaces) usually leave none of these signals, so many
  Kubernetes pods will report `false`.
- With Docker Desktop on macOS/Windows, your process runs on the host, not in
  the Linux VM, so the answer is correctly `false`.
- The signals are forgeable — do not use this as a security boundary.

## Development

```sh
pnpm install
pnpm build     # bundle src/ to dist/ with tsdown, and emit the type declarations
pnpm format    # prettier
```

## License

MIT
