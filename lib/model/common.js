import { useSend, Text } from 'alemonjs';
import { safeParse } from './utils/safe.js';
import { convert2integer } from './utils/number.js';
import { getIoRedis } from '@alemonjs/db';
import { keys, keysAction, getRedisKey } from './keys.js';
import { existDataByKey } from './DataControl.js';
import dayjs from 'dayjs';

function getRandomFromARR(arr) {
    const randIndex = Math.trunc(Math.random() * arr.length);
    return arr[randIndex];
}
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function timestampToTime(timestamp) {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
function shijianc(time) {
    const date = new Date(time);
    return {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
}
async function getLastsign(usrId) {
    const redis = getIoRedis();
    const time = await redis.get(getRedisKey(usrId, 'lastsign_time'));
    if (time !== null) {
        return shijianc(parseInt(time));
    }
    return false;
}
async function getPlayerAction(usrId) {
    const redis = getIoRedis();
    const raw = await redis.get(getRedisKey(usrId, 'action'));
    const parsed = safeParse(raw, null);
    if (parsed) {
        return {
            action: String(parsed.action),
            time: parsed.time,
            end_time: parsed.end_time,
            plant: parsed.plant,
            mine: parsed.mine,
            is_jiesuan: parsed.is_jiesuan ?? 0
        };
    }
    return { action: '空闲' };
}
function notUndAndNull(obj) {
    return !(obj === null || obj === undefined);
}
async function Go(e) {
    const userId = e.UserId;
    const Send = useSend(e);
    const ext = await existDataByKey(keys.player(userId));
    if (!ext) {
        return 0;
    }
    const redis = getIoRedis();
    const game_action = await redis.get(keysAction.gameAction(userId));
    if (game_action === '1') {
        void Send(Text('修仙：游戏进行中...'));
        return 0;
    }
    const actionRaw = await redis.get(getRedisKey(userId, 'action'));
    const action = safeParse(actionRaw, null);
    if (action) {
        const action_end_time = action.end_time ?? 0;
        const now_time = Date.now();
        if (now_time <= action_end_time) {
            const m = Math.floor((action_end_time - now_time) / 1000 / 60);
            const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            void Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return 0;
        }
    }
    return true;
}
var common = {
    getRandomFromARR,
    sleep,
    timestampToTime,
    shijianc,
    getLastsign,
    getPlayerAction,
    notUndAndNull,
    Go,
    convert2integer
};

export { Go, convert2integer, common as default, getLastsign, getPlayerAction, getRandomFromARR, notUndAndNull, shijianc, sleep, timestampToTime };
