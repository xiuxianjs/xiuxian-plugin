import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './paths.js';
import { safeParse } from './utils/safe.js';
import { readAll } from './duanzaofu.js';

const redis = getIoRedis();
async function readDanyao(userId) {
    const raw = await redis.get(`${__PATH.danyao_path}:${userId}`);
    if (!raw)
        return [];
    const parsed = safeParse(raw, []);
    if (Array.isArray(parsed))
        return parsed;
    if (parsed && typeof parsed === 'object') {
        const legacy = parsed;
        const item = {
            name: legacy.name || '聚合丹药',
            class: '丹药',
            type: legacy.type || '聚合',
            count: legacy.count || 1,
            ...legacy
        };
        return [item];
    }
    return [];
}
async function writeDanyao(userId, list) {
    await redis.set(`${__PATH.danyao_path}:${userId}`, JSON.stringify(list));
}
var danyao = { readDanyao, writeDanyao, readAll };

export { danyao as default, readAll, readDanyao, writeDanyao };
