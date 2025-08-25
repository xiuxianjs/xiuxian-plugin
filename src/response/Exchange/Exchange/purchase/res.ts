import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import {
  Go,
  readPlayer,
  readExchange,
  writeExchange,
  convert2integer,
  addNajieThing,
  addCoin
} from '@src/model/index';

import { selects } from '@src/response/mw';
import { getRedisKey } from '@src/model/keys';
export const regular = /^(#|＃|\/)?选购.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  // 全局状态判断
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  // 防并发cd
  const time0 = 0.5; // 分钟cd
  // 获取当前时间
  const now_time = Date.now();
  const Exchange_res = await redis.get(getRedisKey(usr_qq, 'ExchangeCD'));
  const ExchangeCD = parseInt(Exchange_res);
  const transferTimeout = Math.floor(60000 * time0);

  if (now_time < ExchangeCD + transferTimeout) {
    const ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
    const ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);

    Send(Text(`每${transferTimeout / 1000 / 60}分钟操作一次，` + `CD: ${ExchangeCDm}分${ExchangeCDs}秒`));

    // 存在CD。直接返回
    return false;
  }
  // 记录本次执行时间
  await redis.set(getRedisKey(usr_qq, 'ExchangeCD'), String(now_time));
  const player = await readPlayer(usr_qq);
  let Exchange = [];

  try {
    Exchange = await readExchange();
  } catch {
    // 没有表要先建立一个！
    await writeExchange([]);
  }
  const t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*');
  const x = (await convert2integer(t[0])) - 1;

  if (x >= Exchange.length) {
    return false;
  }
  const thingqq = Exchange[x].qq;

  if (thingqq == usr_qq) {
    Send(Text('自己买自己的东西？我看你是闲得蛋疼！'));

    return false;
  }
  // 根据qq得到物品
  const thing_name = Exchange[x].thing.name;
  const thing_class = Exchange[x].thing.class;
  const thing_amount = Exchange[x].amount;
  const thing_price = Exchange[x].price;
  let n = await convert2integer(t[1]);

  if (!t[1]) {
    n = thing_amount;
  }
  if (n > thing_amount) {
    Send(Text(`冲水堂没有这么多【${thing_name}】!`));

    return false;
  }
  const money = n * thing_price;

  // 查灵石
  if (player.灵石 > money) {
    // 加物品
    if (thing_class == '装备' || thing_class == '仙宠') {
      await addNajieThing(usr_qq, Exchange[x].thing.name, thing_class, n, Exchange[x].pinji2);
    } else {
      await addNajieThing(usr_qq, thing_name, thing_class, n);
    }
    // 扣钱
    await addCoin(usr_qq, -money);
    // 加钱
    await addCoin(thingqq, money);
    Exchange[x].aconut = Exchange[x].aconut - n;
    Exchange[x].whole = Exchange[x].whole - money;
    // 删除该位置信息
    Exchange = Exchange.filter(item => item.aconut > 0);
    await writeExchange(Exchange);
    Send(Text(`${player.名号}在冲水堂购买了${n}个【${thing_name}】！`));
  } else {
    Send(Text('醒醒，你没有那么多钱！'));

    return false;
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
