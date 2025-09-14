import { Text, useSend, useMention } from 'alemonjs';

import { readPlayer, writePlayer } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
export const regular = /^(#|\/)打落凡间.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return;
  }
  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    return;
  }

  const qq = target.UserId;

  const player = await readPlayer(qq);

  if (!player) {
    void Send(Text('对方未踏入仙途'));

    return;
  }

  player.power_place = 1;
  void writePlayer(qq, player);

  void Send(Text('已打落凡间！'));
});

export default onResponse(selects, [mw.current, res.current]);
