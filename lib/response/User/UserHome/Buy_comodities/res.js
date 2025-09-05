import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { Go } from '../../../../model/common.js';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?购买((.*)|(.*)*(.*))$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const PRICE_RATE = 1.2;
const MAX_QTY = 9999;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    if (!(await Go(e))) {
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?购买/, '').trim();
    if (!raw) {
        void Send(Text('格式: 购买物品名*数量 (数量可省略)'));
        return false;
    }
    const [rawName, rawQty] = raw.split('*');
    const thingName = rawName?.trim();
    if (!thingName) {
        void Send(Text('物品名称不能为空'));
        return false;
    }
    const commodityData = await getDataList('Commodity');
    const commodity = commodityData.find(item => item.name === thingName);
    if (!commodity) {
        void Send(Text(`柠檬堂还没有这样的东西: ${thingName}`));
        return false;
    }
    let qty = toInt(convert2integer(rawQty), 1);
    if (!Number.isFinite(qty) || qty <= 0) {
        qty = 1;
    }
    if (qty > MAX_QTY) {
        qty = MAX_QTY;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('存档异常'));
        return false;
    }
    const lingshi = Number(player.灵石) || 0;
    if (lingshi <= 0) {
        void Send(Text('掌柜：就你这穷酸样，也想来柠檬堂？走走走！'));
        return false;
    }
    const unitPrice = Math.max(0, Number(commodity.出售价) || 0);
    let totalPrice = Math.trunc(unitPrice * PRICE_RATE * qty);
    if (totalPrice <= 0) {
        totalPrice = 1;
    }
    if (!Number.isFinite(totalPrice) || totalPrice > 1e15) {
        void Send(Text('价格异常，购买已取消'));
        return false;
    }
    if (lingshi < totalPrice) {
        void Send(Text(`口袋里的灵石不足以支付 ${thingName}, 还需要 ${totalPrice - lingshi} 灵石`));
        return false;
    }
    await addNajieThing(userId, thingName, commodity.class, qty);
    await addCoin(userId, -totalPrice);
    void Send(Text(`购买成功! 获得[${thingName}]*${qty}, 花费[${totalPrice}]灵石, 剩余[${lingshi - totalPrice}]灵石\n可以在【我的纳戒】中查看`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
