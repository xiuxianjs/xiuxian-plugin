import { redis } from '../api.js';
import { getPushInfo } from '../common.js';
import { keys, keysAction } from '../keys.js';
import { delDataByKey, setDataJSONStringifyByKey } from '../DataControl.js';
import '@alemonjs/db';
import { Text } from 'alemonjs';
import { readPlayer } from '../xiuxiandata.js';
import { addExp2, addExp } from '../economy.js';
import '../DataList.js';
import '../settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import 'classnames';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { addNajieThing, existNajieThing } from '../najie.js';
import '../currency.js';
import 'crypto';
import 'posthog-node';
import '../message.js';
import { pushMessage } from '../MessageSystem.js';

const BASE_CONFIG = {
    FIND_ITEM_CHANCE: 0.98,
    RARE_ITEM_CHANCE: 0.4,
    EPIC_ITEM_CHANCE: 0.15,
    XIUWEI_BASE: 2000,
    QIXUE_BASE: 2000,
    LEVEL_MULTIPLIER: 100,
    PHYSIQUE_MULTIPLIER: 100,
    XIUWEI_DIVISOR: 5,
    XIUWEI_MULTIPLIER: 0.1,
    QIXUE_MULTIPLIER: 0.1
};
const ITEM_EFFECTS = {
    XIUMO_DAN_MULTIPLIER: 100,
    XUEMO_DAN_MULTIPLIER: 18
};
function isExploreAction(action) {
    return !!action && typeof action === 'object' && 'end_time' in action;
}
const parseTime = (time) => {
    if (!time) {
        return 0;
    }
    const baseDuration = typeof time === 'number' ? time : parseInt(String(time || 0), 10);
    return isNaN(baseDuration) ? 0 : baseDuration;
};
const getRandomItem = (mojieData) => {
    const random1 = Math.random();
    const random2 = Math.random();
    const random3 = Math.random();
    if (random1 <= BASE_CONFIG.FIND_ITEM_CHANCE) {
        if (random2 <= BASE_CONFIG.RARE_ITEM_CHANCE) {
            if (random3 <= BASE_CONFIG.EPIC_ITEM_CHANCE && mojieData.three.length > 0) {
                const random4 = Math.floor(Math.random() * mojieData.three.length);
                const item = mojieData.three[random4];
                return {
                    thingName: item.name,
                    thingClass: item.class,
                    message: `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${item.name}]`,
                    quantity: 1,
                    t1: 2 + Math.random(),
                    t2: 2 + Math.random()
                };
            }
            else if (mojieData.two.length > 0) {
                const random4 = Math.floor(Math.random() * mojieData.two.length);
                const item = mojieData.two[random4];
                return {
                    thingName: item.name,
                    thingClass: item.class,
                    message: `在洞穴中拿到[${item.name}]`,
                    quantity: 1,
                    t1: 1 + Math.random(),
                    t2: 1 + Math.random()
                };
            }
        }
        else if (mojieData.one.length > 0) {
            const random4 = Math.floor(Math.random() * mojieData.one.length);
            const item = mojieData.one[random4];
            return {
                thingName: item.name,
                thingClass: item.class,
                message: `捡到了[${item.name}]`,
                quantity: 1,
                t1: 0.5 + Math.random() * 0.5,
                t2: 0.5 + Math.random() * 0.5
            };
        }
    }
    return {
        thingName: '',
        thingClass: '',
        message: '走在路上都没看见一只蚂蚁！',
        quantity: 1,
        t1: 2 + Math.random(),
        t2: 2 + Math.random()
    };
};
const checkLuckyBonus = (player) => {
    const random = Math.random();
    if (random < player.幸运) {
        let message = '';
        if (random < player.addluckyNo) {
            message = '福源丹生效，所以在';
        }
        else if (player.仙宠?.type === '幸运') {
            message = '仙宠使你在探索中欧气满满，所以在';
        }
        message += '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n';
        return {
            message,
            quantity: 2
        };
    }
    return {
        message: '',
        quantity: 1
    };
};
const handleLuckyPill = async (playerId, player) => {
    if ((player.islucky || 0) <= 0) {
        return '';
    }
    player.islucky--;
    let message = '';
    if (player.islucky !== 0) {
        message = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
    }
    else {
        message = '  \n本次探索后，福源丹已失效\n';
        player.幸运 -= player.addluckyNo;
        player.addluckyNo = 0;
    }
    await redis.set(keys.player(playerId), JSON.stringify(player));
    return message;
};
const calculateRewards = (player, t1, t2) => {
    const levelId = player.level_id || 0;
    const physiqueId = player.Physique_id || 0;
    const xiuwei = Math.trunc(BASE_CONFIG.XIUWEI_BASE + (BASE_CONFIG.LEVEL_MULTIPLIER * levelId * levelId * t1 * BASE_CONFIG.XIUWEI_MULTIPLIER) / BASE_CONFIG.XIUWEI_DIVISOR);
    const qixue = Math.trunc(BASE_CONFIG.QIXUE_BASE + BASE_CONFIG.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * BASE_CONFIG.QIXUE_MULTIPLIER);
    return { xiuwei, qixue, message: '' };
};
const handleItemEffects = async (playerId, xiuwei, qixue) => {
    let finalXiuwei = xiuwei;
    let finalQixue = qixue;
    if (await existNajieThing(playerId, '修魔丹', '道具')) {
        finalXiuwei *= ITEM_EFFECTS.XIUMO_DAN_MULTIPLIER;
        finalXiuwei = Math.trunc(finalXiuwei);
        await addNajieThing(playerId, '修魔丹', '道具', -1);
    }
    if (await existNajieThing(playerId, '血魔丹', '道具')) {
        finalQixue *= ITEM_EFFECTS.XUEMO_DAN_MULTIPLIER;
        finalQixue = Math.trunc(finalQixue);
        await addNajieThing(playerId, '血魔丹', '道具', -1);
    }
    return { xiuwei: finalXiuwei, qixue: finalQixue };
};
const handleExplorationComplete = async (playerId, action, result, luckyMessage, fydMessage, pushAddress, isGroup, remainingCount) => {
    const msg = [];
    const lastMessage = `${result.message},获得修为${result.xiuwei},气血${result.qixue},剩余次数${remainingCount}`;
    msg.push('\n' + luckyMessage + lastMessage + fydMessage);
    const arr = { ...action };
    if (arr.cishu === 1) {
        void delDataByKey(keysAction.action(playerId));
        await addExp2(playerId, result.qixue);
        await addExp(playerId, result.xiuwei);
        void pushMessage({
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : ''
        }, [Text(msg.join(''))]);
    }
    else {
        if (typeof arr.cishu === 'number') {
            arr.cishu--;
        }
        await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
        await addExp2(playerId, result.qixue);
        await addExp(playerId, result.xiuwei);
        void pushMessage({
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : ''
        }, [Text(msg.join(''))]);
    }
};
const processPlayerExploration = async (playerId, action, mojieData) => {
    try {
        const baseDuration = parseTime(action.time);
        const endTime = action.end_time - baseDuration;
        const nowTime = Date.now();
        if (nowTime <= endTime) {
            return false;
        }
        const player = await readPlayer(playerId);
        if (!player) {
            return false;
        }
        const { pushAddress, isGroup } = getPushInfo(action, playerId);
        const explorationResult = getRandomItem(mojieData);
        const luckyBonus = checkLuckyBonus(player);
        const finalQuantity = explorationResult.quantity * luckyBonus.quantity;
        const fydMessage = await handleLuckyPill(playerId, player);
        const settlementResult = calculateRewards(player, explorationResult.t1, explorationResult.t2);
        const { xiuwei, qixue } = await handleItemEffects(playerId, settlementResult.xiuwei, settlementResult.qixue);
        if (explorationResult.thingName && explorationResult.thingClass) {
            await addNajieThing(playerId, explorationResult.thingName, explorationResult.thingClass, finalQuantity);
        }
        const finalResult = {
            xiuwei,
            qixue,
            message: explorationResult.message
        };
        await handleExplorationComplete(playerId, action, finalResult, luckyBonus.message, fydMessage, pushAddress, isGroup, (action.cishu ?? 0) - 1);
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const handelAction = async (playerId, action, { mojieDataList }) => {
    try {
        if (!mojieDataList || mojieDataList.length === 0) {
            return;
        }
        const mojieData = mojieDataList[0];
        if (!action || !isExploreAction(action)) {
            return;
        }
        if (String(action.mojie) === '0') {
            await processPlayerExploration(playerId, action, mojieData);
        }
    }
    catch (error) {
        logger.error(error);
    }
};

export { handelAction };
