import { async, sync } from './shared.js';

export const inContainerAsync = async.inContainer;
export const inDockerAsync = async.inDocker;
export const inPodmanAsync = async.inPodman;
export const inContainerSync = sync.inContainer;
export const inDockerSync = sync.inDocker;
export const inPodmanSync = sync.inPodman;

export default { async, sync };
