import { Text, useSend } from 'alemonjs';

import { existplayer, foundthing, convert2integer, readForum, writeForum, readPlayer, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
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
  const thing_value = convert2integer(value);
  const thingCount = convert2integer(amount);
  const Forum = await readForum();

  const now_time = Date.now();
  const whole = Math.trunc(thing_value * thingCount);
  let off = Math.trunc(whole * 0.03);

  if (off < 100000) {
    off = 100000;
  }
  const player = await readPlayer(userId);

  if (player.灵石 < off + whole) {
    void Send(Text(`灵石不足,还需要${off + whole - player.灵石}灵石`));

    return false;
  }
  await addCoin(userId, -(off + whole));
  const wupin = {
    qq: userId,
    name: thingName,
    price: thing_value,
    class: thingExist.class,
    aconut: thingCount,
    whole: whole,
    now_time: now_time
  };

  Forum.push(wupin);
  // 写入
  await writeForum(Forum);
  void Send(Text('发布成功！'));
});

export default onResponse(selects, [mw.current, res.current]);
