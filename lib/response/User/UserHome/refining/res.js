import { useSend, Text } from 'alemonjs';
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
import { existplayer, readNajie } from '../../../../model/xiuxian_impl.js';
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
    if (!raw)
        return undefined;
    if (raw in PINJI_MAP)
        return PINJI_MAP[raw];
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const raw = e.MessageText.replace(/^(#|＃|\/)?打磨/, '').trim();
    const parts = raw
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (parts.length < 2) {
        Send(Text('格式：打磨 装备名*品级 例：打磨 斩仙剑*优'));
        return false;
    }
    const thingName = parts[0];
    const pinjiInput = parsePinji(parts[1]);
    if (pinjiInput === undefined) {
        Send(Text(`未知品级：${parts[1]}`));
        return false;
    }
    if (pinjiInput >= 6) {
        Send(Text(`${thingName}(${parts[1]})已是最高品级，无法继续打磨`));
        return false;
    }
    const thingDef = await foundthing(thingName);
    if (!thingDef) {
        Send(Text(`你在瞎说啥呢? 哪来的【${thingName}】?`));
        return false;
    }
    const atk = Number(thingDef.atk || 0);
    const def = Number(thingDef.def || 0);
    const hp = Number(thingDef.HP || 0);
    if (atk < 10 && def < 10 && hp < 10) {
        Send(Text(`${thingName}(${parts[1]})不支持打磨`));
        return false;
    }
    const najie = await readNajie(usr_qq);
    if (!najie)
        return false;
    const equips = (najie.装备 || []).filter(i => i.name === thingName && (i.pinji ?? -1) === pinjiInput);
    const count = equips.length;
    if (count < 3) {
        Send(Text(`需要同品级装备 3 件，你只有 ${thingName}(${parts[1]}) x${count}`));
        return false;
    }
    await addNajieThing(usr_qq, thingName, '装备', -3, pinjiInput);
    await addNajieThing(usr_qq, thingName, '装备', 1, pinjiInput + 1);
    Send(Text(`打磨成功！${thingName} 品级 ${parts[1]} -> ${pinjiInput + 1}`));
    return false;
});

export { res as default, regular };
