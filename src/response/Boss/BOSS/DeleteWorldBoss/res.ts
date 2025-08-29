import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { BossIsAlive } from '../../../../model/boss';
import { KEY_RECORD, KEY_WORLD_BOOS_STATUS } from '@src/model/keys';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?关闭妖王$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (e.IsMaster) {
    if (await BossIsAlive()) {
      await redis.del(KEY_WORLD_BOOS_STATUS);
      await redis.del(KEY_RECORD);
      void Send(Text('妖王挑战关闭！'));
    } else {
      void Send(Text('妖王未开启'));
    }
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
