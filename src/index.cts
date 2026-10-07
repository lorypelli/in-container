import {
    async,
    inContainerAsync,
    inContainerSync,
    inDockerAsync,
    inDockerSync,
    inPodmanAsync,
    inPodmanSync,
    sync,
} from './shared.js';

const container = {
    async,
    sync,
    inContainerAsync,
    inDockerAsync,
    inPodmanAsync,
    inContainerSync,
    inDockerSync,
    inPodmanSync,
};

export = container;
