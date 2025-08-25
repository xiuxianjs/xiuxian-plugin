import { Text, useSend } from 'alemonjs';

import { data, redis } from '@src/model/api';
import { existplayer, Go, convert2integer, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw';
import { getRedisKey } from '@src/model/keys';
export const regular = /^(#|＃|\/)?发红包.*$/;

function toInt (v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : d;
}

const MIN_PER = 10000; // 单个红包最小单位(按原逻辑 取整到万)
const MAX_PACKETS = 200;
const MAX_TOTAL = 5_000_000_000; // 发放总额上限，防数据溢出
const CD_MS = 30 * 1000; // 30 秒发红包冷却

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  if (!(await existplayer(usr_qq))) return false;
  if (!(await Go(e))) return false;

  const cdKey = getRedisKey(usr_qq, 'giveHongbaoCD');

  const now = Date.now();
  const lastTs = toInt(await redis.get(cdKey));
  if (now < lastTs + CD_MS) {
    const remain = Math.ceil((lastTs + CD_MS - now) / 1000);
    Send(Text(`操作太频繁，请${remain}秒后再发红包`));
    return false;
  }

  const body = e.MessageText.replace(/^(#|＃|\/)?发红包/, '').trim();
  const seg = body
    .split('*')
    .map(s => s.trim())
    .filter(Boolean);
  if (seg.length < 2) {
    Send(Text('格式: 发红包金额*个数'));
    return false;
  }

  let per = toInt(await convert2integer(seg[0]), 0);
  let count = toInt(await convert2integer(seg[1]), 0);
  if (per <= 0 || count <= 0) {
    Send(Text('金额与个数需为正整数'));
    return false;
  }

  // 取整到万
  per = Math.trunc(per / MIN_PER) * MIN_PER;
  if (per < MIN_PER) {
    Send(Text(`单个红包至少 ${MIN_PER} 灵石`));
    return false;
  }
  if (count > MAX_PACKETS) count = MAX_PACKETS;

  const total = per * count;
  if (!Number.isFinite(total) || total <= 0) {
    Send(Text('金额异常'));
    return false;
  }
  if (total > MAX_TOTAL) {
    Send(Text('总额过大，已拒绝'));
    return false;
  }

  const player = await data.getData('player', usr_qq);
  if (!player || Array.isArray(player)) {
    Send(Text('存档异常'));
    return false;
  }
  if (player.灵石 < total) {
    Send(Text('红包数要比自身灵石数小噢'));
    return false;
  }

  // 并发保护: 使用 setnx 类逻辑 (简化：先检查再写入)
  const existing = await redis.get(getRedisKey(usr_qq, 'honbaoacount'));
  if (existing && Number(existing) > 0) {
    Send(Text('你已有未被抢完的红包，稍后再发'));
    return false;
  }

  await redis.set(getRedisKey(usr_qq, 'honbao'), String(per));
  await redis.set(getRedisKey(usr_qq, 'honbaoacount'), String(count));
  await addCoin(usr_qq, -total);
  await redis.set(cdKey, String(now));

  Send(Text(`【全服公告】${player.名号}发了${count}个${per}灵石的红包！`));
  return false;
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
