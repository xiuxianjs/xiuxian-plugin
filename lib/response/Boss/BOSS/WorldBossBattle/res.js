import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keysAction, keysLock } from '../../../../model/keys.js';
import { getDataJSONParseByKey, getDataByKey } from '../../../../model/DataControl.js';
import { formatRemaining } from '../../../../model/actionHelper.js';
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
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { isBossWord, WorldBossBattleInfo, bossStatus, WorldBossBattle } from '../../../../model/boss.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw from '../../../mw-captcha.js';
import { acquireLock, releaseLock, withLock } from '../../../../model/locks.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?讨伐妖王$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const isLevelMaxLimit = (levelId, lunhui) => {
    return levelId > 41 || lunhui > 0;
};
const BOSS_LOCK_CONFIG = {
    timeout: 30000,
    retryDelay: 100,
    maxRetries: 5,
    enableRenewal: true,
    renewalInterval: 10000
};
const executeBossBattleWithLock = async (e, userId, player, boss) => {
    const lockKey = keysLock.boss('boss1');
    const result = await withLock(lockKey, async () => {
        await WorldBossBattle(e, { userId, player, boss, key: '1', endLingshi: 1000000, averageLingshi: 200000 });
    }, BOSS_LOCK_CONFIG);
    if (!result.success) {
        logger.warn('Boss battle lock failed:', result.error);
        const Send = useSend(e);
        void Send(Text('系统繁忙，请稍后再试'));
    }
};
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const userLockKey = `user_boss_battle:${userId}`;
    const userLockResult = await acquireLock(userLockKey, {
        timeout: 10000,
        retryDelay: 50,
        maxRetries: 3,
        enableRenewal: false
    });
    if (!userLockResult.acquired) {
        void Send(Text('操作过于频繁，请稍后再试'));
        return false;
    }
    try {
        const player = await readPlayer(userId);
        if (!player) {
            void Send(Text('区区凡人，也想参与此等战斗中吗？'));
            return false;
        }
        if (!(await isBossWord())) {
            void Send(Text('妖王未刷新'));
            return;
        }
        if (!isLevelMaxLimit(player.level_id, player.lunhui)) {
            void Send(Text('不在仙界'));
            return false;
        }
        const action = await getDataJSONParseByKey(keysAction.action(userId));
        if (action?.end_time && Date.now() <= action.end_time) {
            const remain = action.end_time - Date.now();
            void Send(Text(`正在${action.action || '行动'}中,剩余时间:${formatRemaining(remain)}`));
            return false;
        }
        if (player.当前血量 <= player.血量上限 * 0.1) {
            void Send(Text('还是先疗伤吧，别急着参战了'));
            return false;
        }
        if (WorldBossBattleInfo.CD[userId]) {
            const seconds = Math.trunc((300000 - (Date.now() - WorldBossBattleInfo.CD[userId])) / 1000);
            if (seconds <= 300 && seconds >= 0) {
                void Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${seconds}秒)`));
                return false;
            }
        }
        const bossStatusResult = await bossStatus('1');
        if (bossStatusResult === 'dead') {
            void Send(Text('妖王已经被击败了，请等待下次刷新'));
            return;
        }
        else if (bossStatusResult === 'initializing') {
            void Send(Text('妖王正在初始化，请稍后'));
            return;
        }
        const now = Date.now();
        const fightCdMs = 5 * 60000;
        const lastTime = toInt(await getDataByKey(keysAction.bossCD(userId)));
        if (now < lastTime + fightCdMs) {
            const remain = lastTime + fightCdMs - now;
            const m = Math.trunc(remain / 60000);
            const s = Math.trunc((remain % 60000) / 1000);
            void Send(Text(`正在CD中，剩余cd:  ${m}分 ${s}秒`));
            return false;
        }
        try {
            await executeBossBattleWithLock(e, userId, player, {
                名号: '妖王幻影',
                攻击: Math.floor(player.攻击 * (0.8 + 0.6 * Math.random())),
                防御: Math.floor(player.防御 * (0.8 + 0.6 * Math.random())),
                当前血量: Math.floor(player.血量上限 * (0.8 + 0.6 * Math.random())),
                暴击率: player.暴击率,
                灵根: player.灵根,
                法球倍率: player.灵根?.法球倍率
            });
        }
        catch (error) {
            logger.error('Boss战斗执行失败:', error);
            void Send(Text('战斗过程中出现异常，请稍后重试'));
            return false;
        }
        return false;
    }
    finally {
        if (userLockResult.value) {
            await releaseLock(userLockKey, userLockResult.value);
        }
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
