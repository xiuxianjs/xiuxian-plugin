const cdCache = {};

/**
 * @param UID
 * @returns
 */
export const operationLocalLock = (UID: string) => {
  const Now = Date.now();

  // 2300
  if (cdCache[UID] && Number(cdCache[UID]) + 2300 > Now) {
    return false;
  }
  cdCache[UID] = Now;

  return true;
};

const testCache = {};

/**
 * @param UID
 * @returns
 */
/**
 * @param UID
 * @returns
 */
export const testTip = (UID: string) => {
  if (testCache) { return true; }
  testCache[UID] = true;

  return false;
};
