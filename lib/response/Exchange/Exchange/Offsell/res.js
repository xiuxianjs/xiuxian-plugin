import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
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
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
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

const regular = /^(#|＃|\/)?下架[1-9]\d*$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
function mapRecord(r) {
    if (!r || typeof r !== 'object')
        return null;
    const rec = r;
    if ('qq' in rec && rec.name)
        return rec;
    const er = r;
    if (er.thing) {
        const name = {
            name: String(er.thing.name || ''),
            class: (er.thing.class || '道具')
        };
        return { qq: String(er.last_offer_player || ''), name, aconut: er.amount };
    }
    return null;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const now = Date.now();
    const cdMs = Math.floor(0.5 * 60000);
    const cdKey = `xiuxian@1.3.0:${usr_qq}:ExchangeCD`;
    const lastTs = toInt(await redis.get(cdKey));
    if (now < lastTs + cdMs) {
        const remain = lastTs + cdMs - now;
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        Send(Text(`每${cdMs / 60000}分钟操作一次，CD: ${m}分${s}秒`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const idx = toInt(e.MessageText.replace(/^(#|＃|\/)?下架/, ''), 0) - 1;
    if (idx < 0) {
        Send(Text('编号格式错误'));
        return false;
    }
    let rawList = [];
    try {
        rawList = (await readExchange());
    }
    catch {
        await writeExchange([]);
        rawList = [];
    }
    const list = rawList
        .map(mapRecord)
        .filter(Boolean);
    if (idx >= list.length) {
        Send(Text(`没有编号为${idx + 1}的物品`));
        return false;
    }
    const rec = list[idx];
    if (rec.qq !== usr_qq) {
        Send(Text('不能下架别人上架的物品'));
        return false;
    }
    let thingName = '';
    let thingClass = '';
    if (typeof rec.name === 'string') {
        thingName = rec.name;
        thingClass = rec.class || '';
    }
    else {
        thingName = rec.name.name;
        thingClass = rec.name.class;
    }
    if (!thingName) {
        Send(Text('物品名称缺失'));
        return false;
    }
    const amount = toInt(rec.aconut, 1);
    const cate = (thingClass || '道具');
    if (cate === '装备' || cate === '仙宠') {
        const equipName = typeof rec.name === 'string' ? rec.name : rec.name.name;
        await addNajieThing(usr_qq, equipName, cate, amount, rec.pinji2);
    }
    else {
        await addNajieThing(usr_qq, thingName, cate, amount);
    }
    rawList.splice(idx, 1);
    await writeExchange(rawList);
    await redis.set(`xiuxian@1.3.0:${usr_qq}:Exchange`, '0');
    const player = await readPlayer(usr_qq);
    Send(Text(`${player?.名号 || usr_qq}下架${thingName}成功！`));
    return false;
});

export { res as default, regular };
