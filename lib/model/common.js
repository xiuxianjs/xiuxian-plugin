import { useSend, Text } from 'alemonjs';
import { getDataByUserId } from './Redis.js';
import { safeParse } from './utils/safe.js';
import { convert2integer } from './utils/number.js';

function getRandomFromARR(arr) {
    const randIndex = Math.trunc(Math.random() * arr.length);
    return arr[randIndex];
}
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function timestampToTime(timestamp) {
    const date = new Date(timestamp);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    const D = date.getDate() + ' ';
    const h = date.getHours() + ':';
    const m = date.getMinutes() + ':';
    const s = date.getSeconds();
    return Y + M + D + h + m + s;
}
async function shijianc(time) {
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
async function getLastsign(usr_qq) {
    const time = (await getDataByUserId(usr_qq, 'lastsign_time'));
    if (time != null)
        return await shijianc(parseInt(time));
    return false;
}
async function getPlayerAction(usr_qq) {
    const raw = (await getDataByUserId(usr_qq, 'action'));
    const parsed = safeParse(raw, null);
    if (parsed) {
        return {
            action: String(parsed.action),
            time: parsed.time,
            end_time: parsed.end_time,
            plant: parsed.plant,
            mine: parsed.mine
        };
    }
    return { action: '空闲' };
}
async function dataverification(e) {
    if (e.name !== 'message.create')
        return 1;
    const usr_qq = e.UserId;
    const { existplayer } = await import('./xiuxian.js');
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return 1;
    return 0;
}
function notUndAndNull(obj) {
    return !(obj == null);
}
function isNotBlank(value) {
    return !(value === null || value === undefined || value === '');
}
async function Go(e) {
    const usr_qq = e.UserId;
    const Send = useSend(e);
    const { existplayer } = await import('./xiuxian.js');
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return 0;
    const game_action = (await getDataByUserId(usr_qq, 'game_action'));
    if (game_action === 1 || game_action === '1') {
        Send(Text('修仙：游戏进行中...'));
        return 0;
    }
    const actionRaw = (await getDataByUserId(usr_qq, 'action'));
    const action = safeParse(actionRaw, null);
    if (action) {
        const action_end_time = action.end_time ?? 0;
        const now_time = Date.now();
        if (now_time <= action_end_time) {
            const m = Math.floor((action_end_time - now_time) / 1000 / 60);
            const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
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
    dataverification,
    notUndAndNull,
    isNotBlank,
    Go,
    convert2integer
};

export { Go, convert2integer, dataverification, common as default, getLastsign, getPlayerAction, getRandomFromARR, isNotBlank, notUndAndNull, shijianc, sleep, timestampToTime };
