# in-container

Detect whether the current process is running inside a container (Docker or
Podman) — `inDocker()`/`inPodman()` check filesystem/cgroup signals,
`inContainer()` is their OR. Zero dependencies, async/sync flavors, resolves
`false` (never throws; heuristic, forgeable) with no signal, e.g.
Windows/macOS hosts or other runtimes.

Node.js `>=14.18.0`; CLI needs `>=16.17.0 <17.0.0` or `>=18.3.0` for
`parseArgs`. ESM and CommonJS.

```sh
npm install in-container
```

## Usage

```js
import { inContainer } from 'in-container/async'; // or 'in-container/sync'

if (await inContainer()) console.log('Running inside a container');
```

The root re-exports `inDocker`/`inPodman`/`inContainer` under `async()`/
`sync()` namespace functions, a default export grouping them (`container` by
convention), and flat `Async`/`Sync`-suffixed functions — the two forms
require opposite call styles:

- Namespace functions (`container.async()`, etc.) must be called attached to
  `container` — they return an object whose own methods must, in turn, stay
  attached to that returned object.
- Flat functions (`inContainerAsync`, etc.) must be destructured — call them
  standalone, not dotted off `container`.

```js
import container, { inContainerAsync } from 'in-container';

await container.async().inDocker(); // ok: async() called attached to container
await inContainerAsync(); // ok: destructured out

const { async } = container;
async(); // throws: async pulled off container, called detached

const { inDocker } = container.async();
inDocker(); // throws: pulled out of the returned namespace

container.inContainerAsync(); // throws: called attached, not destructured
```

`async`/`sync` also aren't importable as named exports — only reachable via
the default export.

CommonJS has no default/named split — `require()` returns that same object,
so the same rules apply straight off it:

```js
const container = require('in-container');
const { inContainerSync } = container;

container.sync().inDocker(); // ok
inContainerSync(); // ok
```

## CLI

```sh
npx in-container [-q|--quiet] [-h|--help] [-v|--version]
```

Prints `{"container":true,"docker":true,"podman":false}`, exits `0`/`1`/`2`
for detected/not detected/invalid usage; `--quiet` skips the JSON.

## Development

```sh
pnpm install && pnpm build   # dist/ + type declarations
pnpm format                  # prettier
```

MIT licensed.
