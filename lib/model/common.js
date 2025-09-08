import { useSend, Text } from 'alemonjs';
import { convert2integer } from './utils/number.js';
import { getIoRedis } from '@alemonjs/db';
import { keys, keysAction, getRedisKey } from './keys.js';
import { existDataByKey, getDataJSONParseByKey } from './DataControl.js';
import dayjs from 'dayjs';
import { formatRemaining } from './actionHelper.js';

function getRandomFromARR(arr) {
    const randIndex = Math.trunc(Math.random() * arr.length);
    return arr[randIndex];
}
const BaseAction = {
    action: '空闲'
};
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
    const raw = await getDataJSONParseByKey(getRedisKey(usrId, 'action'));
    if (raw) {
        return { ...BaseAction, ...raw };
    }
    return BaseAction;
}
function notUndAndNull(obj) {
    return !isUndAndNull(obj);
}
function isUndAndNull(obj) {
    return obj === null || obj === undefined;
}
async function Go(e) {
    const userId = e.UserId;
    const Send = useSend(e);
    const ext = await existDataByKey(keys.player(userId));
    if (!ext) {
        return 0;
    }
    const redis = getIoRedis();
    const gameAction = await redis.get(keysAction.gameAction(userId));
    if (gameAction && +gameAction === 1) {
        void Send(Text('修仙：游戏进行中...'));
        return 0;
    }
    const action = await getDataJSONParseByKey(keysAction.action(userId));
    if (!action) {
        return true;
    }
    if (!action && action?.action === '空闲') {
        return true;
    }
    const actionEndTime = action?.end_time ?? 0;
    const nowTime = Date.now();
    if (nowTime <= actionEndTime) {
        const timeTuple = formatRemaining(actionEndTime - nowTime);
        void Send(Text('正在' + action.action + '中,剩余时间:' + timeTuple));
        return 0;
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
const getPushInfo = (action, playerId) => {
    let pushAddress = playerId;
    let isGroup = false;
    if (notUndAndNull(action.group_id)) {
        isGroup = true;
        pushAddress = String(action.group_id);
    }
    return { pushAddress, isGroup };
};

export { BaseAction, Go, convert2integer, common as default, getLastsign, getPlayerAction, getPushInfo, getRandomFromARR, isUndAndNull, notUndAndNull, shijianc, sleep, timestampToTime };
