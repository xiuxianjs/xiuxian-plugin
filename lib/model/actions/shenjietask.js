import { pushInfo } from '../api.js';
import { notUndAndNull } from '../common.js';
import { keysAction } from '../keys.js';
import { setDataJSONStringifyByKey } from '../DataControl.js';
import '@alemonjs/db';
import { Mention } from 'alemonjs';
import { readPlayer, writePlayer } from '../xiuxiandata.js';
import { addExp2, addExp } from '../economy.js';
import '../DataList.js';
import { NAJIE_CATEGORIES } from '../settions.js';
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
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../najie.js';
import '../currency.js';
import 'crypto';
import 'posthog-node';
import { readTemp, writeTemp } from '../temp.js';
import '../message.js';

function isNajieCategory(v) {
    return typeof v === 'string' && NAJIE_CATEGORIES.includes(v);
}
const EXPLORATION_PROBABILITIES = {
    FIND_ITEM: 0.98,
    RARE_ITEM: 0.4,
    EPIC_ITEM: 0.15
};
const BASE_REWARDS = {
    XIUWEI_BASE: 2000,
    QIXUE_BASE: 2000,
    LEVEL_MULTIPLIER: 100,
    PHYSIQUE_MULTIPLIER: 100
};
const getRandomItem = (place, random1, random2, random3) => {
    if (random1 <= EXPLORATION_PROBABILITIES.FIND_ITEM) {
        if (random2 <= EXPLORATION_PROBABILITIES.RARE_ITEM) {
            if (random3 <= EXPLORATION_PROBABILITIES.EPIC_ITEM && place.three.length > 0) {
                const idx = Math.floor(Math.random() * place.three.length);
                const item = place.three[idx];
                return {
                    item: {
                        name: item.name,
                        class: isNajieCategory(item.class) ? item.class : '道具'
                    },
                    message: `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${item.name}]`,
                    t1: 2 + Math.random(),
                    t2: 2 + Math.random()
                };
            }
            else if (place.two.length > 0) {
                const idx = Math.floor(Math.random() * place.two.length);
                const item = place.two[idx];
                return {
                    item: {
                        name: item.name,
                        class: isNajieCategory(item.class) ? item.class : '道具'
                    },
                    message: `在洞穴中拿到[${item.name}]`,
                    t1: 1 + Math.random(),
                    t2: 1 + Math.random()
                };
            }
        }
        else if (place.one.length > 0) {
            const idx = Math.floor(Math.random() * place.one.length);
            const item = place.one[idx];
            return {
                item: {
                    name: item.name,
                    class: isNajieCategory(item.class) ? item.class : '道具'
                },
                message: `捡到了[${item.name}]`,
                t1: 0.5 + Math.random() * 0.5,
                t2: 0.5 + Math.random() * 0.5
            };
        }
    }
    return {
        message: '走在路上都没看见一只蚂蚁！',
        t1: 2 + Math.random(),
        t2: 2 + Math.random()
    };
};
const checkLuckyBonus = (player) => {
    const random = Math.random();
    const lucky = Number(player.幸运) || 0;
    const addLucky = Number(player.addluckyNo) || 0;
    if (random < lucky) {
        let message = '';
        if (random < addLucky) {
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
        player.幸运 = Number(player.幸运 ?? 0) - Number(player.addluckyNo ?? 0);
        player.addluckyNo = 0;
    }
    await writePlayer(playerId, player);
    return message;
};
const calculateRewards = (player, t1, t2) => {
    const levelId = player.level_id ?? 0;
    const physiqueId = player.Physique_id ?? 0;
    const xiuwei = Math.trunc(BASE_REWARDS.XIUWEI_BASE + (BASE_REWARDS.LEVEL_MULTIPLIER * levelId * levelId * t1 * 0.1) / 5);
    const qixue = Math.trunc(BASE_REWARDS.QIXUE_BASE + BASE_REWARDS.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * 0.1);
    return { xiuwei, qixue };
};
const handleExplorationComplete = async (playerId, player, action, result, luckyMessage, fydMessage, pushAddress, isGroup = false) => {
    const msg = [Mention(playerId)];
    const lastMessage = `${result.message},获得修为${result.xiuwei},气血${result.qixue},剩余次数${(Number(action.cishu) || 0) - 1}`;
    msg.push('\n' + player.名号 + luckyMessage + lastMessage + fydMessage);
    const arr = action;
    const remain = Number(arr.cishu) || 0;
    if (remain <= 1) {
        arr.shutup = 1;
        arr.working = 1;
        arr.power_up = 1;
        arr.Place_action = 1;
        arr.Place_actionplus = 1;
        arr.mojie = 1;
        arr.end_time = Date.now();
        delete arr.group_id;
        await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
        await addExp2(playerId, result.qixue);
        await addExp(playerId, result.xiuwei);
        if (isGroup && pushAddress) {
            pushInfo(pushAddress, isGroup, msg);
        }
        else {
            pushInfo(playerId, isGroup, msg);
        }
    }
    else {
        arr.cishu = remain - 1;
        await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
        await addExp2(playerId, result.qixue);
        await addExp(playerId, result.xiuwei);
        await recordTempMessage(player.名号 + luckyMessage + lastMessage + fydMessage, playerId, pushAddress);
    }
};
const recordTempMessage = async (message, playerId, pushAddress) => {
    try {
        const temp = await readTemp();
        const p = {
            msg: message,
            qq_group: pushAddress
        };
        temp.push(p);
        await writeTemp(temp);
    }
    catch {
        const temp = [];
        const p = {
            msg: message,
            qq: playerId,
            qq_group: pushAddress
        };
        temp.push(p);
        await writeTemp(temp);
    }
};
const processPlayerExploration = async (playerId, action, place) => {
    try {
        let pushAddress;
        let isGroup = false;
        if ('group_id' in action && notUndAndNull(action.group_id)) {
            isGroup = true;
            pushAddress = String(action.group_id);
        }
        let endTime = Number(action.end_time) || 0;
        const nowTime = Date.now();
        const player = await readPlayer(playerId);
        if (!player) {
            return false;
        }
        if (String(action.mojie) === '-1') {
            endTime = endTime - Number(action.time ?? 0);
            if (nowTime > endTime) {
                if (!place) {
                    return false;
                }
                const random1 = Math.random();
                const random2 = Math.random();
                const random3 = Math.random();
                const { item, message, t1, t2 } = getRandomItem(place, random1, random2, random3);
                const luckyBonus = checkLuckyBonus(player);
                const fydMessage = await handleLuckyPill(playerId, player);
                const { xiuwei, qixue } = calculateRewards(player, t1, t2);
                if (item) {
                    await addNajieThing(playerId, item.name, item.class, luckyBonus.quantity);
                }
                const result = {
                    message,
                    thingName: item?.name,
                    thingClass: item?.class,
                    quantity: luckyBonus.quantity,
                    xiuwei,
                    qixue
                };
                await handleExplorationComplete(playerId, player, action, result, luckyBonus.message, fydMessage, pushAddress, isGroup);
                return true;
            }
        }
        return false;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const handelAction = async (playerId, action, { shenjieData }) => {
    try {
        if (!shenjieData || shenjieData.length === 0) {
            return;
        }
        const place = shenjieData?.[0];
        await processPlayerExploration(playerId, action, place);
    }
    catch (error) {
        logger.error(error);
    }
};

export { handelAction };
