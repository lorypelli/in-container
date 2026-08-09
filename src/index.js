import { access, readFile } from 'node:fs/promises';

const dockerCgroupPattern = /(?:^|[/:-])docker(?:[/:-]|$)/m;
const podmanCgroupPattern = /(?:^|[/:-])(?:libpod|podman)(?:[/:-]|$)/m;

let cgroupPromise = null;
let mountInfoPromise = null;
let dockerResult = null;
let podmanResult = null;

const exists = (path) =>
    access(path).then(
        () => true,
        () => false,
    );

const readCgroup = () =>
    (cgroupPromise ??= readFile('/proc/self/cgroup', 'utf8').catch(() => ''));

const readMountInfo = () =>
    (mountInfoPromise ??= readFile('/proc/self/mountinfo', 'utf8').catch(
        () => '',
    ));

export const inDocker = async () => {
    if (dockerResult == null) {
        const [hasEnv, cgroup, mountInfo] = await Promise.all([
            exists('/.dockerenv'),
            readCgroup(),
            readMountInfo(),
        ]);
        dockerResult =
            hasEnv ||
            dockerCgroupPattern.test(cgroup) ||
            mountInfo.includes('/docker/containers/');
    }
    return dockerResult;
};

export const inPodman = async () => {
    if (podmanResult == null) {
        const [hasEnv, cgroup] = await Promise.all([
            exists('/run/.containerenv'),
            readCgroup(),
        ]);
        podmanResult = hasEnv || podmanCgroupPattern.test(cgroup);
    }
    return podmanResult;
};

export const inContainer = async () => {
    const [docker, podman] = await Promise.all([inDocker(), inPodman()]);
    return docker || podman;
};
