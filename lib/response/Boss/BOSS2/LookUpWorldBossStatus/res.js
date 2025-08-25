import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { Boss2IsAlive, InitWorldBoss, LookUpWorldBossStatus } from '../../../../model/boss.js';
import { KEY_WORLD_BOOS_STATUS_TWO } from '../../../../model/constants.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
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
import 'crypto';
import '../../../../route/core/auth.js';
import mw from '../../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?金角大王状态$/;
function parseJson(raw, fallback) {
    if (typeof raw !== 'string' || raw === '') {
        return fallback;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
function formatNum(n) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toLocaleString('zh-CN') : '0';
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq))) {
        return false;
    }
    if (!(await Boss2IsAlive())) {
        Send(Text('金角大王未开启！'));
        return false;
    }
    const statusStr = await redis.get(KEY_WORLD_BOOS_STATUS_TWO);
    const status = parseJson(statusStr, null);
    if (!status) {
        Send(Text('状态数据缺失，请联系管理员重新开启！'));
        return false;
    }
    const now = Date.now();
    if (now - status.KilledTime < 86400000) {
        Send(Text('金角大王正在刷新,20点开启'));
        return false;
    }
    if (status.KilledTime !== -1) {
        if ((await InitWorldBoss()) === false) {
            await LookUpWorldBossStatus(e);
        }
        return false;
    }
    const reply = `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${formatNum(status.Health)}\n奖励:${formatNum(status.Reward)}`;
    Send(Text(reply));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
