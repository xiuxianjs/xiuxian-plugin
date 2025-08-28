import { Text, useSend } from 'alemonjs';

import { existplayer, readPlayer, addNajieThing, addConFaByUser, keys } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?一键学习$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  // 有无存档
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return false;
  }
  // 检索方法
  const najie = await getDataJSONParseByKey(keys.najie(usr_qq));

  if (!najie) {
    return;
  }
  const player = await readPlayer(usr_qq);
  let name = '';

  for (const l of najie.功法) {
    const islearned = player.学习的功法.find(item => item === l.name);

    if (!islearned) {
      await addNajieThing(usr_qq, l.name, '功法', -1);
      await addConFaByUser(usr_qq, l.name);
      name = name + ' ' + l.name;
    }
  }
  if (name) {
    void Send(Text(`你学会了${name},可以在【#我的炼体】中查看`));
  } else {
    void Send(Text('无新功法'));
  }
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
