import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
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
import { shijianc } from '../../../../model/common.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?踏入神界$/;
function toInt(v, def = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : def;
}
function parseJSON(raw) {
    try {
        if (typeof raw === 'string' && raw.trim()) {
            return JSON.parse(raw);
        }
    }
    catch {
    }
    return null;
}
function isDayChanged(a, b) {
    if (!a || !b) {
        return true;
    }
    return a.Y !== b.Y || a.M !== b.M || a.D !== b.D;
}
const LS_COST = 2_200_000;
const DURATION_MINUTES = 30;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const gameActionRaw = await redis.get(getRedisKey(userId, 'game_action'));
    if (toInt(gameActionRaw) === 1) {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const actionRaw = await redis.get(getRedisKey(userId, 'action'));
    const actionObj = parseJSON(actionRaw);
    if (actionObj && toInt(actionObj.end_time) > Date.now()) {
        const remain = actionObj.end_time - Date.now();
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        void Send(Text(`正在${actionObj.action}中, 剩余时间: ${m}分${s}秒`));
        return false;
    }
    let player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const now = Date.now();
    const today = shijianc(now);
    const lastTimeRaw = await redis.get(getRedisKey(userId, 'lastdagong_time'));
    const lastDay = lastTimeRaw ? shijianc(toInt(lastTimeRaw)) : null;
    if (isDayChanged(today, lastDay)) {
        await redis.set(getRedisKey(userId, 'lastdagong_time'), now);
        let n = 1;
        const ln = player.灵根?.name;
        if (ln === '二转轮回体') {
            n = 2;
        }
        else if (ln === '三转轮回体' || ln === '四转轮回体') {
            n = 3;
        }
        else if (ln === '五转轮回体' || ln === '六转轮回体') {
            n = 4;
        }
        else if (ln === '七转轮回体' || ln === '八转轮回体') {
            n = 4;
        }
        else if (ln === '九转轮回体') {
            n = 5;
        }
        player.神界次数 = n;
        await writePlayer(userId, player);
    }
    player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    if (toInt(player.魔道值) > 0 || (player.灵根?.type !== '转生' && toInt(player.level_id) < 42)) {
        void Send(Text('你没有资格进入神界'));
        return false;
    }
    if (toInt(player.灵石) < LS_COST) {
        void Send(Text('灵石不足'));
        return false;
    }
    player.灵石 = toInt(player.灵石) - LS_COST;
    const todayRef = shijianc(now);
    const lastDayRefRaw = await redis.get(getRedisKey(userId, 'lastdagong_time'));
    const lastDayRef = lastDayRefRaw ? shijianc(toInt(lastDayRefRaw)) : null;
    if (!isDayChanged(todayRef, lastDayRef) && toInt(player.神界次数) === 0) {
        void Send(Text('今日次数用光了,请明日再来吧'));
        return false;
    }
    player.神界次数 = Math.max(0, toInt(player.神界次数) - 1);
    await writePlayer(userId, player);
    const durationMs = DURATION_MINUTES * 60000;
    const newAction = {
        action: '神界',
        end_time: Date.now() + durationMs,
        time: durationMs,
        shutup: '1',
        working: '1',
        Place_action: '1',
        mojie: '-1',
        Place_actionplus: '1',
        power_up: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        cishu: '5'
    };
    if (e.name === 'message.create') {
        newAction.group_id = e.ChannelId;
    }
    await redis.set(getRedisKey(userId, 'action'), JSON.stringify(newAction));
    void Send(Text(`开始进入神界, ${DURATION_MINUTES}分钟后归来!`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
