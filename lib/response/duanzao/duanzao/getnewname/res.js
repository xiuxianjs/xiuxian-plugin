import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { readItTyped } from '../../../../model/duanzaofu.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import { writeIt } from '../../../../model/pub.js';
import { existplayer, readNajie, Write_najie } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/XiuxianData.js';
import { existNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import { foundthing } from '../../../../model/cultivation.js';
import 'dayjs';
import '../../../../model/api.js';
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
        records = await readItTyped();
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
