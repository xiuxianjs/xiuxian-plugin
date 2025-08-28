import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { readPlayer, existplayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getRedisKey } from '@src/model/keys';
export const regular = /^(#|＃|\/)?允许双修$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据读取失败'));

    return false;
  }
  void redis.set(getRedisKey(userId, 'couple'), 0);
  void Send(Text(`${player.名号}开启了允许模式`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
