import * as asyncFns from './async.js';
import * as syncFns from './sync.js';

const guard = <Result>(
    fn: () => Result,
    requireDestructured: boolean,
): (() => Result) =>
    function (this: object | undefined): Result {
        'use strict';
        const isDestructured = this == undefined;
        if (isDestructured != requireDestructured) {
            console.error(
                `Functions can only be used ${requireDestructured ? 'by' : 'without'} destructuring.`,
            );
            process.exit(1);
        }
        return fn();
    };

export const inDockerAsync = guard(asyncFns.inDocker, true);
export const inPodmanAsync = guard(asyncFns.inPodman, true);
export const inContainerAsync = guard(asyncFns.inContainer, true);
export const inDockerSync = guard(syncFns.inDocker, true);
export const inPodmanSync = guard(syncFns.inPodman, true);
export const inContainerSync = guard(syncFns.inContainer, true);

const asyncNamespace = {
    inContainer: guard(asyncFns.inContainer, false),
    inDocker: guard(asyncFns.inDocker, false),
    inPodman: guard(asyncFns.inPodman, false),
};
const syncNamespace = {
    inContainer: guard(syncFns.inContainer, false),
    inDocker: guard(syncFns.inDocker, false),
    inPodman: guard(syncFns.inPodman, false),
};

export const async = guard(() => asyncNamespace, false);
export const sync = guard(() => syncNamespace, false);
