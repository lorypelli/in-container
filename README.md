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

The root re-exports `inDocker`/`inPodman`/`inContainer` under `async`/`sync`
namespaces, a default export grouping them (`container` by convention), and
flat `Async`/`Sync`-suffixed functions that must be destructured:

```js
import container, { inContainerAsync } from 'in-container';

await container.async.inDocker();
await inContainerAsync();
```

CommonJS has no default/named split — `require()` returns that same object,
so destructure named pieces straight off it:

```js
const container = require('in-container');
const { inContainerSync } = container;

container.sync.inDocker();
inContainerSync();
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
