import { Text, useSend } from 'alemonjs';

import { data } from '@src/model/api';
import { existplayer, readPlayer, addNajieThing, addConFaByUser } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?一键学习$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  //有无存档
  const ifexistplay = await existplayer(usr_qq);
  if (!ifexistplay) return false;
  //检索方法
  const najie = await await data.getData('najie', usr_qq);
  const player = await readPlayer(usr_qq);
  let name = '';
  for (const l of najie.功法) {
    const islearned = player.学习的功法.find(item => item == l.name);
    if (!islearned) {
      await addNajieThing(usr_qq, l.name, '功法', -1);
      await addConFaByUser(usr_qq, l.name);
      name = name + ' ' + l.name;
    }
  }
  if (name) {
    Send(Text(`你学会了${name},可以在【#我的炼体】中查看`));
  } else {
    Send(Text('无新功法'));
  }
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
