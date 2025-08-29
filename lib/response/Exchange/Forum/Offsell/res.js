import { useSend, Text } from 'alemonjs';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/api.js';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
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
import { readForum, writeForum } from '../../../../model/trade.js';
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?取消[1-9]d*/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    let Forum = [];
    const player = await readPlayer(userId);
    const x = parseInt(e.MessageText.replace(/^(#|＃|\/)?取消/, '')) - 1;
    try {
        Forum = await readForum();
    }
    catch {
        await writeForum([]);
    }
    if (x >= Forum.length) {
        void Send(Text(`没有编号为${x + 1}的宝贝需求`));
        return false;
    }
    if (Forum[x].qq !== userId) {
        void Send(Text('不能取消别人的宝贝需求'));
        return false;
    }
    await addCoin(userId, Forum[x].whole);
    void Send(Text(player.名号 + '取消' + Forum[x].name + '成功,返还' + Forum[x].whole + '灵石'));
    Forum.splice(x, 1);
    await writeForum(Forum);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
