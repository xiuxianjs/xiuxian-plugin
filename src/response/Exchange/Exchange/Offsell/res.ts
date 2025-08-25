import { getRedisKey } from '@src/model/keys';
import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import {
  existplayer,
  readPlayer,
  readExchange,
  writeExchange,
  addNajieThing
} from '@src/model/index';
import type { ExchangeRecord as RawExchangeRecord, NajieCategory } from '@src/types/model';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?下架[1-9]\d*$/;

interface LegacyRecord {
  qq: string;
  name: { name: string; class: NajieCategory } | string;
  aconut?: number;
  pinji2?: number;
  class?: NajieCategory;
}

function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}
function mapRecord(r): LegacyRecord | null {
  if (!r || typeof r !== 'object') { return null; }
  const rec = r as LegacyRecord;

  if ('qq' in rec && rec.name) { return rec; }
  const er = r as RawExchangeRecord;

  if (er.thing) {
    const name = {
      name: String(er.thing.name || ''),
      class: (er.thing.class || '道具') as NajieCategory
    };

    return { qq: String(er.last_offer_player || ''), name, aconut: er.amount };
  }

  return null;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  if (!(await existplayer(usr_qq))) { return false; }

  const now = Date.now();
  const cdMs = Math.floor(0.5 * 60000);
  const cdKey = getRedisKey(usr_qq, 'ExchangeCD');

  const lastTs = toInt(await redis.get(cdKey));

  if (now < lastTs + cdMs) {
    const remain = lastTs + cdMs - now;
    const m = Math.trunc(remain / 60000);
    const s = Math.trunc((remain % 60000) / 1000);

    Send(Text(`每${cdMs / 60000}分钟操作一次，CD: ${m}分${s}秒`));

    return false;
  }
  await redis.set(cdKey, String(now));

  const idx = toInt(e.MessageText.replace(/^(#|＃|\/)?下架/, ''), 0) - 1;

  if (idx < 0) {
    Send(Text('编号格式错误'));

    return false;
  }

  let rawList = [];

  try {
    rawList = await readExchange();
  } catch {
    await writeExchange([] as RawExchangeRecord[]);
    rawList = [];
  }
  const list: LegacyRecord[] = rawList.map(mapRecord).filter(Boolean) as LegacyRecord[];

  if (idx >= list.length) {
    Send(Text(`没有编号为${idx + 1}的物品`));

    return false;
  }

  const rec = list[idx];

  if (rec.qq !== usr_qq) {
    Send(Text('不能下架别人上架的物品'));

    return false;
  }

  let thingName = '';
  let thingClass: NajieCategory | '' = '';

  if (typeof rec.name === 'string') {
    thingName = rec.name;
    thingClass = rec.class || '';
  } else {
    thingName = rec.name.name;
    thingClass = rec.name.class;
  }
  if (!thingName) {
    Send(Text('物品名称缺失'));

    return false;
  }
  const amount = toInt(rec.aconut, 1);
  const cate: NajieCategory = (thingClass || '道具');

  if (cate === '装备' || cate === '仙宠') {
    const equipName = typeof rec.name === 'string' ? rec.name : rec.name.name;

    await addNajieThing(usr_qq, equipName, cate, amount, rec.pinji2);
  } else {
    await addNajieThing(usr_qq, thingName, cate, amount);
  }

  rawList.splice(idx, 1);
  await writeExchange(rawList as RawExchangeRecord[]);
  await redis.set(getRedisKey(usr_qq, 'Exchange'), '0');

  const player = await readPlayer(usr_qq);

  Send(Text(`${player?.名号 || usr_qq}下架${thingName}成功！`));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
