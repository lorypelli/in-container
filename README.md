# in-container

Check if the current process is running inside a container (Docker, Podman).

- Zero dependencies
- Usable as a library or as a CLI
- Both async, non-blocking (no `execSync`/`spawnSync`) and sync flavors
- Results cached per-process — safe to call repeatedly
- Ships with TypeScript types out of the box
- Resolves/returns `false` (never throws) on platforms without container-specific paths, e.g. Windows or macOS hosts

## Install

```sh
npm install in-container
```

## Usage

The package ships two flavors — async (non-blocking, uses `node:fs/promises`)
and sync (blocking, uses `node:fs`). Import from a specific subpath to get the
unprefixed names, or from the package root to get both, disambiguated with a
`Sync`/`Async` suffix.

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

```js
import { inContainerAsync, inContainerSync } from 'in-container';

await inContainerAsync();
inContainerSync();
```

The same applies to `inDocker`/`inDockerAsync`/`inDockerSync` and
`inPodman`/`inPodmanAsync`/`inPodmanSync`.

Async functions return a promise, so `await` them (or `.then()` them) — a bare
`if (inContainerAsync())` is always truthy, because a promise is an object.

## API

Each function is available in two forms: an async version (`Promise<boolean>`,
non-blocking) from `in-container/async`, and a sync version (`boolean`,
blocking) from `in-container/sync`. The package root (`in-container`)
re-exports both, suffixed `Async`/`Sync`.

### `inDocker()`

Whether the current process appears to be running inside a Docker container.

Detected via `/.dockerenv`, a `docker` cgroup segment in `/proc/self/cgroup`, or a `/docker/containers/` mount in `/proc/self/mountinfo`. Resolves/returns `false` on platforms without those paths (e.g. Windows, macOS hosts).

The result is cached after the first call, since it cannot change for the lifetime of the process.

### `inPodman()`

Whether the current process appears to be running inside a Podman container.

Detected via `/run/.containerenv` or a `libpod`/`podman` cgroup segment in `/proc/self/cgroup`. Resolves/returns `false` on platforms without those paths (e.g. Windows, macOS hosts).

The result is cached after the first call, since it cannot change for the lifetime of the process.

### `inContainer()`

Whether the current process appears to be running inside a Docker or Podman container. Equivalent to `inDocker() || inPodman()` (or the awaited equivalent for the async version).

The async version runs both checks concurrently, so it costs no more than calling either one alone.

## CLI

```sh
npx in-container
```

```
Usage: in-container [options]

Check if the current process is running inside a container (Docker, Podman).

Options:
  -q, --quiet    Only set the exit code
  -h, --help     Print this help message
  -v, --version  Print the version number

Exit code:
  0  running inside a container
  1  not running inside a container
  2  invalid usage
```

### What it prints

The CLI always runs both checks and prints all three results as JSON, and
exits `0` or `1` to match `container`, so it drops straight into a shell
condition:

```sh
$ in-container
{"container":true,"docker":true,"podman":false}
```

```sh
if in-container --quiet; then
    echo 'Running inside a container'
fi
```

`container` is `docker || podman`; `docker` and `podman` are the raw
per-runtime results.

### `--quiet`

Prints nothing and only sets the exit code — useful in scripts that care about
the answer but not the output:

```sh
in-container --quiet || echo 'On the host'
```

### Errors

An unknown flag prints the message and the full usage text to **stderr** and
exits `2`. A failed _detection_ never causes this — unreadable or missing
`/proc` files are treated as "no evidence of a container", not as an error.

## How detection works

No processes are spawned and nothing blocks the event loop. The CLI and the
library read the same handful of Linux paths:

| Signal                                              | Implies |
| --------------------------------------------------- | ------- |
| `/.dockerenv` exists                                | Docker  |
| `/docker/containers/` in `/proc/self/mountinfo`     | Docker  |
| `docker` segment in `/proc/self/cgroup`             | Docker  |
| `/run/.containerenv` exists                         | Podman  |
| `libpod` or `podman` segment in `/proc/self/cgroup` | Podman  |

Each file is read at most once per process, and `/proc/self/cgroup` is shared
between the Docker and Podman checks rather than read twice. Any read or
`access` failure — including every one of these paths being absent, as on a
Windows or macOS host — resolves to `false` instead of throwing.

Results are memoised after the first call, so repeated calls anywhere in your
program are free.

## Limitations

Container detection is a heuristic, not a guarantee. Specifically:

- **Only Docker and Podman are detected.** Other runtimes — containerd, CRI-O,
  LXC, plain namespaces — usually leave none of the signals above, so you will
  get `false` inside them. That includes many Kubernetes pods, which commonly
  run under containerd rather than Docker.
- **cgroup v2 hides more.** On a unified hierarchy `/proc/self/cgroup` is often
  just `0::/` inside a container, with no runtime name in it. Detection then
  rests on `/.dockerenv` or `/run/.containerenv` being present.
- **The host is not the VM.** With Docker Desktop on macOS or Windows, your
  process runs on the host, not in the Linux VM, so the answer is `false` — which
  is correct, if occasionally surprising.
- **The signals are forgeable.** Anything that can write `/.dockerenv` can make
  this report `true`. Do not use it as a security boundary.

## Requirements

- **Node.js `>=16.17.0 <17.0.0` or `>=18.3.0`** — the CLI uses `parseArgs` from `node:util`.
- Works from both ESM (`import`) and CommonJS (`require`).

## Development

```sh
pnpm install
pnpm build     # bundle src/ to dist/ with tsdown, and emit the type declarations
pnpm format    # prettier
```

`src/async.ts` and `src/sync.ts` hold the two detection implementations,
`src/index.ts` re-exports both under `Async`/`Sync`-suffixed names, and
`src/cli.ts` is the executable published as the `in-container` bin. The build
replaces the bare `VERSION` identifier in the CLI with the version from
`package.json` via tsdown's `define`, which is what `--version` prints — it is
declared ambient in `src/cli.ts` for the type-checker and does not exist at
runtime before bundling.

## License

MIT
