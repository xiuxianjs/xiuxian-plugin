import { Text, useSend } from 'alemonjs';

import { data } from '@src/model/api';
import { existplayer, writeNajie } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?一键锁定(.*)$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  // 有无存档
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return false;
  }
  const najie = await await data.getData('najie', usr_qq);
  let wupin = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
  const wupin1 = [];

  if (e.MessageText != '#一键锁定') {
    let thing = e.MessageText.replace(/^(#|＃|\/)?一键锁定/, '');

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
  }
  for (const i of wupin) {
    const list = najie[i];

    if (!Array.isArray(list)) {
      continue;
    }
    for (const l of najie[i]) {
      // 纳戒中的数量
      l.islockd = 1;
    }
  }
  await writeNajie(usr_qq, najie);
  Send(Text('一键锁定完成'));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
