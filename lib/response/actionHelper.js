import { getJSON, setValue, userKey } from '../model/utils/redisHelper.js';

function actionRedisKey(userId, suffix = 'action') {
    return userKey(userId, suffix);
}
async function readAction(userId) {
    return getJSON(actionRedisKey(userId));
}
async function readActionWithSuffix(userId, suffix) {
    return getJSON(actionRedisKey(userId, suffix));
}
async function writeAction(userId, record) {
    await setValue(actionRedisKey(userId), record);
}
async function writeActionWithSuffix(userId, suffix, record) {
    await setValue(actionRedisKey(userId, suffix), record);
}
function isActionRunning(record, now = Date.now()) {
    if (!record)
        return false;
    return now <= record.end_time;
}
async function startAction(userId, name, durationMs, flags) {
    return startActionWithSuffix(userId, 'action', name, durationMs, flags);
}
async function startActionWithSuffix(userId, suffix, name, durationMs, flags) {
    const now = Date.now();
    const record = {
        action: name,
        end_time: now + durationMs,
        time: durationMs,
        ...flags
    };
    await writeActionWithSuffix(userId, suffix, record);
    return record;
}
function normalizeBiguanMinutes(raw) {
    const DEFAULT_MIN = 30;
    const STEP = 30;
    const MAX_MULTIPLIER = 240;
    if (!raw || Number.isNaN(raw))
        return DEFAULT_MIN;
    let m = Math.max(raw, DEFAULT_MIN);
    for (let i = MAX_MULTIPLIER; i > 0; i--) {
        if (m >= STEP * i) {
            m = STEP * i;
            break;
        }
    }
    return m;
}
function normalizeDurationMinutes(raw, step, loops, min) {
    const parsed = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    if (Number.isNaN(parsed))
        return min;
    let m = parsed;
    const max = step * loops;
    if (m > max)
        m = max;
    for (let i = loops; i > 0; i--) {
        if (m >= step * i) {
            m = step * i;
            break;
        }
    }
    if (m < min)
        m = min;
    return m;
}
function remainingMs(record, now = Date.now()) {
    return Math.max(0, record.end_time - now);
}
function formatRemaining(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total - m * 60;
    return `${m}分${s}秒`;
}
async function updateAction(userId, updater) {
    const prev = await readAction(userId);
    const next = updater(prev);
    if (next)
        await writeAction(userId, next);
    return next;
}
async function updateActionWithSuffix(userId, suffix, updater) {
    const prev = await readActionWithSuffix(userId, suffix);
    const next = updater(prev);
    if (next)
        await writeActionWithSuffix(userId, suffix, next);
    return next;
}
async function stopAction(userId, extra = {}) {
    return updateAction(userId, prev => {
        if (!prev)
            return null;
        return {
            ...prev,
            end_time: Date.now(),
            ...extra
        };
    });
}
async function stopActionWithSuffix(userId, suffix, extra = {}) {
    return updateActionWithSuffix(userId, suffix, prev => {
        if (!prev)
            return null;
        return {
            ...prev,
            end_time: Date.now(),
            ...extra
        };
    });
}

export { actionRedisKey, formatRemaining, isActionRunning, normalizeBiguanMinutes, normalizeDurationMinutes, readAction, readActionWithSuffix, remainingMs, startAction, startActionWithSuffix, stopAction, stopActionWithSuffix, updateAction, updateActionWithSuffix, writeAction, writeActionWithSuffix };
