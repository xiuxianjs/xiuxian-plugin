import { pushInfo } from '../api.js';
import { notUndAndNull } from '../common.js';
import { keysAction } from '../keys.js';
import { delDataByKey } from '../DataControl.js';
import '@alemonjs/db';
import { Mention } from 'alemonjs';
import { readPlayer, writePlayer } from '../xiuxiandata.js';
import { addExp, addExp2 } from '../economy.js';
import { getDataList } from '../DataList.js';
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
import 'svg-captcha';
import 'sharp';
import { setFileValue } from '../cultivation.js';
import '../currency.js';
import { readDanyao, writeDanyao } from '../danyao.js';
import 'crypto';
import { existNajieThing, addNajieThing } from '../najie.js';
import 'posthog-node';
import '../message.js';

const BASE_CONFIG = {
    SETTLEMENT_TIME_OFFSET: 60000 * 2,
    TIME_CONVERSION: 1000 * 60,
    BLOOD_RECOVERY_RATE: 0.02,
    ENLIGHTENMENT_CHANCE: 0.2,
    DEMON_CHANCE: 0.8,
    LUCKY_CHANCE: 0.2,
    UNLUCKY_CHANCE: 0.8,
    SPECIAL_CHANCE_MIN: 0.5,
    SPECIAL_CHANCE_MAX: 0.6
};
const REWARD_MULTIPLIERS = {
    ENLIGHTENMENT_MIN: 45,
    ENLIGHTENMENT_MAX: 54,
    DEMON_MIN: 5,
    DEMON_MAX: 14,
    LUCKY_MIN: 40,
    LUCKY_MAX: 49,
    UNLUCKY_MIN: 5,
    UNLUCKY_MAX: 14,
    SPECIAL_MIN: 20,
    SPECIAL_MAX: 29
};
const ITEM_EFFECTS = {
    MOJIE_MIBAO_XIUWEI_BONUS: 0.15,
    SHENJIE_MIBAO_QIXUE_BONUS: 0.1,
    MOJIE_THRESHOLD: 999,
    SHENJIE_THRESHOLD: 1,
    LEVEL_THRESHOLD: 41
};
const parseTime = (rawTime) => {
    const time = typeof rawTime === 'number' ? rawTime : parseInt(String(rawTime) || '0', 10);
    return time / BASE_CONFIG.TIME_CONVERSION;
};
const getPushInfo = (action) => {
    let pushAddress;
    let isGroup = false;
    if (Object.prototype.hasOwnProperty.call(action, 'group_id') && notUndAndNull(action.group_id)) {
        isGroup = true;
        pushAddress = action.group_id;
    }
    return { pushAddress, isGroup };
};
const handleDanyaoEffects = async (playerId, dy) => {
    let transformation = '修为';
    let beiyong4 = dy.beiyong4 || 0;
    if (dy.biguan > 0) {
        dy.biguan--;
        if (dy.biguan === 0) {
            dy.biguanxl = 0;
        }
    }
    if (dy.lianti > 0) {
        transformation = '血气';
        dy.lianti--;
    }
    if (dy.lianti <= 0) {
        dy.lianti = 0;
        dy.beiyong4 = 0;
        beiyong4 = 0;
    }
    await writeDanyao(playerId, dy);
    return { transformation, beiyong4 };
};
const handleEnlightenment = (time, transformation, beiyong4) => {
    const rand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.ENLIGHTENMENT_MIN;
    const otherExp = rand * time;
    const qixue = Math.trunc(rand * time * beiyong4);
    let message = '';
    if (transformation === '血气') {
        message = `\n本次闭关顿悟,受到炼神之力修正,额外增加血气:${qixue}`;
    }
    else {
        message = `\n本次闭关顿悟,额外增加修为:${otherExp}`;
    }
    return { otherExp, qixue, message };
};
const handleDemonState = (time, transformation, beiyong4) => {
    const rand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.DEMON_MIN;
    const otherExp = -1 * rand * time;
    const qixue = Math.trunc(rand * time * beiyong4);
    let message = '';
    if (transformation === '血气') {
        message = `\n由于你闭关时隔壁装修,导致你差点走火入魔,受到炼神之力修正,血气下降${qixue}`;
    }
    else {
        message = `\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降${Math.abs(otherExp)}`;
    }
    return { otherExp, qixue, message };
};
const handleSpecialItems = async (playerId, player, xiuwei, time) => {
    let otherXiuwei = 0;
    let qixue = 0;
    let message = '';
    if ((await existNajieThing(playerId, '魔界秘宝', '道具')) && player.魔道值 > ITEM_EFFECTS.MOJIE_THRESHOLD) {
        otherXiuwei += Math.trunc(xiuwei * ITEM_EFFECTS.MOJIE_MIBAO_XIUWEI_BONUS * time);
        await addNajieThing(playerId, '魔界秘宝', '道具', -1);
        message += `\n消耗了道具[魔界秘宝],额外增加${otherXiuwei}修为`;
        await addExp(playerId, otherXiuwei);
    }
    if ((await existNajieThing(playerId, '神界秘宝', '道具')) &&
        player.魔道值 < ITEM_EFFECTS.SHENJIE_THRESHOLD &&
        (player.灵根?.type === '转生' || player.level_id > ITEM_EFFECTS.LEVEL_THRESHOLD)) {
        qixue = Math.trunc(xiuwei * ITEM_EFFECTS.SHENJIE_MIBAO_QIXUE_BONUS * time);
        await addNajieThing(playerId, '神界秘宝', '道具', -1);
        message += `\n消耗了道具[神界秘宝],额外增加${qixue}血气`;
        await addExp2(playerId, qixue);
    }
    return { otherXiuwei, qixue, message };
};
const handleCultivationSettlement = async (playerId, action, player, config, pushAddress, isGroup) => {
    try {
        const levelList = await getDataList('Level1');
        const levelInfo = levelList.find(item => item.level_id === player.level_id);
        if (!levelInfo) {
            return false;
        }
        const nowLevelId = levelInfo.level_id;
        const size = config.biguan.size;
        const xiuwei = Math.floor(size * nowLevelId * (player.修炼效率提升 + 1));
        const blood = Math.floor(player.血量上限 * BASE_CONFIG.BLOOD_RECOVERY_RATE);
        const time = parseTime(action.time);
        const dy = await readDanyao(playerId);
        const { transformation, beiyong4 } = await handleDanyaoEffects(playerId, dy);
        const rand = Math.random();
        let otherExp = 0;
        let eventMessage = '';
        if (rand < BASE_CONFIG.ENLIGHTENMENT_CHANCE) {
            const result = handleEnlightenment(time, transformation, beiyong4);
            otherExp = result.otherExp;
            eventMessage = result.message;
        }
        else if (rand > BASE_CONFIG.DEMON_CHANCE) {
            const result = handleDemonState(time, transformation, beiyong4);
            otherExp = result.otherExp;
            eventMessage = result.message;
        }
        const itemResult = await handleSpecialItems(playerId, player, xiuwei, time);
        await setFileValue(playerId, blood * time, '当前血量');
        void delDataByKey(keysAction.action(playerId));
        const finalXiuwei = xiuwei * time + otherExp;
        const finalQixue = Math.trunc(xiuwei * time * beiyong4);
        if (transformation === '血气') {
            await setFileValue(playerId, finalXiuwei * beiyong4, transformation);
        }
        else {
            await setFileValue(playerId, finalXiuwei, transformation);
        }
        const msg = [Mention(playerId)];
        msg.push(eventMessage);
        msg.push(itemResult.message);
        if (transformation === '血气') {
            msg.push(`\n受到炼神之力的影响,增加气血:${finalQixue},血量增加:${blood * time}`);
        }
        else {
            msg.push(`\n增加修为:${finalXiuwei},血量增加:${blood * time}`);
        }
        if (isGroup && pushAddress) {
            pushInfo(pushAddress, isGroup, msg);
        }
        else {
            pushInfo(playerId, isGroup, msg);
        }
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const handleWorkSettlement = async (playerId, action, player, config, pushAddress, isGroup) => {
    try {
        const levelList = await getDataList('Level1');
        const levelInfo = levelList.find(item => item.level_id === player.level_id);
        if (!levelInfo) {
            return false;
        }
        const nowLevelId = levelInfo.level_id;
        const size = config.work.size;
        const lingshi = Math.floor(size * nowLevelId * (1 + player.修炼效率提升) * 0.5);
        const time = parseTime(action.time);
        const rand = Math.random();
        let otherLingshi = 0;
        let otherQixue = 0;
        let eventMessage = '';
        if (rand < BASE_CONFIG.LUCKY_CHANCE) {
            const luckyRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.LUCKY_MIN;
            otherLingshi = luckyRand * time;
            eventMessage = `\n降妖路上途径金银坊，一时手痒入场一掷：6 6 6，额外获得灵石${otherLingshi}`;
        }
        else if (rand > BASE_CONFIG.UNLUCKY_CHANCE) {
            const unluckyRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.UNLUCKY_MIN;
            otherLingshi = -1 * unluckyRand * time;
            eventMessage = `\n途径盗宝团营地，由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少${Math.abs(otherLingshi)}`;
        }
        else if (rand > BASE_CONFIG.SPECIAL_CHANCE_MIN && rand < BASE_CONFIG.SPECIAL_CHANCE_MAX) {
            const specialRand = Math.trunc(Math.random() * 10) + REWARD_MULTIPLIERS.SPECIAL_MIN;
            otherLingshi = -1 * specialRand * time;
            otherQixue = -2 * specialRand * time;
            eventMessage = `\n归来途中经过怡红院，你抵挡不住诱惑，进去大肆消费了${Math.abs(otherLingshi)}灵石，早上醒来，气血消耗了${Math.abs(otherQixue)}`;
        }
        player.血气 += otherQixue;
        await writePlayer(playerId, player);
        const finalLingshi = Math.trunc(lingshi * time + otherLingshi);
        await setFileValue(playerId, finalLingshi, '灵石');
        void delDataByKey(keysAction.action(playerId));
        const msg = [Mention(playerId)];
        msg.push(eventMessage);
        msg.push(`\n降妖得到${finalLingshi}灵石`);
        if (isGroup && pushAddress) {
            pushInfo(pushAddress, isGroup, msg);
        }
        else {
            pushInfo(playerId, isGroup, msg);
        }
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const processPlayerState = async (playerId, action, config) => {
    try {
        const { pushAddress, isGroup } = getPushInfo(action);
        let endTime = action.end_time;
        const nowTime = Date.now();
        endTime = endTime - BASE_CONFIG.SETTLEMENT_TIME_OFFSET;
        if (nowTime > endTime) {
            const player = await readPlayer(playerId);
            if (!player || !notUndAndNull(player.level_id)) {
                return false;
            }
            let success = false;
            if (action.shutup === '0') {
                success = await handleCultivationSettlement(playerId, action, player, config, pushAddress, isGroup);
            }
            if (action.working === '0') {
                success = await handleWorkSettlement(playerId, action, player, config, pushAddress, isGroup);
            }
            return success;
        }
        return false;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const handelAction = async (playerId, action, { config }) => {
    try {
        if (!config) {
            return;
        }
        await processPlayerState(playerId, action, config);
    }
    catch (error) {
        logger.error(error);
    }
};

export { handelAction };
