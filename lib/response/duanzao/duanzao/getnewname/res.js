import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readNajie, writeNajie, writeIt } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { readItTyped } from '../../../../model/duanzaofu.js';
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
import { existNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?赋名.*$/;
function toStr(v) {
    return typeof v === 'string' ? v : '';
}
function calcCanName(item) {
    if (!(item.atk < 10 && item.def < 10 && item.HP < 10)) {
        return false;
    }
    if (item.atk >= 1.5) {
        return true;
    }
    if (item.def >= 1.2) {
        return true;
    }
    if (item.type === '法宝' && (item.atk >= 1 || item.def >= 1)) {
        return true;
    }
    if (item.atk + item.def > 1.95) {
        return true;
    }
    return false;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?赋名/, '').trim();
    if (!raw) {
        void Send(Text('用法: 赋名原名称*新名称'));
        return false;
    }
    const [thingNameRaw, newNameRaw] = raw.split('*');
    const thingName = toStr(thingNameRaw).trim();
    const newName = toStr(newNameRaw).trim();
    if (!thingName || !newName) {
        void Send(Text('格式错误，应: 赋名旧名*新名'));
        return false;
    }
    if (newName.length > 8) {
        void Send(Text('字符超出最大限制(<=8)，请重新赋名'));
        return false;
    }
    if (newName === thingName) {
        void Send(Text('新旧名称相同，无需赋名'));
        return false;
    }
    const hasEquip = await existNajieThing(userId, thingName, '装备');
    if (!hasEquip) {
        void Send(Text('你没有这件装备'));
        return false;
    }
    if (await foundthing(newName)) {
        void Send(Text('这个世间已经拥有这把武器了'));
        return false;
    }
    const records = await readItTyped();
    if (records.some(r => r.name === thingName || r.name === newName)) {
        void Send(Text('一个装备只能赋名一次'));
        return false;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        void Send(Text('纳戒数据异常'));
        return false;
    }
    const target = najie.装备.find(it => it.name === thingName);
    if (!target) {
        void Send(Text('未找到该装备，可能已被移动或重命名'));
        return false;
    }
    const atk = Number(target.atk) || 0;
    const def = Number(target.def) || 0;
    const HP = Number(target.HP) || 0;
    if (!calcCanName({ atk, def, HP, type: target.type })) {
        void Send(Text('您的装备太弱了,无法赋予名字'));
        return false;
    }
    target.name = newName;
    records.push({
        name: newName,
        type: target.type || '武器',
        atk,
        def,
        HP,
        author_name: userId
    });
    await writeNajie(userId, najie);
    await writeIt(records.map(r => ({ ...r })));
    void Send(Text(`附名成功,您的${thingName}更名为${newName}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
