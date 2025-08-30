import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { existplayer, shijianc, getLastsign, addNajieThing, addExp, writePlayer, getConfig, readPlayer, isUserMonthCard } from '@src/model/index';

import { selects } from '@src/response/mw';
import { getRedisKey } from '@src/model/keys';
export const regular = /^(#|＃|\/)?修仙签到$/;

interface LastSignStruct {
  Y: number;
  M: number;
  D: number;
}
interface SignConfig {
  Sign?: { ticket?: number };
}
function isLastSignStruct(v): v is LastSignStruct {
  if (!v || typeof v !== 'object') {
    return false;
  }
  const obj = v;

  return typeof obj.Y === 'number' && typeof obj.M === 'number' && typeof obj.D === 'number';
}
const isSameDay = (a: LastSignStruct, b: LastSignStruct) => a.Y === b.Y && a.M === b.M && a.D === b.D;

const weeklyGift = [
  {
    name: '五阶玄元丹',
    type: '丹药',
    account: 1
  },
  {
    name: '五阶淬体丹',
    type: '丹药',
    account: 1
  },
  {
    name: '仙府通行证',
    type: '道具',
    account: 1
  },
  {
    name: '道具盲盒',
    type: '道具',
    account: 1
  }
];

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const nowTime = Date.now();
  const yesterdayStruct = shijianc(nowTime - 24 * 60 * 60 * 1000);
  const todayStruct = shijianc(nowTime);
  const lastSignStruct = await getLastsign(userId);

  if (isLastSignStruct(lastSignStruct) && isLastSignStruct(todayStruct) && isSameDay(todayStruct, lastSignStruct)) {
    void Send(Text('今日已经签到过了'));

    return false;
  }
  const continued = isLastSignStruct(lastSignStruct) && isLastSignStruct(yesterdayStruct) && isSameDay(yesterdayStruct, lastSignStruct);

  await redis.set(getRedisKey(userId, 'lastsign_time'), String(nowTime));

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据异常'));

    return false;
  }
  const record = player as { [key: string]: any; 连续签到天数?: number };
  let currentStreak = 0;
  const rawStreak = record['连续签到天数'];

  if (typeof rawStreak === 'number' && Number.isFinite(rawStreak)) {
    currentStreak = rawStreak;
  }
  let newStreak = currentStreak === 7 || !continued ? 0 : currentStreak;

  newStreak += 1;
  record.连续签到天数 = newStreak;

  await writePlayer(userId, player);

  const cf = (await getConfig('xiuxian', 'xiuxian')) as SignConfig | undefined;
  let ticketNum = Math.max(0, Number(cf?.Sign?.ticket ?? 0));
  const gift_xiuwei = newStreak * 3000;

  if (ticketNum > 0) {
    await addNajieThing(userId, '秘境之匙', '道具', ticketNum);
  }
  let msg = '';

  if (await isUserMonthCard(userId)) {
    await addNajieThing(userId, '闪闪发光的石头', '道具', 1);
    await addNajieThing(userId, '秘境之匙', '道具', 10);
    ticketNum += 10;
    msg = ',闪闪发光的石头*1';
  }
  await addExp(userId, gift_xiuwei);

  void Send(Text(`已经连续签到${newStreak}天，获得修为${gift_xiuwei}${ticketNum > 0 ? `，秘境之匙x${ticketNum}` : ''} ${msg}`));
  if ((await isUserMonthCard(userId)) && newStreak === 7) {
    for (const i of weeklyGift) {
      await addNajieThing(userId, i.name, i.type as NajieCategory, i.account);
    }
    const msg = weeklyGift.map(i => `${i.name}*${i.account}`).join('，');

    void Send(Text(`连续签到7天 恭喜您获得${msg}`));
  }

  return false;
});

import mw from '@src/response/mw';
import { NajieCategory } from '@src/types';
export default onResponse(selects, [mw.current, res.current]);
