import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import { foundthing } from '../../../../model/cultivation.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?哪里有(.*)$/;
const AREA_COLLECTION_KEYS = [
    'guildSecrets_list',
    'forbiddenarea_list',
    'Fairyrealm_list',
    'timeplace_list',
    'didian_list',
    'shenjie',
    'mojie',
    'xingge',
    'shop_list'
];
const ITEM_LEVEL_KEYS = ['one', 'two', 'three'];
function normalizeName(raw) {
    return raw.trim();
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const thingName = normalizeName(e.MessageText.replace(/^(#|＃|\/)?哪里有/, ''));
    if (!thingName) {
        Send(Text('请输入要查找的物品名称'));
        return false;
    }
    const exists = await foundthing(thingName);
    if (!exists) {
        Send(Text(`你在瞎说啥呢?哪来的【${thingName}】?`));
        return false;
    }
    const paperCount = await existNajieThing(usr_qq, '寻物纸', '道具');
    if (!paperCount || paperCount <= 0) {
        Send(Text('查找物品需要【寻物纸】'));
        return false;
    }
    const foundPlaces = [];
    const seen = new Set();
    for (const key of AREA_COLLECTION_KEYS) {
        const root = data;
        const collection = root[key];
        if (!Array.isArray(collection))
            continue;
        for (const areaRaw of collection) {
            const area = areaRaw;
            if (!area || typeof area !== 'object')
                continue;
            const areaName = area.name || '未知地点';
            let matched = false;
            for (const levelKey of ITEM_LEVEL_KEYS) {
                const list = area[levelKey];
                if (!Array.isArray(list) || list.length === 0)
                    continue;
                if (list.some(it => it &&
                    typeof it === 'object' &&
                    it.name === thingName)) {
                    matched = true;
                    break;
                }
            }
            if (matched && !seen.has(areaName)) {
                seen.add(areaName);
                foundPlaces.push(areaName);
            }
        }
    }
    await addNajieThing(usr_qq, '寻物纸', '道具', -1);
    if (foundPlaces.length === 0) {
        Send(Text(`天地没有回应......(已消耗1张寻物纸)`));
        return false;
    }
    const resultMsg = `【${thingName}】可能出现在:\n` +
        foundPlaces.map(n => `- ${n}`).join('\n') +
        '\n(已消耗1张寻物纸)';
    Send(Text(resultMsg));
    return false;
});

export { res as default, regular };
