import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
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
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { readForum, writeForum } from '../../../../model/trade.js';
import 'crypto';
import 'lodash-es';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

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
    const thingValue = convert2integer(value);
    const thingCount = convert2integer(amount);
    const Forum = await readForum();
    const isMeLength = Forum.filter(item => item.qq === userId)?.length || 0;
    if (isMeLength >= 3) {
        void Send(Text(`你已发布了${isMeLength}个物品，请先处理`));
        return false;
    }
    const whole = Math.trunc(thingValue * thingCount);
    if (whole < 100000) {
        void Send(Text('物品总价低于10w灵石的，聚宝堂将不受理'));
        return;
    }
    const calculateTax = (totalPrice) => {
        const million = 1000000;
        const baseTaxRate = 0.03;
        if (totalPrice < million) {
            return Math.floor(totalPrice * baseTaxRate);
        }
        const millionCount = Math.ceil(totalPrice / million);
        const taxRate = baseTaxRate * millionCount;
        const max = 0.15;
        if (taxRate > max) {
            return Math.floor(totalPrice * max);
        }
        const curPrice = Math.floor(totalPrice * taxRate);
        if (curPrice < 100000) {
            return 100000;
        }
        return Math.floor(totalPrice * taxRate);
    };
    const off = calculateTax(whole);
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据异常'));
        return false;
    }
    const needPrice = off + whole;
    if (player.灵石 < needPrice) {
        void Send(Text(`灵石不足,需要${needPrice}(+${off})灵石`));
        return false;
    }
    await addCoin(userId, -needPrice);
    const generateUniqueId = () => {
        const timestamp = Date.now() % 10000;
        const random = Math.floor(Math.random() * 90) + 10;
        return `${timestamp}${random}`;
    };
    const wupin = {
        id: generateUniqueId(),
        qq: userId,
        name: thingName,
        price: thingValue,
        class: thingExist.class,
        aconut: thingCount,
        whole: whole,
        now_time: Date.now()
    };
    Forum.push(wupin);
    await writeForum(Forum);
    void Send(Text(`你已发布[${thingName}]*${thingCount}，单价${thingValue}灵石，总价${whole}灵石，交纳${off}灵石，编号:${wupin.id}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
