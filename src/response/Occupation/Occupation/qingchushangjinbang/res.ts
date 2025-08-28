import { getRedisKey } from '@src/model/keys';
import { Text, useSend } from 'alemonjs';

import { existplayer } from '@src/model/index';
import { redis } from '@src/model/api';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?清空赏金榜$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return false;
  }
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  let action = await redis.get(getRedisKey('1', 'shangjing'));

  action = await JSON.parse(action);
  action = null;
  void Send(Text('清除完成'));
  await redis.set(getRedisKey('1', 'shangjing'), JSON.stringify(action));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
