import { Text, useSend } from 'alemonjs';

import { existplayer, readNajie, foundthing, convert2integer, existNajieThing, addNajieThing, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
export const regular = /^(#|＃|\/)?出售\S+(?:\*\S+){0,2}$/;

// 辅助
function toInt(v, def = 0): number {
  const n = Number(v);

  return Number.isFinite(n) ? Math.floor(n) : def;
}
const PINJI_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
};

function parsePinji(raw: string | undefined): number | undefined {
  if (!raw) {
    return undefined;
  }
  if (raw in PINJI_MAP) {
    return PINJI_MAP[raw];
  }
  const n = Number(raw);

  return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const najie = await readNajie(userId);

  if (!najie) {
    return false;
  }

  // 提取命令部分（去前缀）
  const raw = e.MessageText.replace(/^(#|＃|\/)?出售/, '').trim();

  if (!raw) {
    void Send(Text('格式：出售 物品名*(品级)*数量  例如: 出售 血气丹*10 / 出售 斩仙剑*优*1'));

    return false;
  }
  const segs = raw
    .split('*')
    .map(s => s.trim())
    .filter(Boolean);

  if (!segs.length) {
    void Send(Text('未检测到物品名'));

    return false;
  }

  let thingName = segs[0];

  // 支持数字代号：>1000 仙宠；>100 装备
  const codeNum = Number(segs[0]);

  if (Number.isInteger(codeNum)) {
    try {
      if (codeNum > 1000) {
        thingName = najie.仙宠[codeNum - 1001]?.name || thingName;
      } else if (codeNum > 100) {
        thingName = najie.装备[codeNum - 101]?.name || thingName;
      }
    } catch {
      void Send(Text('代号解析失败'));

      return false;
    }
  }

  const thingDef = await foundthing(thingName);

  if (!thingDef) {
    void Send(Text(`这方世界没有[${thingName}]`));

    return false;
  }
  const itemClass = String(thingDef.class || '道具') as Parameters<typeof addNajieThing>[2];

  // 解析品级与数量
  let pinji: number | undefined;
  let amountStr: string | undefined;

  if (itemClass === '装备') {
    // 可能格式： 名称*品级*数量 或 名称*数量
    const maybePinji = parsePinji(segs[1]);

    if (maybePinji !== undefined) {
      pinji = maybePinji;
      amountStr = segs[2];
    } else {
      amountStr = segs[1];
    }
  } else {
    amountStr = segs[1];
  }

  let amount = convert2integer(amountStr);

  if (!amount || amount <= 0) {
    amount = 1;
  }

  // 装备 / 仙宠 默认数量为 1
  if ((itemClass === '装备' || itemClass === '仙宠') && amount !== 1) {
    amount = 1;
  }

  // 若装备未指定品级，自动选择最高品级实例
  if (itemClass === '装备' && pinji === undefined) {
    const allEqu = (najie.装备 || []).filter(i => i.name === thingName);

    if (!allEqu.length) {
      void Send(Text(`你没有[${thingName}]`));

      return false;
    }
    const best = allEqu.reduce((p, c) => (toInt(c.pinji) > toInt(p.pinji) ? c : p));

    pinji = toInt(best.pinji, 0);
  }

  // 数量存在性校验
  const owned = await existNajieThing(userId, thingName, itemClass, pinji);

  if (!owned || owned < amount) {
    void Send(Text(`你只有[${thingName}]*${owned || 0}`));

    return false;
  }

  // 扣除物品
  await addNajieThing(userId, thingName, itemClass, -amount, pinji);

  // 价格计算：基础出售价 * 数量；若在杂类中且是装备需按背包装备条目出售价
  let price = toInt(thingDef['出售价']) * amount;

  const zalei = await getDataList('Zalei');

  if (zalei.find(it => it.name === thingName.replace(/[0-9]+/g, ''))) {
    // 在 najie 中查找对应品级的装备
    const sel = (najie.装备 || []).find(i => i.name === thingName && toInt(i.pinji) === (pinji ?? 0));

    if (sel) {
      price = toInt(sel.出售价) * amount;
    }
  }
  if (price <= 0) {
    price = 1;
  }
  await addCoin(userId, price);

  const remain = (await existNajieThing(userId, thingName, itemClass, pinji)) || 0;

  void Send(Text(`出售成功! 获得${price}灵石, 剩余 ${thingName}*${remain}`));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
