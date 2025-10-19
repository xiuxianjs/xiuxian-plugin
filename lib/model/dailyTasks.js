import { redis } from './api.js';
import { keysAction } from './keys.js';
import { getDataByKey } from './DataControl.js';
import './DataList.js';
import '@alemonjs/db';
import 'alemonjs';
import { shijianc } from './common.js';
import { readPlayer, writePlayer } from './xiuxiandata.js';
import './settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import './currency.js';
import 'crypto';
import 'posthog-node';
import './message.js';
import { readTiandibang, writeTiandibang } from './tian.js';

function isDateParts(v) {
    return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}
function isSameDay(time1, time2) {
    const d1 = shijianc(time1);
    const d2 = shijianc(time2);
    return d1.Y === d2.Y && d1.M === d2.M && d1.D === d2.D;
}
function isDayChanged(a, b) {
    if (!a || !b) {
        return true;
    }
    return a.Y !== b.Y || a.M !== b.M || a.D !== b.D;
}
async function checkSignStatus(userId) {
    const nowTime = Date.now();
    const lastSignRaw = await redis.get(keysAction.lastSignTime(userId));
    let completed = false;
    if (lastSignRaw) {
        try {
            const lastSignStruct = JSON.parse(lastSignRaw);
            if (lastSignStruct && isSameDay(lastSignStruct.time, nowTime) && (lastSignStruct.sign === 1 || lastSignStruct.sign === 2)) {
                completed = true;
            }
        }
        catch (error) {
            console.error('检查签到状态解析错误', error);
        }
    }
    const player = await readPlayer(userId);
    const consecutiveDays = player?.连续签到天数 ?? 0;
    return {
        completed,
        consecutiveDays
    };
}
async function checkBiwuStatus(userId) {
    const MAX_BIWU_PER_DAY = 3;
    const tiandibang = await readTiandibang();
    const playerIndex = tiandibang.findIndex(item => item.qq === userId);
    if (playerIndex === -1) {
        return {
            completed: false,
            currentCount: 0,
            maxCount: MAX_BIWU_PER_DAY,
            isRegistered: false,
            remainingCount: 0
        };
    }
    const now = new Date();
    const nowTime = now.getTime();
    const Today = shijianc(nowTime);
    const timeStr = await redis.get(keysAction.lastBisaiTime(userId));
    let needsReset = false;
    if (timeStr === null) {
        await redis.set(keysAction.lastBisaiTime(userId), nowTime);
        needsReset = true;
    }
    else {
        const lastBisaiTime = shijianc(parseInt(timeStr, 10));
        if (Today.Y !== lastBisaiTime.Y || Today.M !== lastBisaiTime.M || Today.D !== lastBisaiTime.D) {
            await redis.set(keysAction.lastBisaiTime(userId), nowTime);
            needsReset = true;
        }
    }
    if (needsReset) {
        tiandibang[playerIndex].次数 = MAX_BIWU_PER_DAY;
        await writeTiandibang(tiandibang);
    }
    const remainingCount = typeof tiandibang[playerIndex].次数 === 'number' ? Math.max(0, tiandibang[playerIndex].次数) : 0;
    const currentCount = MAX_BIWU_PER_DAY - remainingCount;
    const completed = remainingCount === 0;
    return {
        completed,
        currentCount,
        maxCount: MAX_BIWU_PER_DAY,
        isRegistered: true,
        remainingCount
    };
}
async function checkExploitationStatus(userId) {
    const nowTime = Date.now();
    const today = shijianc(nowTime);
    const lastsignTime = await getLastsignExplor(userId);
    let completed = false;
    if (isDateParts(today) && isDateParts(lastsignTime)) {
        if (today.Y === lastsignTime.Y && today.M === lastsignTime.M && today.D === lastsignTime.D) {
            completed = true;
        }
    }
    return {
        completed
    };
}
async function getLastsignExplor(userId) {
    const time = await getDataByKey(keysAction.getLastSignExplor(userId));
    if (time) {
        const parts = shijianc(Number(time));
        if (isDateParts(parts)) {
            return parts;
        }
    }
    return null;
}
async function checkBeastBonusStatus(userId) {
    const nowTime = Date.now();
    const today = shijianc(nowTime);
    const lastsignTime = await getLastsignBonus(userId);
    let completed = false;
    if (isDateParts(today) && isDateParts(lastsignTime)) {
        if (today.Y === lastsignTime.Y && today.M === lastsignTime.M && today.D === lastsignTime.D) {
            completed = true;
        }
    }
    return {
        completed
    };
}
async function getLastsignBonus(userId) {
    const time = await getDataByKey(keysAction.getLastSignBonus(userId));
    if (time) {
        const parts = shijianc(Number(time));
        if (isDateParts(parts)) {
            return parts;
        }
    }
    return null;
}
function getMaxShenjieCountByLinggen(player) {
    const linggenName = player?.灵根?.name;
    if (!linggenName) {
        return 1;
    }
    if (linggenName === '二转轮回体') {
        return 2;
    }
    else if (linggenName === '三转轮回体' || linggenName === '四转轮回体') {
        return 3;
    }
    else if (linggenName === '五转轮回体' || linggenName === '六转轮回体') {
        return 4;
    }
    else if (linggenName === '七转轮回体' || linggenName === '八转轮回体') {
        return 4;
    }
    else if (linggenName === '九转轮回体') {
        return 5;
    }
    return 1;
}
async function checkShenjieStatus(userId) {
    let player = await readPlayer(userId);
    if (!player) {
        return {
            remainingCount: 0,
            maxCount: 1,
            isMojie: false,
            modaoValue: 0
        };
    }
    const modaoValue = typeof player.魔道值 === 'number' ? player.魔道值 : 0;
    const isMojie = modaoValue > 0;
    if (isMojie) {
        return {
            remainingCount: 0,
            maxCount: 0,
            isMojie: true,
            modaoValue
        };
    }
    const now = Date.now();
    const today = shijianc(now);
    const lastTimeRaw = await redis.get(keysAction.lastDagongTime(userId));
    const lastDay = lastTimeRaw ? shijianc(Number(lastTimeRaw)) : null;
    if (isDayChanged(today, lastDay)) {
        await redis.set(keysAction.lastDagongTime(userId), String(now));
        const newCount = getMaxShenjieCountByLinggen(player);
        player.神界次数 = newCount;
        await writePlayer(userId, player);
    }
    player = await readPlayer(userId);
    if (!player) {
        return {
            remainingCount: 0,
            maxCount: 1,
            isMojie: false,
            modaoValue: 0
        };
    }
    const maxCount = getMaxShenjieCountByLinggen(player);
    const remainingCount = Math.max(0, typeof player.神界次数 === 'number' ? player.神界次数 : maxCount);
    return {
        remainingCount,
        maxCount,
        isMojie: false,
        modaoValue: 0
    };
}
async function getAllDailyTasksStatus(userId) {
    const [sign, biwu, exploitation, beastBonus, shenjie] = await Promise.all([
        checkSignStatus(userId),
        checkBiwuStatus(userId),
        checkExploitationStatus(userId),
        checkBeastBonusStatus(userId),
        checkShenjieStatus(userId)
    ]);
    return {
        sign,
        biwu,
        exploitation,
        beastBonus,
        shenjie
    };
}

export { checkBeastBonusStatus, checkBiwuStatus, checkExploitationStatus, checkShenjieStatus, checkSignStatus, getAllDailyTasksStatus };
