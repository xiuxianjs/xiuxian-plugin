import { keysLock, getRedisKey } from '../../../../model/keys.js';
import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { compulsoryToNumber } from '../../../../model/utils/number.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { withLock } from '../../../../model/locks.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?下架[1-9]\d*$/;
const EXCHANGE_OFFSELL_LOCK_CONFIG = {
    timeout: 30000,
    retryDelay: 100,
    maxRetries: 5,
    enableRenewal: true,
    renewalInterval: 10000
};
const ERROR_MESSAGES = {
    PLAYER_NOT_EXIST: '玩家不存在',
    CD_LIMIT: (cdMinutes, remainMinutes, remainSeconds) => `每${cdMinutes}分钟操作一次，CD: ${remainMinutes}分${remainSeconds}秒`,
    INVALID_INDEX: '编号格式错误',
    ITEM_NOT_FOUND: (index) => `没有编号为${index}的物品`,
    NOT_OWNER: '不能下架别人上架的物品',
    MISSING_NAME: '物品名称缺失',
    LOCK_ERROR: '系统繁忙，请稍后重试',
    SUCCESS: (playerName, itemName) => `${playerName}下架${itemName}成功！`
};
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
function mapRecord(r) {
    if (!r || typeof r !== 'object') {
        return null;
    }
    const rec = r;
    logger.info('rec:', rec, 'qq' in rec, rec.name);
    if ('qq' in rec && rec.name) {
        return rec;
    }
    const er = r;
    if (er.thing) {
        const name = {
            name: String(er.thing.name || ''),
            class: (er.thing.class || '道具')
        };
        let fullEquipment = null;
        if (er.thing.atk !== undefined || er.thing.def !== undefined || er.thing.HP !== undefined || er.thing.bao !== undefined) {
            fullEquipment = {
                name: er.thing.name,
                class: er.thing.class,
                pinji: er.thing.pinji2,
                atk: er.thing.atk,
                def: er.thing.def,
                HP: er.thing.HP,
                bao: er.thing.bao,
                type: er.thing.type,
                数量: er.amount,
                出售价: er.thing.出售价
            };
        }
        return {
            qq: String(er.qq || ''),
            name,
            amount: er.amount,
            pinji2: er.thing.pinji2,
            fullEquipment
        };
    }
    return null;
}
function parseOffsellIndex(messageText) {
    const indexStr = messageText.replace(/^(#|＃|\/)?下架/, '').trim();
    if (!indexStr || !/^[1-9]\d*$/.test(indexStr)) {
        return null;
    }
    const index = compulsoryToNumber(indexStr, 1) - 1;
    return index >= 0 ? index : null;
}
function validateItemOwnership(record, userId) {
    return String(record.qq) === String(userId);
}
function getItemInfo(record) {
    let thingName = '';
    let thingClass = '道具';
    if (typeof record.name === 'string') {
        thingName = record.name;
        thingClass = record.class || '道具';
    }
    else {
        thingName = record.name.name;
        thingClass = record.name.class;
    }
    return { name: thingName, class: thingClass };
}
const executeOffsellWithLock = async (e, userId, itemIndex) => {
    const Send = useSend(e);
    if (!(await existplayer(userId))) {
        void Send(Text(ERROR_MESSAGES.PLAYER_NOT_EXIST));
        return;
    }
    const rawList = await readExchange();
    const list = rawList.map(mapRecord).filter((item) => item !== null);
    logger.info('list:', list);
    if (itemIndex >= list.length) {
        void Send(Text(ERROR_MESSAGES.ITEM_NOT_FOUND(itemIndex + 1)));
        return;
    }
    const record = list[itemIndex];
    if (!validateItemOwnership(record, userId)) {
        void Send(Text(ERROR_MESSAGES.NOT_OWNER));
        return;
    }
    const { name: thingName, class: thingClass } = getItemInfo(record);
    if (!thingName) {
        void Send(Text(ERROR_MESSAGES.MISSING_NAME));
        return;
    }
    const amount = toInt(record.amount, 1);
    const category = thingClass || '道具';
    if (category === '装备' || category === '仙宠') {
        const equipName = typeof record.name === 'string' ? record.name : record.name.name;
        if (record.fullEquipment) {
            await addNajieThing(userId, record.fullEquipment, category, amount);
        }
        else {
            await addNajieThing(userId, equipName, category, amount, record.pinji2);
        }
    }
    else {
        await addNajieThing(userId, thingName, category, amount);
    }
    rawList.splice(itemIndex, 1);
    await writeExchange(rawList);
    await redis.set(getRedisKey(userId, 'Exchange'), '0');
    const player = await readPlayer(userId);
    const playerName = player?.名号 || userId;
    void Send(Text(ERROR_MESSAGES.SUCCESS(playerName, thingName)));
};
const executeOffsellWithLockWrapper = async (e, userId, itemIndex) => {
    const lockKey = keysLock.exchange(String(itemIndex));
    const result = await withLock(lockKey, async () => {
        await executeOffsellWithLock(e, userId, itemIndex);
    }, EXCHANGE_OFFSELL_LOCK_CONFIG);
    if (!result.success) {
        const Send = useSend(e);
        logger.error('Exchange offsell lock error:', result.error);
        void Send(Text('操作失败，请稍后再试'));
    }
};
const res = onResponse(selects, e => {
    const Send = useSend(e);
    const userId = e.UserId;
    const itemIndex = parseOffsellIndex(e.MessageText);
    if (itemIndex === null) {
        void Send(Text(ERROR_MESSAGES.INVALID_INDEX));
        return false;
    }
    void executeOffsellWithLockWrapper(e, userId, itemIndex);
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
