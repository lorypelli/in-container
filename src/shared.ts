import * as asyncFns from './async.js';
import * as syncFns from './sync.js';

export const async = {
    inContainer: asyncFns.inContainer,
    inDocker: asyncFns.inDocker,
    inPodman: asyncFns.inPodman,
};
export const sync = {
    inContainer: syncFns.inContainer,
    inDocker: syncFns.inDocker,
    inPodman: syncFns.inPodman,
};

function wrap<Result>(fn: () => Result): () => Result {
    return function (this: object | undefined): Result {
        'use strict';
        if (this != undefined) {
            console.error('Functions can only be used by destructuring.');
            process.exit(1);
        }
        return fn();
    };
}

export const inDockerAsync = wrap(async.inDocker);
export const inPodmanAsync = wrap(async.inPodman);
export const inContainerAsync = wrap(async.inContainer);
export const inDockerSync = wrap(sync.inDocker);
export const inPodmanSync = wrap(sync.inPodman);
export const inContainerSync = wrap(sync.inContainer);
