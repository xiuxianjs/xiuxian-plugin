import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { readItTyped } from '../../../../model/duanzaofu.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import { writeIt } from '../../../../model/pub.js';
import { existplayer, readNajie, Write_najie } from '../../../../model/xiuxian_impl.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existNajieThing } from '../../../../model/najie.js';
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

const regular = /^(#|＃|\/)?赋名.*$/;
function toStr(v) {
    return typeof v === 'string' ? v : '';
}
function calcCanName(item) {
    if (!(item.atk < 10 && item.def < 10 && item.HP < 10))
        return false;
    if (item.atk >= 1.5)
        return true;
    if (item.def >= 1.2)
        return true;
    if (item.type === '法宝' && (item.atk >= 1 || item.def >= 1))
        return true;
    if (item.atk + item.def > 1.95)
        return true;
    return false;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const raw = e.MessageText.replace(/^(#|＃|\/)?赋名/, '').trim();
    if (!raw) {
        Send(Text('用法: 赋名原名称*新名称'));
        return false;
    }
    const [thing_nameRaw, new_nameRaw] = raw.split('*');
    const thing_name = toStr(thing_nameRaw).trim();
    const new_name = toStr(new_nameRaw).trim();
    if (!thing_name || !new_name) {
        Send(Text('格式错误，应: 赋名旧名*新名'));
        return false;
    }
    if (new_name.length > 8) {
        Send(Text('字符超出最大限制(<=8)，请重新赋名'));
        return false;
    }
    if (new_name === thing_name) {
        Send(Text('新旧名称相同，无需赋名'));
        return false;
    }
    const hasEquip = await existNajieThing(user_qq, thing_name, '装备');
    if (!hasEquip) {
        Send(Text('你没有这件装备'));
        return false;
    }
    if (await foundthing(new_name)) {
        Send(Text('这个世间已经拥有这把武器了'));
        return false;
    }
    let records = [];
    try {
        records = (await readItTyped());
    }
    catch {
        await writeIt([]);
        records = [];
    }
    if (records.some(r => r.name === thing_name || r.name === new_name)) {
        Send(Text('一个装备只能赋名一次'));
        return false;
    }
    const najie = await readNajie(user_qq);
    if (!najie) {
        Send(Text('纳戒数据异常'));
        return false;
    }
    const target = najie.装备.find(it => it.name === thing_name);
    if (!target) {
        Send(Text('未找到该装备，可能已被移动或重命名'));
        return false;
    }
    const atk = Number(target.atk) || 0;
    const def = Number(target.def) || 0;
    const HP = Number(target.HP) || 0;
    if (!calcCanName({ atk, def, HP, type: target.type })) {
        Send(Text('您的装备太弱了,无法赋予名字'));
        return false;
    }
    target.name = new_name;
    records.push({
        name: new_name,
        type: target.type || '武器',
        atk,
        def,
        HP,
        author_name: user_qq
    });
    await Write_najie(user_qq, najie);
    await writeIt(records.map(r => ({ ...r })));
    Send(Text(`附名成功,您的${thing_name}更名为${new_name}`));
    return false;
});

export { res as default, regular };
