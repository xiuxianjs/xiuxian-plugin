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

export { operationLocalLock, testTip };
