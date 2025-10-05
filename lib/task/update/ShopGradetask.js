import '../../model/api.js';
import { keysLock } from '../../model/keys.js';
import '@alemonjs/db';
import '../../model/DataList.js';
import 'alemonjs';
import 'dayjs';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
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
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import { readShop, writeShop } from '../../model/shop.js';
import '../../model/message.js';
import { withLock } from '../../model/locks.js';

const startTask = async () => {
    const shop = await readShop();
    for (const slot of shop) {
        const current = Number(slot.Grade ?? 1);
        slot.Grade = current - 1;
        if (slot.Grade < 1) {
            slot.Grade = 1;
        }
    }
    await writeShop(shop);
};
const executeBossBattleWithLock = async () => {
    const lockKey = keysLock.task('ShopGradetask');
    const result = await withLock(lockKey, async () => {
        await startTask();
    }, {
        timeout: 1000 * 25,
        retryDelay: 100,
        maxRetries: 0,
        enableRenewal: true,
        renewalInterval: 1000 * 10
    });
    if (!result.success) {
        logger.warn('ShopGradetask lock failed:', result.error);
    }
};
const ShopGradetask = () => {
    const delay = Math.floor(Math.random() * (35 - 5 + 1)) + 5;
    setTimeout(() => {
        void executeBossBattleWithLock();
    }, delay * 1000);
};

export { ShopGradetask };
