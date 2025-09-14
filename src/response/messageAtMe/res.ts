import { existplayer, keys } from '@src/model';
import mw, { selects } from '../mw-captcha';
import { getIoRedis } from '@alemonjs/db';
import { Image, Text, useMessage } from 'alemonjs';
import { screenshot } from '@src/image';

export const regular = /^(#|＃|\/)?我的消息/;

const res = onResponse(selects, async e => {
  const userId = e.UserId;
  // 查看存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }

  const redis = getIoRedis();

  const id = String(e.UserId);
  const [message] = useMessage(e);

  // 取最近的5条
  void redis.lrange(keys.proactiveMessageLog(id), 0, 5).then(async list => {
    if (!list || list.length === 0) {
      void message.send(format(Text('暂无消息')));

      return;
    }

    const messages = list
      .map(v => {
        try {
          return JSON.parse(v);
        } catch {
          return null;
        }
      })
      // 解析失败的过滤掉
      .filter(v => !!v)
      // 只保留有消息的
      .filter(v => Array.isArray(v.message) && v.message.length > 0)
      // 按时间倒序
      .sort((a, b) => b.timestamp - a.timestamp);

    if (messages.length === 0) {
      void message.send(format(Text('暂无消息')));

      return;
    }

    const img = await screenshot('MessageBox', id, {
      message: messages.map(v => {
        return {
          UserId: id,
          CreateAt: v.timestamp,
          data: v.message
        };
      }),
      UserId: id
    });

    if (!Buffer.isBuffer(img)) {
      void message.send(format(Text('消息渲染失败')));

      return;
    }

    void message.send(format(Image(img)));
  });
});

export default onResponse(selects, [mw.current, res.current]);
