import { Text, useSend } from 'alemonjs';
import { redis } from '@src/model/api';
import { existplayer, shijianc, readPlayer, writePlayer } from '@src/model/index';
import { showSlayer } from '../user';
import { selects } from '@src/response/mw';
import { getRedisKey } from '@src/model/keys';

export const regular = /^(#|＃|\/)?(改名|设置道宣).*$/;
const regularCut = /^(#|＃|\/)?(改名|设置道宣)/;

interface DateStruct {
  Y: number;
  M: number;
  D: number;
}
function getDayStruct(ts): DateStruct | null {
  const n = Number(ts);

  if (!Number.isFinite(n) || n <= 0) {
    return null;
  }
  try {
    return shijianc(n) as DateStruct;
  } catch {
    return null;
  }
}
function sameDay(a: DateStruct | null, b: DateStruct | null) {
  return !!a && !!b && a.Y === b.Y && a.M === b.M && a.D === b.D;
}
function cleanInput(raw: string) {
  return raw.replace(regularCut, '').replace(/\s+/g, '').replace(/\+/g, '');
}
function isMessageEvent(ev): ev is Parameters<typeof showSlayer>[0] {
  return !!ev && typeof ev === 'object' && 'MessageText' in ev;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const isRename = /改名/.test(e.MessageText);
  const raw = cleanInput(e.MessageText);

  if (isRename) {
    if (raw.length === 0) {
      void Send(Text('改名格式为:【#改名张三】请输入正确名字'));

      return false;
    }
    if (raw.length > 8) {
      void Send(Text('玩家名字最多八字'));

      return false;
    }

    const now = Date.now();
    const today = shijianc(now) as DateStruct;
    const lastKey = getRedisKey(userId, 'last_setname_time');
    const lastRaw = await redis.get(lastKey);
    const lastStruct = getDayStruct(lastRaw);

    if (sameDay(today, lastStruct)) {
      void Send(Text('每日只能改名一次'));

      return false;
    }

    const player = await readPlayer(userId);

    if (!player) {
      void Send(Text('玩家数据异常'));

      return false;
    }
    const cost = 1000;

    if (typeof player.灵石 !== 'number' || player.灵石 < cost) {
      void Send(Text(`改名需要${cost}灵石`));

      return false;
    }
    player.名号 = raw;
    player.灵石 -= cost;
    await writePlayer(userId, player);
    await redis.set(lastKey, String(now));
    if (isMessageEvent(e)) {
      showSlayer(e);
    }

    return false;
  }
  // 设置道宣
  if (raw.length === 0) {
    return false;
  }
  if (raw.length > 50) {
    void Send(Text('道宣最多50字符'));

    return false;
  }

  const now = Date.now();
  const today = shijianc(now) as DateStruct;
  const lastKey = getRedisKey(userId, 'last_setxuanyan_time');
  const lastRaw = await redis.get(lastKey);
  const lastStruct = getDayStruct(lastRaw);

  if (sameDay(today, lastStruct)) {
    void Send(Text('每日仅可更改一次'));

    return false;
  }

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据异常'));

    return false;
  }
  player.宣言 = raw;
  await writePlayer(userId, player);
  await redis.set(lastKey, String(now));
  if (isMessageEvent(e)) {
    showSlayer(e);
  }

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
