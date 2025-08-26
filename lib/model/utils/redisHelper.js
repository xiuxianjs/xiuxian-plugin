import { redis } from '../api.js';
import { getRedisKey } from '../keys.js';
import { getDataJSONParseByKey, setDataByKey, setDataJSONStringifyByKey } from '../DataControl.js';

function getString(key) {
    return redis.get(key);
}
async function getNumber(key) {
    const v = await redis.get(key);
    if (v === null) {
        return null;
    }
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
}
function getJSON(key) {
    return getDataJSONParseByKey(key);
}
async function setValue(key, value) {
    if (typeof value === 'string') {
        await setDataByKey(key, value);
    }
    else {
        await setDataJSONStringifyByKey(key, value);
    }
}
async function incrBy(key, delta = 1) {
    const current = await getNumber(key);
    const next = (current ?? 0) + delta;
    await redis.set(key, String(next));
    return next;
}
function userKey(userId, suffix) {
    return getRedisKey(String(userId), suffix);
}
function getTimestamp(userId, suffix) {
    return getNumber(userKey(userId, suffix));
}
async function setTimestamp(userId, suffix, ts = Date.now()) {
    await redis.set(userKey(userId, suffix), String(ts));
}

export { getJSON, getNumber, getString, getTimestamp, incrBy, setTimestamp, setValue, userKey };
