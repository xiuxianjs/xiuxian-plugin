import { Text, useSend } from 'alemonjs';

import { existplayer, existNajieThing, addNajieThing, addCoin, keys } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export const regular = /^(#|＃|\/)?打开钱包$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return;
  }
  const thingName = '水脚脚的钱包';
  // x是纳戒内有的数量
  const acount = await existNajieThing(userId, thingName, '装备');

  // 没有
  if (!acount) {
    void Send(Text(`你没有[${thingName}]这样的装备`));

    return false;
  }
  // 扣掉装备
  await addNajieThing(userId, thingName, '装备', -1);
  // 获得随机
  const x = 0.4;
  const random1 = Math.random();
  const y = 0.3;
  const random2 = Math.random();
  const z = 0.2;
  const random3 = Math.random();
  const p = 0.1;
  const random4 = Math.random();
  let m = '';
  let lingshi = 0;

  // 获得灵石
  if (random1 < x) {
    if (random2 < y) {
      if (random3 < z) {
        if (random4 < p) {
          lingshi = 2000000;
          m = player.名号 + '打开了[' + thingName + ']金光一现！' + lingshi + '颗灵石！';
        } else {
          lingshi = 1000000;
          m = player.名号 + '打开了[' + thingName + ']金光一现!' + lingshi + '颗灵石！';
        }
      } else {
        lingshi = 400000;
        m = player.名号 + '打开了[' + thingName + ']你很开心的得到了' + lingshi + '颗灵石！';
      }
    } else {
      lingshi = 180000;
      m = player.名号 + '打开了[' + thingName + ']你很开心的得到了' + lingshi + '颗灵石！';
    }
  } else {
    lingshi = 100000;
    m = player.名号 + '打开了[' + thingName + ']你很开心的得到了' + lingshi + '颗灵石！';
  }
  await addCoin(userId, lingshi);
  void Send(Text(m));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
