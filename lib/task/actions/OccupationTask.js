import { notUndAndNull } from '../../model/common.js';
import '../../model/api.js';
import { keysAction } from '../../model/keys.js';
import { setDataJSONStringifyByKey } from '../../model/DataControl.js';
import '@alemonjs/db';
import 'alemonjs';
import { readPlayer } from '../../model/xiuxiandata.js';
import '../../model/DataList.js';
import '../../model/settions.js';
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
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import { calcEffectiveMinutes, plant_jiesuan, mine_jiesuan } from '../../response/Occupation/api.js';

const BASE_CONFIG = {
    SETTLEMENT_TIME_OFFSET: 60000 * 2,
    TIME_CONVERSION: 1000 * 60,
    SETTLED_FLAG: 1,
    ACTIVE_FLAG: 1,
    INACTIVE_FLAG: '0'
};
const parseTime = (rawTime) => {
    const time = typeof rawTime === 'string' ? parseInt(rawTime) : Number(rawTime);
    return isNaN(time) ? 0 : time / BASE_CONFIG.TIME_CONVERSION;
};
const getPushAddress = (action) => {
    if ('group_id' in action && notUndAndNull(action.group_id)) {
        return String(action.group_id);
    }
    return undefined;
};
const isSettlementTime = (endTime) => {
    const settlementTime = endTime - BASE_CONFIG.SETTLEMENT_TIME_OFFSET;
    return Date.now() > settlementTime;
};
const resetAllStates = (action) => {
    const resetAction = { ...action };
    resetAction.shutup = BASE_CONFIG.ACTIVE_FLAG;
    resetAction.working = BASE_CONFIG.ACTIVE_FLAG;
    resetAction.power_up = BASE_CONFIG.ACTIVE_FLAG;
    resetAction.Place_action = BASE_CONFIG.ACTIVE_FLAG;
    resetAction.Place_actionplus = BASE_CONFIG.ACTIVE_FLAG;
    delete resetAction.group_id;
    return resetAction;
};
const handlePlantSettlement = async (playerId, action, pushAddress) => {
    try {
        if (action.is_jiesuan === BASE_CONFIG.SETTLED_FLAG) {
            return { success: false, message: '已结算，跳过' };
        }
        const startTime = action.end_time - Number(action.time);
        const now = Date.now();
        const timeMin = calcEffectiveMinutes(startTime, action.end_time, now);
        await plant_jiesuan(playerId, timeMin, pushAddress);
        const resetAction = resetAllStates(action);
        resetAction.is_jiesuan = BASE_CONFIG.SETTLED_FLAG;
        resetAction.plant = BASE_CONFIG.ACTIVE_FLAG;
        await setDataJSONStringifyByKey(keysAction.action(playerId), resetAction);
        return { success: true, message: '采药结算完成' };
    }
    catch (error) {
        return { success: false, message: `采药结算失败: ${error}` };
    }
};
const handleMineSettlement = async (playerId, action, pushAddress) => {
    try {
        const playerRaw = await readPlayer(playerId);
        if (!playerRaw || Array.isArray(playerRaw)) {
            return { success: false, message: '玩家数据无效' };
        }
        if (!notUndAndNull(playerRaw.level_id)) {
            return { success: false, message: '玩家等级数据无效' };
        }
        const timeMin = parseTime(action.time);
        await mine_jiesuan(playerId, timeMin, pushAddress);
        const resetAction = resetAllStates(action);
        resetAction.mine = BASE_CONFIG.ACTIVE_FLAG;
        await setDataJSONStringifyByKey(keysAction.action(playerId), resetAction);
        return { success: true, message: '采矿结算完成' };
    }
    catch (error) {
        return { success: false, message: `采矿结算失败: ${error}` };
    }
};
const processPlayerOccupation = async (playerId, action) => {
    try {
        const pushAddress = getPushAddress(action);
        let settlementResult = { success: false, message: '无需要结算的状态' };
        if (action.plant === BASE_CONFIG.INACTIVE_FLAG && isSettlementTime(action.end_time)) {
            settlementResult = await handlePlantSettlement(playerId, action, pushAddress);
        }
        if (action.mine === BASE_CONFIG.INACTIVE_FLAG && isSettlementTime(action.end_time)) {
            settlementResult = await handleMineSettlement(playerId, action, pushAddress);
        }
        return settlementResult;
    }
    catch (error) {
        return { success: false, message: `处理玩家职业状态失败: ${error}` };
    }
};
const handelAction = async (playerId, action) => {
    try {
        await processPlayerOccupation(playerId, action);
    }
    catch (error) {
        logger.error(error);
    }
};

export { handelAction };
