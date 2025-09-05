import { useSend, Text } from 'alemonjs';
import { compulsoryToNumber, convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import { keysLock } from '../../../../model/keys.js';
import '@alemonjs/db';
import { Go } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { readForum, writeForum } from '../../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';
import { withLock } from '../../../../model/locks.js';

const regular = /^(#|＃|\/)?接取.*$/;
const MAX_QTY = 1_000_000_000;
const MAX_PRICE_SUM = 1e15;
const FORUM_LOCK_CONFIG = {
    timeout: 30000,
    retryDelay: 100,
    maxRetries: 5,
    enableRenewal: true,
    renewalInterval: 10000
};
const ERROR_MESSAGES = {
    ARCHIVE_ERROR: '存档异常',
    FORMAT_ERROR: '格式: 接取编号*数量 (数量可省略为全部)',
    PARSE_ERROR: '指令解析失败',
    INVALID_INDEX: '编号不合法',
    ORDER_NOT_FOUND: '没有该编号的求购单',
    SELF_ORDER: '没事找事做?',
    ORDER_INVALID: '该求购单已失效',
    INVALID_QTY: '数量需为正整数',
    NO_ITEM: (itemName) => `你没有【${itemName}】`,
    INSUFFICIENT_ITEM: (itemName, qty) => `你只有【${itemName}】 x ${qty}`,
    PRICE_ERROR: '价格计算异常',
    LOCK_ERROR: '系统繁忙，请稍后重试',
    SUCCESS: (playerName, gain, itemName, qty) => `${playerName}在聚宝堂收获了${gain}灵石！(交付 ${itemName} x ${qty})`
};
function parseCommand(messageText) {
    const body = messageText.replace(/^(#|＃|\/)?接取/, '').trim();
    if (!body) {
        return null;
    }
    const segments = body
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (segments.length === 0) {
        return null;
    }
    const idxRaw = segments[0];
    const qtyRaw = segments[1];
    const orderIndex = compulsoryToNumber(idxRaw, 1) - 1;
    if (orderIndex < 0) {
        return null;
    }
    let deliverQty;
    if (!qtyRaw) {
        deliverQty = -1;
    }
    else {
        deliverQty = compulsoryToNumber(convert2integer(qtyRaw), 0);
        if (deliverQty <= 0) {
            return null;
        }
    }
    return { orderIndex, deliverQty };
}
function validateOrder(order, userId) {
    if (String(order.qq) === String(userId)) {
        return ERROR_MESSAGES.SELF_ORDER;
    }
    const unitPrice = compulsoryToNumber(order.price, 0);
    const remaining = compulsoryToNumber(order.aconut, 0);
    if (unitPrice <= 0 || remaining <= 0) {
        return ERROR_MESSAGES.ORDER_INVALID;
    }
    return null;
}
function calculateDeliverQty(requestedQty, remaining) {
    if (requestedQty === -1) {
        return remaining;
    }
    let deliverQty = Math.min(requestedQty, remaining);
    deliverQty = Math.min(deliverQty, MAX_QTY);
    return deliverQty;
}
function validatePrice(unitPrice, deliverQty) {
    const gain = unitPrice * deliverQty;
    if (!Number.isFinite(gain) || gain <= 0 || gain > MAX_PRICE_SUM) {
        return null;
    }
    return gain;
}
async function executeTransaction(userId, order, deliverQty, gain) {
    const orderOwnerId = String(order.qq ?? '');
    if (!orderOwnerId) {
        return;
    }
    await addNajieThing(userId, order.name, order.class, -deliverQty);
    await addCoin(userId, gain);
    await addNajieThing(orderOwnerId, order.name, order.class, deliverQty);
}
function updateOrder(order, deliverQty, gain) {
    const remaining = compulsoryToNumber(order.aconut, 0);
    const newRemaining = remaining - deliverQty;
    order.aconut = newRemaining;
    if (typeof order.whole === 'number') {
        order.whole = order.whole - gain;
    }
    return newRemaining <= 0;
}
const executePurchaseWithLock = async (e, userId, orderIndex, requestedQty) => {
    const Send = useSend(e);
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text(ERROR_MESSAGES.ARCHIVE_ERROR));
        return;
    }
    const forum = await readForum();
    if (orderIndex >= forum.length) {
        void Send(Text(ERROR_MESSAGES.ORDER_NOT_FOUND));
        return;
    }
    const order = forum[orderIndex];
    const validationError = validateOrder(order, userId);
    if (validationError) {
        void Send(Text(validationError));
        return;
    }
    const unitPrice = compulsoryToNumber(order.price, 0);
    const remaining = compulsoryToNumber(order.aconut, 0);
    const actualDeliverQty = calculateDeliverQty(requestedQty, remaining);
    const hasNum = await existNajieThing(userId, order.name, order.class);
    if (!hasNum) {
        void Send(Text(ERROR_MESSAGES.NO_ITEM(order.name)));
        return;
    }
    if (hasNum < actualDeliverQty) {
        void Send(Text(ERROR_MESSAGES.INSUFFICIENT_ITEM(order.name, hasNum)));
        return;
    }
    const gain = validatePrice(unitPrice, actualDeliverQty);
    if (gain === null) {
        void Send(Text(ERROR_MESSAGES.PRICE_ERROR));
        return;
    }
    await executeTransaction(userId, order, actualDeliverQty, gain);
    const shouldDelete = updateOrder(order, actualDeliverQty, gain);
    if (shouldDelete) {
        forum.splice(orderIndex, 1);
    }
    await writeForum(forum);
    void Send(Text(ERROR_MESSAGES.SUCCESS(player.名号, gain, order.name, actualDeliverQty)));
};
const executePurchaseWithLockWrapper = async (e, userId, orderIndex, requestedQty) => {
    const lockKey = keysLock.forum(String(orderIndex));
    const result = await withLock(lockKey, async () => {
        await executePurchaseWithLock(e, userId, orderIndex, requestedQty);
    }, FORUM_LOCK_CONFIG);
    if (!result.success) {
        const Send = useSend(e);
        void Send(Text(ERROR_MESSAGES.LOCK_ERROR));
    }
};
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await Go(e))) {
        return false;
    }
    const parsed = parseCommand(e.MessageText);
    if (!parsed) {
        void Send(Text(ERROR_MESSAGES.FORMAT_ERROR));
        return false;
    }
    const { orderIndex, deliverQty: requestedQty } = parsed;
    void executePurchaseWithLockWrapper(e, userId, orderIndex, requestedQty);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
