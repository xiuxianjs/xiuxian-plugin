import { Text, useSend } from 'alemonjs';
// 直接引用底层模块，避免通过聚合 xiuxian.ts 引起的 chunk 循环
import { readExchange, writeExchange } from '@src/model/trade';
import { addNajieThing } from '@src/model/najie';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?清除冲水堂$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return;
  }

  const Exchange = await readExchange();

  void Promise.all(
    Exchange.map(i => {
      const userId = i.qq;
      let thing = i.thing.name;
      const quanity = i.aconut;

      if (i.thing.class === '装备' || i.thing.class === '仙宠') {
        thing = i.thing;
      }

      return addNajieThing(userId, thing, i.thing.class, quanity, i.thing.pinji);
    })
  ).finally(() => {
    void writeExchange([]);
    void Send(Text('清除完成！'));
  });
});

export default onResponse(selects, [mw.current, res.current]);
