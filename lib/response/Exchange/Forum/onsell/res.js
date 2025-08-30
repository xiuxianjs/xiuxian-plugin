import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import 'lodash-es';
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
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { readForum, writeForum } from '../../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?发布.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const thing = e.MessageText.replace(/^(#|＃|\/)?发布/, '');
    const code = thing.split('*');
    const thingName = code[0];
    const value = code[1];
    const amount = code[2];
    const thingExist = await foundthing(thingName);
    if (!thingExist) {
        void Send(Text(`这方世界没有[${thingName}]`));
        return false;
    }
    if (thingExist.class === '装备' || thingExist.class === '仙宠') {
        void Send(Text('暂不支持该类型物品交易'));
        return false;
    }
    const thing_value = convert2integer(value);
    const thingCount = convert2integer(amount);
    const Forum = await readForum();
    const now_time = Date.now();
    const whole = Math.trunc(thing_value * thingCount);
    let off = Math.trunc(whole * 0.03);
    if (off < 100000) {
        off = 100000;
    }
    const player = await readPlayer(userId);
    if (player.灵石 < off + whole) {
        void Send(Text(`灵石不足,还需要${off + whole - player.灵石}灵石`));
        return false;
    }
    await addCoin(userId, -(off + whole));
    const wupin = {
        qq: userId,
        name: thingName,
        price: thing_value,
        class: thingExist.class,
        aconut: thingCount,
        whole: whole,
        now_time: now_time
    };
    Forum.push(wupin);
    await writeForum(Forum);
    void Send(Text('发布成功！'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
