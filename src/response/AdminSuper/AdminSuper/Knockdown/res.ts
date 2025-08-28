import { Text, useSend, useMention } from 'alemonjs';

import { readPlayer, writePlayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|\/)打落凡间.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  {
    if (!e.IsMaster) {
      return false;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;

    if (!target || res.code !== 2000) {
      return false;
    }
    // 对方qq
    const qq = target.UserId;

    const player = await readPlayer(qq);

    if (!player) {
      void Send(Text('没存档你打个锤子！'));

      return false;
    }

    player.power_place = 1;
    void Send(Text('已打落凡间！'));
    await writePlayer(qq, player);

    return false;
  }
});

export default onResponse(selects, [mw.current, res.current]);
