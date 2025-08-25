import { Text, useSend } from 'alemonjs';

import { notUndAndNull } from '@src/model/common';
import { addPet } from '@src/model/pets';
import { readNajie, writePlayer, readPlayer, existplayer } from '@src/model/xiuxian_impl';
import { getDataList } from '@src/model/DataList';
import type { Player, NajieItem, XianchongInfo } from '@src/types/player';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?出战仙宠.*$/;

interface PetDef {
  name: string;
  type: string;
  每级增加: number;
}
interface BagPetLike {
  name?: string;
  等级?;
  每级增加?;
  灵魂绑定?: number;
  type?: string;
  加成?;
}

function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}
function calcBonus(level: number, per: number) {
  return toInt(level) * Number(per || 0);
}
function isBagPetLike(p): p is BagPetLike {
  return !!p && typeof p === 'object' && 'name' in p;
}
function getLevel(p: BagPetLike): number {
  return toInt(p.等级, 1);
}
function getPer(p: BagPetLike): number | undefined {
  const v = Number(p.每级增加);

  return Number.isFinite(v) ? v : undefined;
}

// 兼容 Player.仙宠 计算等级 (部分旧数据无等级字段)
function getPlayerPetLevel(p: XianchongInfo | (XianchongInfo & { 等级?: number })): number {
  if (typeof (p as { 等级? }).等级 === 'number') { return Math.trunc((p as { 等级: number }).等级); }

  return 1;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  if (!(await existplayer(usr_qq))) { return false; }
  const player = (await readPlayer(usr_qq)) as Player;

  if (!player || typeof player !== 'object') { return false; }
  if (!player.仙宠) { player.仙宠 = { name: '', type: '', 加成: 0 }; }

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

  const xianchonData = await getDataList('Xianchon');
  const petDef = (xianchonData as PetDef[]).find(p => p.name === input);

  if (!notUndAndNull(petDef)) {
    Send(Text('这方世界不存在' + input));

    return false;
  }

  const bagPetUnknown = najie.仙宠.find(p => (p).name === input);

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

    if (player.仙宠.type === '修炼') { player.修炼效率提升 -= Number(player.仙宠.加成 || 0); }
    if (player.仙宠.type === '幸运') { player.幸运 -= Number(player.仙宠.加成 || 0); }
    await addPet(usr_qq, player.仙宠.name, 1, oldLevel);
  }

  const level = getLevel(bagPet);
  const per = getPer(bagPet) ?? petDef.每级增加;
  const bonus = calcBonus(level, per);

  const newPet: XianchongInfo & {
    等级: number;
    每级增加: number;
    灵魂绑定?: number;
  } = {
    name: input,
    type: petDef.type,
    加成: bonus,
    等级: level,
    每级增加: per,
    灵魂绑定: bagPet.灵魂绑定
  };

  player.仙宠 = newPet;

  if (newPet.type === '修炼') { player.修炼效率提升 += newPet.加成; }
  if (newPet.type === '幸运') { player.幸运 += newPet.加成; }

  await addPet(usr_qq, newPet.name, -1, newPet.等级);
  await writePlayer(usr_qq, player);

  Send(Text('成功出战' + newPet.name));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
