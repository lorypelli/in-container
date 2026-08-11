import {
    inContainer as inContainerAsync,
    inDocker as inDockerAsync,
    inPodman as inPodmanAsync,
} from './async.js';
import {
    inContainer as inContainerSync,
    inDocker as inDockerSync,
    inPodman as inPodmanSync,
} from './sync.js';

export const async = {
    inContainer: inContainerAsync,
    inDocker: inDockerAsync,
    inPodman: inPodmanAsync,
};
export const sync = {
    inContainer: inContainerSync,
    inDocker: inDockerSync,
    inPodman: inPodmanSync,
};
