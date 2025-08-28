import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { existplayer, addNajieThing } from '@src/model/index';
import type { NajieCategory } from '@src/types/model';

import { selects } from '@src/response/mw';
import { getRedisKey } from '@src/model/keys';
import { getDataList } from '@src/model/DataList';
export const regular = /^(#|＃|\/)?活动兑换.*$/;

// 兑换码结构类型
interface ExchangeThing {
  name: string;
  class: string;
  数量: number;
}
interface ExchangeCode {
  name: string;
  thing: ExchangeThing[];
}

function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}
function parseJson<T>(raw): T | null {
  if (typeof raw !== 'string' || !raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
const CATEGORY_SET: Set<NajieCategory> = new Set([
  '装备',
  '丹药',
  '道具',
  '功法',
  '草药',
  '材料',
  '仙宠',
  '仙宠口粮'
]);

function normalizeCategory(c: string | undefined): NajieCategory {
  return CATEGORY_SET.has(c as NajieCategory) ? (c as NajieCategory) : '道具';
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const codeInput = e.MessageText.replace(/^(#|＃|\/)?活动兑换/, '').trim();

  if (!codeInput) {
    void Send(Text('请在指令后输入兑换码'));

    return false;
  }

  const list = ((await getDataList('ExchangeItem')) || []) as ExchangeCode[];
  const codeObj = list.find(c => c.name === codeInput);

  if (!codeObj) {
    void Send(Text('兑换码不存在!'));

    return false;
  }

  const key = getRedisKey(userId, 'duihuan');
  const usedList = parseJson<string[]>(await redis.get(key)) || [];

  if (usedList.includes(codeInput)) {
    void Send(Text('你已经兑换过该兑换码了'));

    return false;
  }

  // 标记已使用 (先写入，防并发重复领取)
  usedList.push(codeInput);
  await redis.set(key, JSON.stringify(usedList));

  const msg: string[] = [];

  for (const t of codeObj.thing || []) {
    const qty = toInt(t.数量, 0);

    if (!t.name || qty <= 0) {
      continue;
    }
    const cate = normalizeCategory(t.class);

    await addNajieThing(userId, t.name, cate, qty);
    msg.push(`\n${t.name}x${qty}`);
  }
  if (!msg.length) {
    void Send(Text('该兑换码没有有效奖励内容'));

    return false;
  }
  void Send(Text('恭喜获得:' + msg.join('')));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
