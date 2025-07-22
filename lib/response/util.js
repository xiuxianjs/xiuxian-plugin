import { dirname } from 'path';
import { fileURLToPath } from 'url';

const createEventName = (url, select = 'apps') => {
    const __dirname = dirname(fileURLToPath(url));
    const dirs = __dirname.split('/').reverse();
    const name = dirs.slice(0, dirs.indexOf(select)).join(':');
    return `xiuxian:${select}:${name}`;
};
const cdCache = {};
const operationLocalLock = (UID) => {
    const Now = Date.now();
    if (cdCache[UID] && Number(cdCache[UID]) + 2300 > Now) {
        return false;
    }
    cdCache[UID] = Now;
    return true;
};
const testCache = {};
const testTip = (UID) => {
    if (testCache)
        return true;
    testCache[UID] = true;
    return false;
};

export { createEventName, operationLocalLock, testTip };
