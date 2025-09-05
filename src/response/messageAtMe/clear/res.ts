import { existplayer, keys } from '@src/model';
import mw, { selects } from '../../mw';
import { getIoRedis } from '@alemonjs/db';
import { Text, useMessage } from 'alemonjs';

export const regular = /^(#|＃|\/)?清理消息/;

const res = onResponse(selects, async e => {
  const userId = e.UserId;
  // 查看存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }

  const [message] = useMessage(e);

  if (!message) {
    return;
  }

  const redis = getIoRedis();

  const id = String(e.UserId);

  void redis.del(keys.proactiveMessageLog(id));

  void message.send(format(Text('消息记录已清理')));
});

export default onResponse(selects, [mw.current, res.current]);
