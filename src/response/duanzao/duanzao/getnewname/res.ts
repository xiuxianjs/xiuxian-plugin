import { Text, useSend } from 'alemonjs';

import {
  existplayer,
  existNajieThing,
  foundthing,
  readItTyped,
  writeIt,
  readNajie,
  writeNajie
} from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?赋名.*$/;

function toStr(v): string {
  return typeof v === 'string' ? v : '';
}
function calcCanName(item: { atk: number; def: number; HP: number; type?: string }): boolean {
  // 原逻辑: 三项基础值都 < 10 时才允许按阈值比较 (老版本强化? 以防高面板反复赋名)
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

const res = onResponse(selects, async e => {
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

  // 是否拥有该装备
  const hasEquip = await existNajieThing(userId, thingName, '装备');

  if (!hasEquip) {
    void Send(Text('你没有这件装备'));

    return false;
  }

  // 全局重名检查
  if (await foundthing(newName)) {
    void Send(Text('这个世间已经拥有这把武器了'));

    return false;
  }

  // 读取已命名记录
  const records = await readItTyped();

  // 防止重复赋名（用旧名或已改名后的新名都算）
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

  // 数值规范化
  const atk = Number(target.atk) || 0;
  const def = Number(target.def) || 0;
  const HP = Number(target.HP) || 0;

  if (!calcCanName({ atk, def, HP, type: target.type })) {
    void Send(Text('您的装备太弱了,无法赋予名字'));

    return false;
  }

  // 执行赋名
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
  // 写回记录（转为通用结构数组）
  await writeIt(records.map(r => ({ ...r })));

  void Send(Text(`附名成功,您的${thingName}更名为${newName}`));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
