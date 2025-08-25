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
// 移除无效的外部类型导入，自定义最小结构
interface CustomEquipRecord {
  name: string;
  type: string;
  atk: number;
  def: number;
  HP: number;
  author_name?: string;
}

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?赋名.*$/;

function toStr (v): string {
  return typeof v === 'string' ? v : '';
}
function calcCanName (item: { atk: number; def: number; HP: number; type?: string }): boolean {
  // 原逻辑: 三项基础值都 < 10 时才允许按阈值比较 (老版本强化? 以防高面板反复赋名)
  if (!(item.atk < 10 && item.def < 10 && item.HP < 10)) return false;
  if (item.atk >= 1.5) return true;
  if (item.def >= 1.2) return true;
  if (item.type === '法宝' && (item.atk >= 1 || item.def >= 1)) return true;
  if (item.atk + item.def > 1.95) return true;
  return false;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const user_qq = e.UserId;
  if (!(await existplayer(user_qq))) return false;

  const raw = e.MessageText.replace(/^(#|＃|\/)?赋名/, '').trim();
  if (!raw) {
    Send(Text('用法: 赋名原名称*新名称'));
    return false;
  }
  const [thing_nameRaw, new_nameRaw] = raw.split('*');
  const thing_name = toStr(thing_nameRaw).trim();
  const new_name = toStr(new_nameRaw).trim();
  if (!thing_name || !new_name) {
    Send(Text('格式错误，应: 赋名旧名*新名'));
    return false;
  }
  if (new_name.length > 8) {
    Send(Text('字符超出最大限制(<=8)，请重新赋名'));
    return false;
  }
  if (new_name === thing_name) {
    Send(Text('新旧名称相同，无需赋名'));
    return false;
  }

  // 是否拥有该装备
  const hasEquip = await existNajieThing(user_qq, thing_name, '装备');
  if (!hasEquip) {
    Send(Text('你没有这件装备'));
    return false;
  }

  // 全局重名检查
  if (await foundthing(new_name)) {
    Send(Text('这个世间已经拥有这把武器了'));
    return false;
  }

  // 读取已命名记录
  let records: CustomEquipRecord[] = [];
  try {
    records = await readItTyped();
  } catch {
    await writeIt([]);
    records = [];
  }

  // 防止重复赋名（用旧名或已改名后的新名都算）
  if (records.some(r => r.name === thing_name || r.name === new_name)) {
    Send(Text('一个装备只能赋名一次'));
    return false;
  }

  const najie = await readNajie(user_qq);
  if (!najie) {
    Send(Text('纳戒数据异常'));
    return false;
  }

  const target = najie.装备.find(it => it.name === thing_name);
  if (!target) {
    Send(Text('未找到该装备，可能已被移动或重命名'));
    return false;
  }

  // 数值规范化
  const atk = Number(target.atk) || 0;
  const def = Number(target.def) || 0;
  const HP = Number(target.HP) || 0;

  if (!calcCanName({ atk, def, HP, type: target.type })) {
    Send(Text('您的装备太弱了,无法赋予名字'));
    return false;
  }

  // 执行赋名
  target.name = new_name;
  records.push({
    name: new_name,
    type: target.type || '武器',
    atk,
    def,
    HP,
    author_name: user_qq
  });

  await writeNajie(user_qq, najie);
  // 写回记录（转为通用结构数组）
  await writeIt(records.map(r => ({ ...r })));

  Send(Text(`附名成功,您的${thing_name}更名为${new_name}`));
  return false;
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
