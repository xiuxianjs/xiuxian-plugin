import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import {
  Go,
  readPlayer,
  readForum,
  writeForum,
  convert2integer,
  existNajieThing,
  addNajieThing,
  addCoin
} from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import type { NajieCategory, ForumRecord } from '@src/types/model';
import { getRedisKey } from '@src/model/keys';
export const regular = /^(#|＃|\/)?接取.*$/;

interface ForumOrder {
  qq?: number | string;
  thing: {
    name?: string;
    class?: string;
    出售价?: number;
  };
  start_price?: number;
  last_price?: number;
  amount?: number;
  last_offer_price?: number;
  last_offer_player?: number | string;
  groupList?: string[];
  aconut?: number;
  price?: number;
  whole?: number;
  name?: string;
  class?: string;
}

function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}
const CD_MINUTES = 0.5;
const CD_MS = CD_MINUTES * 60_000;
const MAX_QTY = 1_000_000_000;
const MAX_PRICE_SUM = 1e15;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  if (!(await Go(e))) {
    return false;
  }

  // 冷却
  const cdKey = getRedisKey(usr_qq, 'ForumCD');
  const now = Date.now();
  const last = toInt(await redis.get(cdKey), 0);

  if (now < last + CD_MS) {
    const remain = last + CD_MS - now;
    const m = Math.trunc(remain / 60000);
    const s = Math.trunc((remain % 60000) / 1000);

    Send(Text(`每${CD_MINUTES}分钟操作一次，CD: ${m}分${s}秒`));

    return false;
  }
  await redis.set(cdKey, String(now));

  const player = await readPlayer(usr_qq);

  if (!player) {
    Send(Text('存档异常'));

    return false;
  }

  // 解析指令 接取编号*数量
  const body = e.MessageText.replace(/^(#|＃|\/)?接取/, '').trim();

  if (!body) {
    Send(Text('格式: 接取编号*数量 (数量可省略为全部)'));

    return false;
  }
  const seg = body
    .split('*')
    .map(s => s.trim())
    .filter(Boolean);

  if (seg.length === 0) {
    Send(Text('指令解析失败'));

    return false;
  }
  const idxRaw = seg[0];
  const qtyRaw = seg[1];
  const orderIndex = toInt(await convert2integer(idxRaw), 0) - 1;

  if (orderIndex < 0) {
    Send(Text('编号不合法'));

    return false;
  }

  let forum: ForumRecord[] = [];

  try {
    forum = await readForum();
  } catch {
    await writeForum([]);
    forum = [];
  }
  if (orderIndex >= forum.length) {
    Send(Text('没有该编号的求购单'));

    return false;
  }

  const orderRaw = forum[orderIndex];
  const order: ForumOrder = {
    ...orderRaw,
    name: orderRaw.thing?.name,
    class: orderRaw.thing?.class,
    aconut: orderRaw.amount,
    price: orderRaw.last_price
  };

  // 自己不能接自己的单
  if (String(order.qq) === String(usr_qq)) {
    Send(Text('没事找事做?'));

    return false;
  }

  // 校验订单数据
  const unitPrice = toInt(order.price, 0);
  const remaining = toInt(order.aconut, 0);

  if (unitPrice <= 0 || remaining <= 0) {
    Send(Text('该求购单已失效'));

    return false;
  }

  // 解析数量
  let deliverQty: number;

  if (!qtyRaw) {
    deliverQty = remaining;
  } else {
    deliverQty = toInt(await convert2integer(qtyRaw), 0);
    if (deliverQty <= 0) {
      Send(Text('数量需为正整数'));

      return false;
    }
  }
  if (deliverQty > remaining) {
    deliverQty = remaining;
  }
  if (deliverQty > MAX_QTY) {
    deliverQty = MAX_QTY;
  }

  // 检查库存
  const hasNum = await existNajieThing(usr_qq, order.name, order.class as NajieCategory);

  if (!hasNum) {
    Send(Text(`你没有【${order.name}】`));

    return false;
  }
  if (hasNum < deliverQty) {
    Send(Text(`你只有【${order.name}】 x ${hasNum}`));

    return false;
  }

  const gain = unitPrice * deliverQty;

  if (!Number.isFinite(gain) || gain <= 0 || gain > MAX_PRICE_SUM) {
    Send(Text('价格计算异常'));

    return false;
  }

  // 扣除物品 & 增加灵石 & 给对方物品
  await addNajieThing(usr_qq, order.name, order.class as NajieCategory, -deliverQty);
  await addCoin(usr_qq, gain);
  await addNajieThing(
    String(order.qq ?? order.last_offer_player ?? ''),
    order.name,
    order.class as NajieCategory,
    deliverQty
  );
  // 更新订单
  orderRaw.amount = remaining - deliverQty;
  if (typeof order.whole === 'number') {
    order.whole = order.whole - gain;
  }
  if (orderRaw.amount <= 0) {
    forum.splice(orderIndex, 1);
  }
  await writeForum(forum);

  Send(Text(`${player.名号}在聚宝堂收获了${gain}灵石！(交付 ${order.name} x ${deliverQty})`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
