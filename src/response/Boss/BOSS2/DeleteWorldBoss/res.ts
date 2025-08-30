import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { selects } from '@src/response/mw';
import { KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/keys';
export const regular = /^(#|＃|\/)?关闭金角大王$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (e.IsMaster) {
    await redis.del(KEY_WORLD_BOOS_STATUS_TWO);
    await redis.del(KEY_RECORD_TWO);
    void Send(Text('金角大王挑战关闭！'));
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
