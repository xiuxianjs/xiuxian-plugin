import { Text, useSend } from 'alemonjs';

import { readPlayer } from '@src/model/index';
import { useLevelUp } from '../Level/level';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?自动突破$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  if (player.level_id > 31 || player.lunhui === 0) {
    return;
  }

  void Send(Text('已为你开启10次自动突破'));

  let num = 1;

  const autoUp = async () => {
    await useLevelUp(e);
    num++;
    if (num > 10) {
      setTimeout(
        () => {
          void autoUp();
        },
        1000 * 60 * 1
      );
    }
  };

  setTimeout(
    () => {
      void autoUp();
    },
    1000 * 60 * 1
  );

  //
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
