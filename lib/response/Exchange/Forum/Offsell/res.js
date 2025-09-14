import { useSend, Text } from 'alemonjs';
import { compulsoryToNumber } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import { keysLock } from '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
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
import 'lodash-es';
import '../../../../model/currency.js';
import { readForum, writeForum } from '../../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { withLock } from '../../../../model/locks.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?取消[1-9]\d*$/;
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
function parseOrderIndex(messageText) {
    const indexStr = messageText.replace(/^(#|＃|\/)?取消/, '').trim();
    if (!indexStr || !/^[1-9]\d*$/.test(indexStr)) {
        return null;
    }
    const index = compulsoryToNumber(indexStr, 1) - 1;
    return index >= 0 ? index : null;
}
function validateOrderOwnership(order, userId) {
    return String(order.qq) === String(userId);
}
const executeCancelWithLock = async (e, userId, orderIndex) => {
    const Send = useSend(e);
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text(ERROR_MESSAGES.ARCHIVE_ERROR));
        return;
    }
    const forum = await readForum();
    if (orderIndex >= forum.length) {
        void Send(Text(ERROR_MESSAGES.ORDER_NOT_FOUND(orderIndex + 1)));
        return;
    }
    const order = forum[orderIndex];
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
const executeCancelWithLockWrapper = async (e, userId, orderIndex) => {
    const lockKey = keysLock.forum(String(orderIndex));
    const result = await withLock(lockKey, async () => {
        await executeCancelWithLock(e, userId, orderIndex);
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
    const orderIndex = parseOrderIndex(e.MessageText);
    if (orderIndex === null) {
        void Send(Text(ERROR_MESSAGES.INVALID_INDEX));
        return false;
    }
    void executeCancelWithLockWrapper(e, userId, orderIndex);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
