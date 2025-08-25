import { Text, useMessage, useSubscribe } from 'alemonjs';

import { data } from '@src/model/api';
import { existplayer, addNajieThing, addCoin, sleep, keys } from '@src/model/index';

import { selects } from '@src/response/mw';
import type { NajieCategory } from '@src/types/model';
export const regular = /^(#|＃|\/)?一键出售(.*)$/;

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const usr_qq = e.UserId;
  // 有无存档
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return false;
  }
  let commodities_price = 0;
  const najie = await getDataJSONParseByKey(keys.najie(usr_qq));

  if (!najie) {
    return false;
  }
  let wupin: NajieCategory[] = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
  const wupin1: NajieCategory[] = [];

  if (e.MessageText != '#一键出售') {
    let thing = e.MessageText.replace(/^(#|＃|\/)?/, '');

    for (const i of wupin) {
      if (thing == i) {
        wupin1.push(i);
        thing = thing.replace(i, '');
      }
    }
    if (thing.length == 0) {
      wupin = wupin1;
    } else {
      return false;
    }
    for (const i of wupin) {
      const list = najie[i];

      if (!Array.isArray(list)) {
        continue;
      }
      for (const l of list as Array<{
        name: string;
        islockd?: number;
        数量?: number;
        出售价?: number;
        class?: string;
        pinji?: number;
      }>) {
        if (l && (l.islockd ?? 0) == 0) {
          const quantity = typeof l.数量 === 'number' ? l.数量 : 0;
          const price = typeof l.出售价 === 'number' ? l.出售价 : 0;
          const cls = (l.class as NajieCategory) || i;

          await addNajieThing(usr_qq, l.name, cls, -quantity, l.pinji);
          commodities_price += price * quantity;
        }
      }
    }
    await addCoin(usr_qq, commodities_price);
    message.send(format(Text(`出售成功!  获得${commodities_price}灵石 `)));

    return false;
  }
  let goodsNum = 0;
  const goods: string[] = [];

  goods.push('正在出售:');
  for (const i of wupin) {
    const list = najie[i];

    if (!Array.isArray(list)) {
      continue;
    }
    for (const l of list as Array<{
      name: string;
      islockd?: number;
      数量?: number;
    }>) {
      if (l && (l.islockd ?? 0) == 0) {
        const quantity = typeof l.数量 === 'number' ? l.数量 : 0;

        goods.push('\n' + l.name + '*' + quantity);
        goodsNum++;
      }
    }
  }
  if (goodsNum == 0) {
    message.send(format(Text('没有东西可以出售')));

    return false;
  }
  goods.push('\n回复[1]出售,回复[0]取消出售');
  /** 设置上下文 */
  for (let i = 0; i < goods.length; i += 8) {
    message.send(format(Text(goods.slice(i, i + 8).join(''))));
    await sleep(500);
  }
  const [subscribe] = useSubscribe(e, selects);
  const sub = subscribe.mount(
    async event => {
      clearTimeout(timeout);
      const [message] = useMessage(event);
      const new_msg = event.MessageText;
      const confirm = new_msg === '1';

      if (!confirm) {
        message.send(format(Text('已取消出售')));

        return;
      }
      const usr_qq = event.UserId;
      const najie2 = await getDataJSONParseByKey(keys.najie(usr_qq));

      if (!najie2) {
        message.send(format(Text('数据缺失，出售失败')));

        return;
      }
      let commodities_price = 0;
      const wupin: NajieCategory[] = [
        '装备',
        '丹药',
        '道具',
        '功法',
        '草药',
        '材料',
        '仙宠',
        '仙宠口粮'
      ];

      for (const i of wupin) {
        const list = najie2[i];

        if (!Array.isArray(list)) {
          continue;
        }
        for (const l of list as Array<{
          name: string;
          islockd?: number;
          数量?: number;
          出售价?: number;
          class?: string;
          pinji?: number;
        }>) {
          if (l && (l.islockd ?? 0) == 0) {
            const quantity = typeof l.数量 === 'number' ? l.数量 : 0;
            const price = typeof l.出售价 === 'number' ? l.出售价 : 0;
            const cls = (l.class as NajieCategory) || i;

            await addNajieThing(usr_qq, l.name, cls, -quantity, l.pinji);
            commodities_price += price * quantity;
          }
        }
      }
      await addCoin(usr_qq, commodities_price);
      message.send(format(Text(`出售成功!  获得${commodities_price}灵石 `)));
    },
    ['UserId']
  );
  const timeout = setTimeout(
    () => {
      try {
        subscribe.cancel(sub);
        message.send(format(Text('超时自动取消出售')));
      } catch (e) {
        logger.error('取消订阅失败', e);
      }
    },
    1000 * 60 * 1
  );
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
