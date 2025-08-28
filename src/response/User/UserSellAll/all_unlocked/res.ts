import { Text, useSend } from 'alemonjs';

import { existplayer, keys, writeNajie } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?一键解锁(.*)$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 有无存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const najie = await getDataJSONParseByKey(keys.najie(userId));

  if (!najie) {
    return;
  }
  let wupin = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
  const wupin1 = [];

  if (e.MessageText !== '#一键解锁') {
    let thing = e.MessageText.replace(/^(#|＃|\/)?一键解锁/, '');

    for (const i of wupin) {
      if (thing === i) {
        wupin1.push(i);
        thing = thing.replace(i, '');
      }
    }
    if (thing.length === 0) {
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
      l.islockd = 0;
    }
  }
  await writeNajie(userId, najie);
  void Send(Text('一键解锁完成'));
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
