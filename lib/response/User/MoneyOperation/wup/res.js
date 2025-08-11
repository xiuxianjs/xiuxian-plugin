import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { addCoin, addExp, addExp2 } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import { foundthing } from '../../../../model/cultivation.js';
import 'dayjs';
import '../../../../model/api.js';
import 'fs';
import 'path';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?发\S+(?:\*\S+){1,2}$/;
function toInt(v, def = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : def;
}
const PINJI_MAP = {
    劣: 0,
    普: 1,
    优: 2,
    精: 3,
    极: 4,
    绝: 5,
    顶: 6
};
function parsePinji(raw) {
    if (!raw)
        return undefined;
    if (raw in PINJI_MAP)
        return PINJI_MAP[raw];
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 0 && n <= 6)
        return n;
    return undefined;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    let targetQQ;
    try {
        const mention = useMention(e)[0];
        const res = await mention.find({ IsBot: false });
        const list = res?.data || [];
        const user = list.find(i => !i.IsBot);
        if (user)
            targetQQ = user.UserId;
    }
    catch {
    }
    if (!targetQQ)
        return false;
    if (!(await existplayer(targetQQ))) {
        Send(Text('对方无踏入仙途'));
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?发/, '');
    const parts = raw
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (parts.length < 2) {
        Send(Text('格式错误，应为: 发 资源名*数量 或 发 装备名*品级*数量'));
        return false;
    }
    const thingName = parts[0];
    if (thingName === '灵石' || thingName === '修为' || thingName === '血气') {
        const amount = toInt(parts[1], 1);
        if (amount <= 0) {
            Send(Text('数量需为正整数'));
            return false;
        }
        if (thingName === '灵石')
            await addCoin(targetQQ, amount);
        else if (thingName === '修为')
            await addExp(targetQQ, amount);
        else
            await addExp2(targetQQ, amount);
        Send(Text(`发放成功: ${thingName} x ${amount}`));
        return false;
    }
    const thingDef = await foundthing(thingName);
    if (!thingDef) {
        Send(Text(`这方世界没有[${thingName}]`));
        return false;
    }
    const itemClass = String(thingDef.class || '道具');
    let pinji;
    let amountStr;
    if (itemClass === '装备') {
        const maybePinji = parsePinji(parts[1]);
        if (maybePinji !== undefined) {
            pinji = maybePinji;
            amountStr = parts[2];
        }
        else {
            amountStr = parts[1];
        }
    }
    else {
        amountStr = parts[1];
    }
    const amount = toInt(amountStr, 1);
    if (amount <= 0) {
        Send(Text('数量需为正整数'));
        return false;
    }
    await addNajieThing(targetQQ, thingName, itemClass, amount, pinji);
    Send(Text(`发放成功, 增加${thingName} x ${amount}${pinji !== undefined ? ` (品级:${pinji})` : ''}`));
    return false;
});

export { res as default, regular };
