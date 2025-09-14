import { Text, useSend } from 'alemonjs';
import { redis } from '@src/model/api';
import { existplayer, shijianc, getLastSign, addNajieThing, addExp, writePlayer, getConfig, readPlayer, isUserMonthCard } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import { getRedisKey } from '@src/model/keys';
import mw from '@src/response/mw-captcha';
import { NajieCategory } from '@src/types';

export const regular = /^(#|＃|\/)?修仙签到$/;

// 常量定义
const MS_PER_DAY = 86400000;
const MONTH_CARD_CONNECT_SIGN_KEY = 'xiuxian@1.3.0:month_card_connect_sign:';

interface SignConfig {
  Sign?: { ticket?: number };
}

interface PlayerData {
  连续签到天数?: number;
  [key: string]: any;
}

const weeklyGift = [
  { name: '五阶玄元丹', type: '丹药', account: 1 },
  { name: '五阶淬体丹', type: '丹药', account: 1 },
  { name: '仙府通行证', type: '道具', account: 1 },
  { name: '道具盲盒', type: '道具', account: 1 }
];

function isSameDay(time1: number, time2: number): boolean {
  const d1 = shijianc(time1);
  const d2 = shijianc(time2);

  return d1.Y === d2.Y && d1.M === d2.M && d1.D === d2.D;
}

// 更新月卡连续签到天数并发放奖励
async function updateMonthCardConnectSign(userId: string, Send: ReturnType<typeof useSend>): Promise<void> {
  const connectSignNumKey = MONTH_CARD_CONNECT_SIGN_KEY + userId;
  const connectSignNumStr = await redis.get(connectSignNumKey);
  const connectSignNum = parseInt(connectSignNumStr ?? '0', 10);

  if (isNaN(connectSignNum)) {
    await redis.set(connectSignNumKey, '1');
  } else {
    const newConnectSignNum = connectSignNum + 1;

    await redis.set(connectSignNumKey, newConnectSignNum);

    if (newConnectSignNum % 7 === 0) {
      for (const item of weeklyGift) {
        await addNajieThing(userId, item.name, item.type as NajieCategory, item.account);
      }
      const msg = weeklyGift.map(i => `${i.name}*${i.account}`).join('，');

      void Send(Text(`恭喜您额外获得${msg}`));
    }
  }
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const nowTime = Date.now();
  const yesterdayTime = nowTime - MS_PER_DAY;
  const lastSignStruct = await getLastSign(userId);
  const isMonthCard = await isUserMonthCard(userId);

  // 判断今日是否已签到
  if (lastSignStruct && isSameDay(lastSignStruct.time, nowTime) && lastSignStruct.sign === 2) {
    void Send(Text('今日已经签到过了'));

    return false;
  }

  // 处理月卡用户的补签逻辑
  if (lastSignStruct && isSameDay(lastSignStruct.time, yesterdayTime) && lastSignStruct.sign === 1 && isMonthCard) {
    await redis.set(getRedisKey(userId, 'lastsign_time'), JSON.stringify({ time: nowTime, sign: 2 }));

    await addNajieThing(userId, '闪闪发光的石头', '道具', 1);
    await addNajieThing(userId, '秘境之匙', '道具', 10);
    void Send(Text('补签成功，获得闪闪发光的石头*1，秘境之匙*10'));

    await updateMonthCardConnectSign(userId, Send);

    return false;
  }
  if (lastSignStruct && isSameDay(lastSignStruct.time, yesterdayTime) && lastSignStruct.sign === 1 && !isMonthCard) {
    void Send(Text('今日已经签到过了'));

    return false;
  }
  let sign = 1;

  if (isMonthCard) {
    sign = 2;
  }

  const continued = lastSignStruct && isSameDay(yesterdayTime, lastSignStruct.time);

  await redis.set(getRedisKey(userId, 'lastsign_time'), JSON.stringify({ time: nowTime, sign: sign }));
  if (!continued) {
    await redis.set(MONTH_CARD_CONNECT_SIGN_KEY + userId, 0);
  }
  if (!isMonthCard) {
    await redis.del(MONTH_CARD_CONNECT_SIGN_KEY + userId);
  }

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据异常'));

    return false;
  }

  const record = player as PlayerData;
  const currentStreak = typeof record.连续签到天数 === 'number' && Number.isFinite(record.连续签到天数) ? record.连续签到天数 : 0;

  const newStreak = continued && currentStreak < 7 ? currentStreak + 1 : 1;

  record.连续签到天数 = newStreak;
  await writePlayer(userId, player);

  const cf = (await getConfig('xiuxian', 'xiuxian')) as SignConfig | undefined;
  let ticketNum = Math.max(0, Number(cf?.Sign?.ticket ?? 0));
  const giftExp = newStreak * 3000;

  if (ticketNum > 0) {
    await addNajieThing(userId, '秘境之匙', '道具', ticketNum);
  }

  let msg = '';

  if (isMonthCard) {
    await addNajieThing(userId, '闪闪发光的石头', '道具', 1);
    await addNajieThing(userId, '秘境之匙', '道具', 10);
    ticketNum += 10;
    msg = ',闪闪发光的石头*1';

    await updateMonthCardConnectSign(userId, Send);
  }

  await addExp(userId, giftExp);
  void Send(Text(`已经连续签到${newStreak}天，获得修为${giftExp}${ticketNum > 0 ? `，秘境之匙x${ticketNum}` : ''} ${msg}`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
