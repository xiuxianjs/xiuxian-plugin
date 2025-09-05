import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { KEY_WORLD_BOOS_STATUS_TWO } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import { isBossWord2, bossStatus, InitWorldBoss2 } from '../../../../model/boss.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/settions.js';
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
import 'buffer';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw from '../../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?金角大王状态$/;
function formatNum(n) {
    const v = Number(n);
    return Number.isFinite(v) ? v.toLocaleString('zh-CN') : '0';
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        void Send(Text('你还未开始修仙'));
        return false;
    }
    if (!(await isBossWord2())) {
        void Send(Text('金角大王未刷新'));
        return;
    }
    const bossStatusResult = await bossStatus('2');
    if (bossStatusResult === 'dead') {
        void Send(Text('金角大王已经被击败了，请等待下次刷新'));
        return;
    }
    else if (bossStatusResult === 'initializing') {
        void Send(Text('金角大王正在初始化，请稍后'));
        return;
    }
    const statusStr = await getDataJSONParseByKey(KEY_WORLD_BOOS_STATUS_TWO);
    if (!statusStr) {
        void InitWorldBoss2();
        void Send(Text('状态数据缺失，开始重新初始化！'));
        return false;
    }
    const reply = `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${formatNum(statusStr.Health)}\n奖励:${formatNum(statusStr.Reward)}`;
    void Send(Text(reply));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
