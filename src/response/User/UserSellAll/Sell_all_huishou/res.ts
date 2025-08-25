import { Text, useSend } from 'alemonjs';

import { data } from '@src/model/api';
import { existplayer, foundthing, addNajieThing, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?一键回收(.*)$/;

interface BagItem {
  name: string;
  class: string | number;
  数量?: number;
  出售价?: number;
  pinji?: number | string;
}
interface NajieData {
  [k: string]: BagItem[] | unknown;
}
const CATEGORIES = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'] as const;

function num(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? n : d;
}
function normalizeCat(v): string {
  return String(v ?? '');
}
function normAddCat(v): Parameters<typeof addNajieThing>[2] {
  return String(v) as Parameters<typeof addNajieThing>[2];
}
function normPinji(v): Parameters<typeof addNajieThing>[4] {
  return v as Parameters<typeof addNajieThing>[4];
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const najie = (await data.getData('najie', userId)) as NajieData | null;

  if (!najie) {
    void Send(Text('纳戒数据异常'));

    return false;
  }

  // 解析用户指定分类（可多个连续例如: #一键回收装备丹药）
  const rawTail = e.MessageText.replace(/^(#|＃|\/)?一键回收/, '').trim();
  let targetCats: string[] = [...CATEGORIES];

  if (rawTail && rawTail !== '') {
    const chosen: string[] = [];
    let rest = rawTail;

    for (const cat of CATEGORIES) {
      if (rest.includes(cat)) {
        chosen.push(cat);
        rest = rest.replace(new RegExp(cat, 'g'), '');
      }
    }
    rest = rest.trim();
    if (chosen.length === 0 || rest.length > 0) {
      // 输入无法完全匹配分类，视为无效
      return false;
    }
    targetCats = chosen;
  }

  let total = 0;
  let soldCount = 0;

  for (const cat of targetCats) {
    const arr = najie[cat] as BagItem[] | undefined;

    if (!Array.isArray(arr) || arr.length === 0) {
      continue;
    }
    for (const item of arr) {
      if (!item?.name) {
        continue;
      }
      const thing = await foundthing(item.name);

      // 原逻辑错误：若存在则 continue，这里修复为不存在跳过
      if (!thing) {
        continue;
      }
      const qty = num(item.数量);

      if (qty <= 0) {
        continue;
      }
      const salePrice = num(item.出售价);

      if (salePrice <= 0) {
        continue;
      }
      // 材料/草药 1 倍，其它 2 倍
      const multiplier =
        normalizeCat(item.class) === '材料' || normalizeCat(item.class) === '草药' ? 1 : 2;

      total += salePrice * qty * multiplier;
      await addNajieThing(userId, item.name, normAddCat(item.class), -qty, normPinji(item.pinji));
      soldCount += qty;
    }
  }

  if (total <= 0) {
    void Send(Text('没有可回收的物品'));

    return false;
  }

  await addCoin(userId, total);
  void Send(Text(`回收成功，出售 ${soldCount} 件物品，获得 ${total} 灵石`));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
