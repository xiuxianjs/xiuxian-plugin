import { useSend, Text } from 'alemonjs';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
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
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?献祭魔石$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据读取失败'));
        return false;
    }
    const needMagic = 1000;
    const playerMagic = Number(player.魔道值) || 0;
    if (playerMagic < needMagic) {
        void Send(Text('你不是魔头'));
        return false;
    }
    const COST = 8;
    const hasCount = await existNajieThing(userId, '魔石', '道具');
    const owned = Number(hasCount) || 0;
    if (owned <= 0) {
        void Send(Text('你没有魔石'));
        return false;
    }
    if (owned < COST) {
        void Send(Text(`魔石不足${COST}个,当前魔石数量${owned}个`));
        return false;
    }
    const xinggeList = await getDataList('Xingge');
    const pool = xinggeList[0]?.one;
    if (!Array.isArray(pool) || pool.length === 0) {
        void Send(Text('奖励配置缺失'));
        return false;
    }
    await addNajieThing(userId, '魔石', '道具', -COST);
    const idx = Math.floor(Math.random() * pool.length);
    const prize = pool[idx];
    if (!prize || typeof prize !== 'object' || !prize.name) {
        void Send(Text('奖励生成失败'));
        return false;
    }
    const name = prize.name;
    const cls = (prize.class || '道具');
    void Send(Text('获得了' + name));
    await addNajieThing(userId, name, cls, 1);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
