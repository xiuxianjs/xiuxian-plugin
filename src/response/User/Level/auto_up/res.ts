import { Text, useSend } from 'alemonjs';

import { existplayer, readPlayer } from '@src/model/index';
import { Level_up } from '../level';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?自动突破$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const player = await readPlayer(userId);

  if (player.level_id > 31 || player.level_id === 0) {
    return false;
  }
  void Send(Text('已为你开启10次自动突破'));
  let num = 1;
  const time = setInterval(() => {
    Level_up(e);
    num++;
    if (num > 10) {
      clearInterval(time);
    }
  }, 185000);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
