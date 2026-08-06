import { access, readFile } from 'node:fs/promises';

const exists = async (path) => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
};

const cgroupHas = async (runtime) => {
    try {
        return (await readFile('/proc/self/cgroup', 'utf8')).includes(runtime);
    } catch {
        return false;
    }
};

export const inDocker = async () =>
    (await exists('/.dockerenv')) || (await cgroupHas('docker'));

export const inPodman = async () =>
    (await exists('/run/.containerenv')) || (await cgroupHas('podman'));

export const inContainer = async () => (await inDocker()) || (await inPodman());
