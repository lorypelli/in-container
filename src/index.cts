import { async, sync } from './shared.js';

export = {
    async,
    sync,
    inContainerAsync: async.inContainer,
    inDockerAsync: async.inDocker,
    inPodmanAsync: async.inPodman,
    inContainerSync: sync.inContainer,
    inDockerSync: sync.inDocker,
    inPodmanSync: sync.inPodman,
};
