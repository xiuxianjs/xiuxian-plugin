import { Text, useSend } from 'alemonjs';

import { existplayer, foundthing, convert2integer, readForum, writeForum, readPlayer, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?发布.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  // 固定写法
  const userId = e.UserId;

  // 有无存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const thing = e.MessageText.replace(/^(#|＃|\/)?发布/, '');
  const code = thing.split('*');
  const thingName = code[0]; // 物品
  const value = code[1]; // 价格
  const amount = code[2]; // 数量
  // 判断列表中是否存在，不存在不能卖,并定位是什么物品
  const thingExist = await foundthing(thingName);

  if (!thingExist) {
    void Send(Text(`这方世界没有[${thingName}]`));

    return false;
  }
  if (thingExist.class === '装备' || thingExist.class === '仙宠') {
    void Send(Text('暂不支持该类型物品交易'));

    return false;
  }
  const thingValue = convert2integer(value);
  const thingCount = convert2integer(amount);
  const Forum = await readForum();

  const isMeLength = Forum.filter(item => item.qq === userId)?.length || 0;

  if (isMeLength >= 3) {
    void Send(Text(`你已发布了${isMeLength}个物品，请先处理`));

    return false;
  }

  const whole = Math.trunc(thingValue * thingCount);

  if (whole < 100000) {
    void Send(Text('物品总价低于10w灵石的，聚宝堂将不受理'));

    return;
  }

  // 计算阶梯税收：物品低于100w交易后收3%税，每多100w多收3%，最高为15%。
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

    const max = 0.15;

    // 15%的税
    if (taxRate > max) {
      return Math.floor(totalPrice * max);
    }

    const curPrice = Math.floor(totalPrice * taxRate);

    if (curPrice < 100000) {
      return 100000;
    }

    return Math.floor(totalPrice * taxRate);
  };

  const off = calculateTax(whole);

  const player = await readPlayer(userId);

  const needPrice = off + whole;

  if (player.灵石 < needPrice) {
    void Send(Text(`灵石不足,需要${needPrice}(+${off})灵石`));

    return false;
  }

  await addCoin(userId, -needPrice);

  const wupin = {
    qq: userId,
    name: thingName,
    price: thingValue,
    class: thingExist.class,
    aconut: thingCount,
    whole: whole,
    now_time: Date.now()
  };

  Forum.push(wupin);

  await writeForum(Forum);

  void Send(Text(`你已发布[${thingName}]*${thingCount}，单价${thingValue}灵石，总价${whole}灵石，交纳${off}灵石`));
});

export default onResponse(selects, [mw.current, res.current]);
