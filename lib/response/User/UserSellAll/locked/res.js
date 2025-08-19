import { useSend, Text } from 'alemonjs';
import { foundthing } from '../../../../model/cultivation.js';
import { updateBagThing } from '../../../../model/najie.js';
import { existplayer, readNajie } from '../../../../model/xiuxian_impl.js';
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?(锁定|解锁).*$/;
function parseCommand(raw) {
    const msg = raw.replace(/^(#|＃|\/)?/, '').trim();
    const action = msg.slice(0, 2);
    const rest = msg.slice(2);
    return { action, rest };
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
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const { action, rest } = parseCommand(e.MessageText);
    if (!['锁定', '解锁'].includes(action))
        return false;
    const parts = rest
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (!parts[0]) {
        Send(Text('未指定物品名称或序号'));
        return false;
    }
    let thingName = parts[0];
    let qualityToken = parts[1] || '';
    const najieRaw = await readNajie(usr_qq);
    const najie = najieRaw;
    const index = Number(thingName);
    if (Number.isFinite(index) && index >= 0) {
        if (index > 1000) {
            const pet = najie.仙宠 && najie.仙宠[index - 1001];
            if (!pet) {
                Send(Text('仙宠代号输入有误'));
                return false;
            }
            thingName = pet.name;
        }
        else if (index > 100) {
            const equip = najie.装备 && najie.装备[index - 101];
            if (!equip) {
                Send(Text('装备代号输入有误'));
                return false;
            }
            thingName = equip.name;
            if (equip.pinji !== undefined)
                qualityToken = String(equip.pinji);
        }
    }
    const thingDef = await foundthing(thingName);
    if (!thingDef) {
        Send(Text(`不存在的物品: ${thingName}`));
        return false;
    }
    const thingPinji = PINJI_MAP[qualityToken];
    const pinjiNum = typeof thingPinji === 'number' ? thingPinji : 0;
    const category = String(thingDef.class);
    const lockFlag = action === '锁定' ? 1 : 0;
    const updated = await updateBagThing(usr_qq, thingName, category, pinjiNum, lockFlag);
    if (updated) {
        Send(Text(`${category}:${thingName}${action === '锁定' ? '已锁定' : '已解锁'}`));
        return false;
    }
    Send(Text(`你没有【${thingName}】这样的${category}`));
    return false;
});

export { res as default, regular };
