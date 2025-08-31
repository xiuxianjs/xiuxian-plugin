import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { Go, readPlayer, readExchange, writeExchange, convert2integer, addNajieThing, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw';
import { getRedisKey } from '@src/model/keys';
export const regular = /^(#|＃|\/)?选购.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 全局状态判断
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  // 防并发cd
  const time0 = 0.5; // 分钟cd
  // 获取当前时间
  const now_time = Date.now();
  const res = await redis.get(getRedisKey(userId, 'ExchangeCD'));

  if (!res) {
    return;
  }
  const ExchangeCD = parseInt(res);
  const transferTimeout = Math.floor(60000 * time0);

  if (now_time < ExchangeCD + transferTimeout) {
    const ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
    const ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);

    void Send(Text(`每${transferTimeout / 1000 / 60}分钟操作一次，CD: ${ExchangeCDm}分${ExchangeCDs}秒`));

    // 存在CD。直接返回
    return false;
  }
  // 记录本次执行时间
  await redis.set(getRedisKey(userId, 'ExchangeCD'), String(now_time));
  const player = await readPlayer(userId);
  let Exchange = await readExchange();

  const t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*');

  // 如果t[0]或t[1]不是非0开头的数字, 发送提示并返回
  if (!/^[1-9]\d*$/.test(t[0])) {
    void Send(Text(`请输入正确的编号,${t[0]}不是合法的数字`));

    return false;
  }
  if (!/^[1-9]\d*$/.test(t[1])) {
    void Send(Text(`请输入正确的数量,${t[1]}不是合法的数字`));

    return false;
  }
  const x = convert2integer(t[0]) - 1;

  if (x >= Exchange.length) {
    return false;
  }
  const thingqq = Exchange[x].qq;

  if (thingqq === userId) {
    void Send(Text('自己买自己的东西？我看你是闲得蛋疼！'));

    return false;
  }
  // 根据qq得到物品
  const thingName = Exchange[x].thing.name;
  const thingClass = Exchange[x].thing.class;
  const thingCount = Exchange[x].amount;
  const thingPrice = Exchange[x].price;
  let n = convert2integer(t[1]);

  if (!t[1]) {
    n = thingCount;
  }
  if (n > thingCount) {
    void Send(Text(`冲水堂没有这么多【${thingName}】!`));

    return false;
  }
  const money = n * thingPrice;

  // 计算阶梯税收：物品低于100w交易后收3%税，每多100w多收3%
  const calculateTax = (totalPrice: number): number => {
    const million = 1000000; // 100w
    const baseTaxRate = 0.03; // 3%

    if (totalPrice < million) {
      // 低于100w收3%税
      return Math.floor(totalPrice * baseTaxRate);
    }

    // 计算有多少个100w（包含第一个100w）
    const millionCount = Math.ceil(totalPrice / million);
    // 税率 = 基础税率 * 100w的个数
    const taxRate = baseTaxRate * millionCount;

    // 最高为45%的税
    if (taxRate > 0.45) {
      return Math.floor(totalPrice * 0.45);
    }

    return Math.floor(totalPrice * taxRate);
  };

  const tax = calculateTax(money);
  const sellerReceives = money - tax; // 卖家实际获得的金额（扣除税费后）

  // 查灵石（买家只需支付商品原价）
  if (player.灵石 >= money) {
    // 加物品
    if (thingClass === '装备' || thingClass === '仙宠') {
      await addNajieThing(userId, Exchange[x].thing.name, thingClass, n, Exchange[x].pinji2);
    } else {
      await addNajieThing(userId, thingName, thingClass, n);
    }
    // 买家扣钱（只扣商品原价）
    await addCoin(userId, -money);
    // 卖家获得扣税后的金额
    await addCoin(thingqq, sellerReceives);
    Exchange[x].amount = Exchange[x].amount - n;
    // 删除该位置信息
    Exchange = Exchange.filter(item => item.amount > 0);
    await writeExchange(Exchange);

    // 构建购买成功消息
    let message = `${player.名号}在冲水堂购买了${n}个【${thingName}】！\n支付金额：${money}灵石`;

    if (tax > 0) {
      message += `\n卖家获得：${sellerReceives}灵石（已扣除${tax}灵石税费）`;
    } else {
      message += `\n卖家获得：${sellerReceives}灵石`;
    }
    void Send(Text(message));
  } else {
    void Send(Text('醒醒，你没有那么多钱！'));

    return false;
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
