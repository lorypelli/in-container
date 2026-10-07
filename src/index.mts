import { async, sync } from './shared.js';

export {
    inContainerAsync,
    inContainerSync,
    inDockerAsync,
    inDockerSync,
    inPodmanAsync,
    inPodmanSync,
} from './shared.js';

const container = { async, sync };

export default container;
