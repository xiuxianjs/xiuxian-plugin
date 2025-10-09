import { useSend, Text } from 'alemonjs';
import { compulsoryToNumber } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import { keysLock } from '../../../../model/keys.js';
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
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { readForum, writeForum } from '../../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { withLock } from '../../../../model/locks.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?取消.+$/;
const FORUM_CANCEL_LOCK_CONFIG = {
    timeout: 30000,
    retryDelay: 100,
    maxRetries: 5,
    enableRenewal: true,
    renewalInterval: 10000
};
const ERROR_MESSAGES = {
    ARCHIVE_ERROR: '存档异常',
    INVALID_INDEX: '编号不合法',
    ORDER_NOT_FOUND: (index) => `没有编号为${index}的宝贝需求`,
    NOT_OWNER: '不能取消别人的宝贝需求',
    LOCK_ERROR: '系统繁忙，请稍后重试',
    SUCCESS: (playerName, itemName, refundAmount) => `${playerName}取消${itemName}成功,返还${refundAmount}灵石`
};
function parseOrderId(messageText) {
    const idStr = messageText.replace(/^(#|＃|\/)?取消/, '').trim();
    if (!idStr) {
        return null;
    }
    const numValue = parseInt(idStr, 10);
    const isLegacyIndex = /^\d{1,3}$/.test(idStr) && numValue >= 1 && numValue <= 999;
    return { orderId: idStr, isLegacyIndex };
}
function validateOrderOwnership(order, userId) {
    return String(order.qq) === String(userId);
}
const executeCancelWithLock = async (e, userId, orderId, isLegacyIndex) => {
    const Send = useSend(e);
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text(ERROR_MESSAGES.ARCHIVE_ERROR));
        return;
    }
    const forum = await readForum();
    let orderIndex = -1;
    let order;
    if (isLegacyIndex) {
        orderIndex = compulsoryToNumber(orderId, 1) - 1;
        if (orderIndex >= 0 && orderIndex < forum.length) {
            order = forum[orderIndex];
        }
    }
    else {
        orderIndex = forum.findIndex(item => item.id === orderId);
        if (orderIndex >= 0) {
            order = forum[orderIndex];
        }
    }
    if (!order || orderIndex < 0) {
        void Send(Text(ERROR_MESSAGES.ORDER_NOT_FOUND(isLegacyIndex ? compulsoryToNumber(orderId, 0) : 0)));
        return;
    }
    if (!validateOrderOwnership(order, userId)) {
        void Send(Text(ERROR_MESSAGES.NOT_OWNER));
        return;
    }
    const refundAmount = compulsoryToNumber(order.whole, 0);
    if (refundAmount > 0) {
        await addCoin(userId, refundAmount);
    }
    forum.splice(orderIndex, 1);
    await writeForum(forum);
    void Send(Text(ERROR_MESSAGES.SUCCESS(player.名号, order.name, refundAmount)));
};
const executeCancelWithLockWrapper = async (e, userId, orderId, isLegacyIndex) => {
    const lockKey = keysLock.forum(orderId);
    const result = await withLock(lockKey, async () => {
        await executeCancelWithLock(e, userId, orderId, isLegacyIndex);
    }, FORUM_CANCEL_LOCK_CONFIG);
    if (!result.success) {
        const Send = useSend(e);
        logger.error('Forum cancel lock error:', result.error);
        void Send(Text('操作失败，请稍后再试'));
    }
};
const res = onResponse(selects, e => {
    const Send = useSend(e);
    const userId = e.UserId;
    const parsed = parseOrderId(e.MessageText);
    if (!parsed) {
        void Send(Text(ERROR_MESSAGES.INVALID_INDEX));
        return false;
    }
    const { orderId, isLegacyIndex } = parsed;
    void executeCancelWithLockWrapper(e, userId, orderId, isLegacyIndex);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
