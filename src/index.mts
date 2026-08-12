import { async, sync } from './shared.js';

export {
    inContainerAsync,
    inDockerAsync,
    inPodmanAsync,
    inContainerSync,
    inDockerSync,
    inPodmanSync,
} from './shared.js';

const container = { async, sync };

export default container;
