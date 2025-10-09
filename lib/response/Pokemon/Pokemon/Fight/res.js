import { useSend, Text } from 'alemonjs';
import { notUndAndNull } from '../../../../model/common.js';
import { addPet } from '../../../../model/pets.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
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
import { existplayer, readPlayer, readNajie, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?出战仙宠.*$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
function calcBonus(level, per) {
    return toInt(level) * Number(per || 0);
}
function isBagPetLike(p) {
    return !!p && typeof p === 'object' && 'name' in p;
}
function getLevel(p) {
    return toInt(p.等级, 1);
}
function getPer(p) {
    const v = Number(p.每级增加);
    return Number.isFinite(v) ? v : undefined;
}
function getPlayerPetLevel(p) {
    if (typeof p.等级 === 'number') {
        return Math.trunc(p.等级);
    }
    return 1;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player || typeof player !== 'object') {
        return false;
    }
    if (player.level_id < 12) {
        void Send(Text('境界不足，暂未开放'));
        return false;
    }
    if (!player.仙宠) {
        player.仙宠 = { name: '', type: '', 加成: 0 };
    }
    let input = e.MessageText.replace(/^(#|＃|\/)?出战仙宠/, '').trim();
    if (!input) {
        void Send(Text('请在指令后附上仙宠名称或代号(>1000)'));
        return false;
    }
    const najie = await readNajie(userId);
    if (!najie || !Array.isArray(najie.仙宠)) {
        void Send(Text('纳戒数据异常'));
        return false;
    }
    const code = toInt(input, NaN);
    if (!Number.isNaN(code) && code > 1000) {
        const idx = code - 1001;
        const targetUnknown = najie.仙宠[idx];
        if (idx < 0 || idx >= najie.仙宠.length || !isBagPetLike(targetUnknown)) {
            void Send(Text('仙宠代号输入有误!'));
            return false;
        }
        input = targetUnknown.name || input;
    }
    if (player.仙宠?.灵魂绑定 === 1 && player.仙宠.name !== input) {
        void Send(Text(`你已经与${player.仙宠.name}绑定了灵魂,无法更换别的仙宠！`));
        return false;
    }
    const xianchonData = await getDataList('Xianchon');
    const petDef = xianchonData.find(p => p.name === input);
    if (!notUndAndNull(petDef)) {
        void Send(Text('这方世界不存在' + input));
        return false;
    }
    const bagPetUnknown = najie.仙宠.find(p => p.name === input);
    if (!isBagPetLike(bagPetUnknown)) {
        void Send(Text('你没有' + input));
        return false;
    }
    const bagPet = bagPetUnknown;
    if (player.仙宠?.name === bagPet.name) {
        void Send(Text('该仙宠已在出战中'));
        return false;
    }
    if (player.仙宠 && notUndAndNull(player.仙宠.name)) {
        const oldLevel = getPlayerPetLevel(player.仙宠);
        if (player.仙宠.type === '修炼') {
            player.修炼效率提升 -= Number(player.仙宠.加成 || 0);
        }
        if (player.仙宠.type === '幸运') {
            player.幸运 -= Number(player.仙宠.加成 || 0);
        }
        await addPet(userId, player.仙宠.name, 1, oldLevel);
    }
    const level = getLevel(bagPet);
    const per = getPer(bagPet) ?? petDef.每级增加;
    const bonus = calcBonus(level, per);
    const newPet = {
        id: petDef.id,
        name: input,
        type: petDef.type,
        加成: bonus,
        等级: level,
        每级增加: per,
        灵魂绑定: bagPet.灵魂绑定,
        等级上限: petDef.等级上限,
        品级: petDef.品级
    };
    player.仙宠 = newPet;
    if (newPet.type === '修炼') {
        player.修炼效率提升 += newPet.加成;
    }
    if (newPet.type === '幸运') {
        player.幸运 += newPet.加成;
    }
    await addPet(userId, newPet.name, -1, newPet.等级);
    await writePlayer(userId, player);
    void Send(Text('成功出战' + newPet.name));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
