import { useSend, Text, useMention } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { keys, getRedisKey } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?抢红包$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const now = Date.now();
    const lastKey = getRedisKey(userId, 'last_getbung_time');
    const lastStr = await redis.get(lastKey);
    const lastTime = toInt(lastStr);
    const cf = (await config.getConfig('xiuxian', 'xiuxian')) || {};
    const cdMinutes = toInt(cf?.CD?.honbao, 1);
    const cdMs = cdMinutes * 60000;
    if (now < lastTime + cdMs) {
        const remain = lastTime + cdMs - now;
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        void Send(Text(`每${cdMinutes}分钟抢一次，正在CD中，剩余cd: ${m}分${s}秒`));
        return false;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        return false;
    }
    const honbao_qq = target.UserId;
    if (honbao_qq === userId) {
        void Send(Text('不能抢自己的红包'));
        return false;
    }
    if (!(await existplayer(honbao_qq))) {
        return false;
    }
    const countKey = getRedisKey(honbao_qq, 'honbaoacount');
    const remainingCount = await redis.decr(countKey);
    if (remainingCount < 0) {
        await redis.incr(countKey);
        void Send(Text('他的红包被光啦！'));
        return false;
    }
    const valueKey = getRedisKey(honbao_qq, 'honbao');
    const valStr = await redis.get(valueKey);
    const lingshi = toInt(valStr);
    if (lingshi <= 0) {
        void Send(Text('这个红包里居然是空的...'));
        await redis.set(lastKey, now);
        return false;
    }
    await addCoin(userId, lingshi);
    await redis.set(lastKey, now);
    void Send(Text(`【全服公告】${player.名号 || userId}抢到一个${lingshi}灵石的红包！`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
