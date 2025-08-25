import { redis } from '../api.js';
import { getRedisKey } from '../keys.js';

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
async function getJSON(key) {
    const v = await redis.get(key);
    if (v === null) {
        return null;
    }
    try {
        return JSON.parse(v);
    }
    catch {
        return null;
    }
}
async function setValue(key, value) {
    if (typeof value === 'string') {
        await redis.set(key, value);
    }
    else {
        await redis.set(key, JSON.stringify(value));
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
