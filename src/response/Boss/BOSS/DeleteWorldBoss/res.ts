import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { KEY_RECORD, KEY_WORLD_BOOS_STATUS } from '@src/model/keys';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?关闭妖王$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (e.IsMaster) {
    await redis.del(KEY_WORLD_BOOS_STATUS);
    await redis.del(KEY_RECORD);
    void Send(Text('妖王挑战关闭！'));
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
