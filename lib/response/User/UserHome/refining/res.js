import { useSend, Text } from 'alemonjs';
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
import { existplayer, readNajie } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import 'crypto';
import { addNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?打磨\S+\*\S+$/;
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
    if (!raw) {
        return undefined;
    }
    if (raw in PINJI_MAP) {
        return PINJI_MAP[raw];
    }
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?打磨/, '').trim();
    const parts = raw
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (parts.length < 2) {
        void Send(Text('格式：打磨 装备名*品级 例：打磨 斩仙剑*优'));
        return false;
    }
    const thingName = parts[0];
    const pinjiInput = parsePinji(parts[1]);
    if (pinjiInput === undefined) {
        void Send(Text(`未知品级：${parts[1]}`));
        return false;
    }
    if (pinjiInput >= 6) {
        void Send(Text(`${thingName}(${parts[1]})已是最高品级，无法继续打磨`));
        return false;
    }
    const thingDef = await foundthing(thingName);
    if (!thingDef) {
        void Send(Text(`你在瞎说啥呢? 哪来的【${thingName}】?`));
        return false;
    }
    const atk = Number(thingDef.atk || 0);
    const def = Number(thingDef.def || 0);
    const hp = Number(thingDef.HP || 0);
    if (atk < 10 && def < 10 && hp < 10) {
        void Send(Text(`${thingName}(${parts[1]})不支持打磨`));
        return false;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return false;
    }
    const equips = (najie.装备 || []).filter(i => i.name === thingName && (i.pinji ?? -1) === pinjiInput);
    const count = equips.length;
    if (count < 3) {
        void Send(Text(`需要同品级装备 3 件，你只有 ${thingName}(${parts[1]}) x${count}`));
        return false;
    }
    await addNajieThing(userId, thingName, '装备', -3, pinjiInput);
    await addNajieThing(userId, thingName, '装备', 1, pinjiInput + 1);
    void Send(Text(`打磨成功！${thingName} 品级 ${parts[1]} -> ${pinjiInput + 1}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
