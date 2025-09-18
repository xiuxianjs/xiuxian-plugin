import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { getEquipmentImage } from '../../../../model/image.js';
import 'crypto';
import { insteadEquipment } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?一键装备$/;
function num(v, d = 0) {
    const num = Number(v);
    if (isNaN(num) || !isFinite(num)) {
        return d;
    }
    return num;
}
async function calcBaseThree(player) {
    const levelObj = (await getDataList('Level1')).find(i => i['level_id'] === player.level_id);
    const phyObj = (await getDataList('Level2')).find(i => i['level_id'] === player.Physique_id);
    if (!levelObj || !phyObj) {
        return null;
    }
    const atk = num(levelObj.基础攻击) + num(player.攻击加成) + num(phyObj.基础攻击);
    const def = num(levelObj.基础防御) + num(player.防御加成) + num(phyObj.基础防御);
    const hp = num(levelObj.基础血量) + num(player.生命加成) + num(phyObj.基础血量);
    return [atk, def, hp];
}
function score(e, base) {
    const small = e.atk < 10 && e.def < 10 && e.HP < 10;
    return small ? e.atk * base[0] * 0.43 + e.def * base[1] * 0.16 + e.HP * base[2] * 0.41 : e.atk * 0.43 + e.def * 0.16 + e.HP * 0.41;
}
function toEquipLike(item, cls) {
    return {
        name: item.name,
        type: item.type,
        atk: num(item.atk),
        def: num(item.def),
        HP: num(item.HP),
        class: cls,
        bao: num(item.bao),
        pinji: num(item?.pinji ?? 0)
    };
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const najie = await getDataJSONParseByKey(keys.najie(userId));
    if (!najie) {
        return;
    }
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const base = await calcBaseThree(player);
    if (!base) {
        void Send(Text('境界数据缺失，无法智能换装'));
        return false;
    }
    const equipment = await getDataJSONParseByKey(keys.equipment(userId));
    if (!equipment) {
        void Send(Text('当前装备数据异常'));
        return false;
    }
    const bagList = Array.isArray(najie?.装备) ? najie?.装备 : [];
    const slotTypes = ['武器', '护具', '法宝'];
    for (const slot of slotTypes) {
        const current = equipment[slot];
        if (!current) {
            continue;
        }
        let bestScore = score(current, base);
        let best = null;
        for (const item of bagList) {
            if (!item || item.type !== slot) {
                continue;
            }
            const thing = await foundthing(item.name);
            if (!thing) {
                continue;
            }
            const sc = score(item, base);
            if (sc > bestScore) {
                bestScore = sc;
                best = item;
            }
        }
        if (best) {
            const defThing = await foundthing(best.name);
            if (defThing) {
                const equipArg = toEquipLike(best, defThing.class);
                await insteadEquipment(userId, equipArg);
            }
        }
    }
    const img = await getEquipmentImage(e);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
        return false;
    }
    void Send(Text('图片加载失败'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
