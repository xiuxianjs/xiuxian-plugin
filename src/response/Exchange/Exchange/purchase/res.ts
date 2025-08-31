import { Text, useSend } from 'alemonjs';
import { Go, readPlayer, readExchange, writeExchange, addNajieThing, addCoin, keysLock, compulsoryToNumber } from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { withLock } from '@src/model/locks';

export const regular = /^(#|＃|\/)?选购.*$/;

const byGoods = async ({ e, index, count }) => {
  const Send = useSend(e);
  const userId = e.UserId;
  const Exchange = await readExchange();

  if (index >= Exchange.length) {
    return;
  }

  const goods = Exchange[index];

  if (!goods) {
    void Send(Text('物品不存在'));

    return;
  }

  const thingqq = goods.qq;

  if (thingqq === userId) {
    void Send(Text('自己买自己的东西？'));

    return;
  }

  const thingName = goods.thing.name;
  const thingClass = goods.thing.class;
  const thingCount = goods.amount;
  const thingPrice = goods.price;
  const pinji2 = goods?.pinji2;

  if (count > thingCount) {
    void Send(Text(`没有这么多【${thingName}】!`));

    return;
  }

  //
  const money = count * thingPrice;

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

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家信息不存在'));

    return;
  }

  // 查灵石（买家只需支付商品原价）
  if (player.灵石 >= money) {
    const types = ['装备', '仙宠'];

    // 加物品
    if (thingClass && types.includes(thingClass)) {
      await addNajieThing(userId, thingName, thingClass, count, pinji2);
    } else {
      await addNajieThing(userId, thingName, thingClass, count);
    }

    // 买家扣钱（只扣商品原价）
    await addCoin(userId, -money);

    // 卖家获得扣税后的金额
    await addCoin(thingqq, sellerReceives);

    Exchange[index].amount = Exchange[index].amount - count;

    // 删除该位置信息
    await writeExchange(Exchange.filter(item => item.amount > 0));

    // 构建购买成功消息
    let message = `${player.名号}在冲水堂购买了${count}个【${thingName}】！\n支付金额：${money}灵石`;

    if (tax > 0) {
      message += `\n卖家获得：${sellerReceives}灵石（已扣除${tax}灵石税费）`;
    } else {
      message += `\n卖家获得：${sellerReceives}灵石`;
    }

    void Send(Text(message));
  } else {
    void Send(Text('醒醒，你没有那么多钱！'));
  }
};

const executeBattleWithLock = props => {
  const lockKey = keysLock.exchange(props.index);

  return withLock(
    lockKey,
    async () => {
      await byGoods(props);
    },
    {
      timeout: 30000, // 30秒超时
      retryDelay: 100, // 100ms重试间隔
      maxRetries: 5, // 最大重试5次
      enableRenewal: true, // 启用锁续期
      renewalInterval: 10000 // 10秒续期间隔
    }
  );
};

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  // 全局状态判断
  const flag = await Go(e);

  if (!flag) {
    return false;
  }

  const t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*');

  // 如果t[0]或t[1]不是非0开头的数字, 发送提示并返回
  if (!/^[1-9]\d*$/.test(t[0])) {
    void Send(Text(`请输入正确的编号,${t[0]}不是合法的数字`));

    return false;
  }

  const index = compulsoryToNumber(t[0], 1) - 1;

  const count = compulsoryToNumber(t[1], 1);

  void executeBattleWithLock({ e, index, count });
});

export default onResponse(selects, [mw.current, res.current]);
