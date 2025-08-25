import { Image, Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { existplayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import { screenshot } from '@src/image';
import { getRedisKey } from '@src/model/keys';
export const regular = /^(#|＃|\/)?赏金榜$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return false;
  }
  // todo
  let action = await redis.get(getRedisKey('1', 'shangjing'));

  action = await JSON.parse(action);
  if (action == null) {
    Send(Text('悬赏已经被抢空了')); // 没人被悬赏

    return false;
  }
  for (let i = 0; i < action.length - 1; i++) {
    let count = 0;

    for (let j = 0; j < action.length - i - 1; j++) {
      if (action[j].赏金 < action[j + 1].赏金) {
        const t = action[j];

        action[j] = action[j + 1];
        action[j + 1] = t;
        count = 1;
      }
    }
    if (count == 0) {
      break;
    }
  }
  // tudo
  await redis.set(getRedisKey('1', 'shangjing'), JSON.stringify(action));
  const type = 1;
  const msg_data = { msg: action, type };

  const img = await screenshot('msg', e.UserId, msg_data);

  if (Buffer.isBuffer(img)) {
    Send(Image(img));
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
