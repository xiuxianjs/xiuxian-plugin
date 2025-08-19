import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { notUndAndNull } from '../../../../model/common.js';
import { addPet } from '../../../../model/pets.js';
import { readNajie } from '../../../../model/xiuxian_impl.js';
import { selects } from '../../../mw.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';

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
    if (typeof p.等级 === 'number')
        return Math.trunc(p.等级);
    return 1;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await data.existData('player', usr_qq)))
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player || typeof player !== 'object')
        return false;
    if (!player.仙宠)
        player.仙宠 = { name: '', type: '', 加成: 0 };
    let input = e.MessageText.replace(/^(#|＃|\/)?出战仙宠/, '').trim();
    if (!input) {
        Send(Text('请在指令后附上仙宠名称或代号(>1000)'));
        return false;
    }
    const najie = await readNajie(usr_qq);
    if (!najie || !Array.isArray(najie.仙宠)) {
        Send(Text('纳戒数据异常'));
        return false;
    }
    const code = toInt(input, NaN);
    if (!Number.isNaN(code) && code > 1000) {
        const idx = code - 1001;
        const targetUnknown = najie.仙宠[idx];
        if (idx < 0 || idx >= najie.仙宠.length || !isBagPetLike(targetUnknown)) {
            Send(Text('仙宠代号输入有误!'));
            return false;
        }
        input = targetUnknown.name || input;
    }
    if (player.仙宠?.灵魂绑定 === 1 && player.仙宠.name !== input) {
        Send(Text(`你已经与${player.仙宠.name}绑定了灵魂,无法更换别的仙宠！`));
        return false;
    }
    const petDef = data.xianchon.find(p => p.name === input);
    if (!notUndAndNull(petDef)) {
        Send(Text('这方世界不存在' + input));
        return false;
    }
    const bagPetUnknown = najie.仙宠.find(p => p.name === input);
    if (!isBagPetLike(bagPetUnknown)) {
        Send(Text('你没有' + input));
        return false;
    }
    const bagPet = bagPetUnknown;
    if (player.仙宠?.name === bagPet.name) {
        Send(Text('该仙宠已在出战中'));
        return false;
    }
    if (player.仙宠 && notUndAndNull(player.仙宠.name)) {
        const oldLevel = getPlayerPetLevel(player.仙宠);
        if (player.仙宠.type === '修炼')
            player.修炼效率提升 -= Number(player.仙宠.加成 || 0);
        if (player.仙宠.type === '幸运')
            player.幸运 -= Number(player.仙宠.加成 || 0);
        await addPet(usr_qq, player.仙宠.name, 1, oldLevel);
    }
    const level = getLevel(bagPet);
    const per = getPer(bagPet) ?? petDef.每级增加;
    const bonus = calcBonus(level, per);
    const newPet = {
        name: input,
        type: petDef.type,
        加成: bonus,
        等级: level,
        每级增加: per,
        灵魂绑定: bagPet.灵魂绑定
    };
    player.仙宠 = newPet;
    if (newPet.type === '修炼')
        player.修炼效率提升 += newPet.加成;
    if (newPet.type === '幸运')
        player.幸运 += newPet.加成;
    await addPet(usr_qq, newPet.name, -1, newPet.等级);
    await writePlayer(usr_qq, player);
    Send(Text('成功出战' + newPet.name));
    return false;
});

export { res as default, regular };
