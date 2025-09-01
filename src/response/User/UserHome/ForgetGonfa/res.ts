import { Text, useMessage, useSubscribe } from 'alemonjs';
import { readPlayer, writePlayer, playerEfficiency } from '@src/model';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';

export const regular = /^(#|＃|\/)?忘掉/;

const res = onResponse(selects, async e => {
  const userId = e.UserId;
  const [message] = useMessage(e);

  // 获取玩家信息
  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  // 提取消息内容
  const goodsName = e.MessageText.replace(/^(#|＃|\/)?忘掉/, '').trim();

  if (!goodsName) {
    return;
  }

  // 仅限中文、英文、数字。
  if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(goodsName)) {
    void message.send(format(Text('非法功法名')));

    return;
  }

  const islearned = player.学习的功法.find(item => item === goodsName);

  if (!islearned) {
    void message.send(format(Text('你还没有学过该功法')));

    return false;
  }

  void message.send(format(Text(`你确定要忘掉${goodsName}吗？\n忘掉后的功法将彻底丢失，回复“确认”以继续，回复任意字以取消`)));

  const [subscribe] = useSubscribe(e, selects);

  let timeout: NodeJS.Timeout | null = null;

  // 订阅确认消息
  const sub = subscribe.mount(
    async event => {
      if (timeout) {
        clearTimeout(timeout);
      }
      const userId = event.UserId;
      const [message] = useMessage(event);

      if (/^(#|＃|\/)?确认/.test(event.MessageText)) {
        // 获取玩家信息
        const player = await readPlayer(userId);

        if (!player) {
          return;
        }
        const islearned = player.学习的功法.find(item => item === goodsName);

        if (!islearned) {
          void message.send(format(Text('你还没有学过该功法')));

          return false;
        }
        // 确认上下文。
        player.学习的功法 = player.学习的功法.filter(item => item !== goodsName);
        await writePlayer(userId, player);
        void playerEfficiency(userId);
        void message.send(format(Text(`你忘掉了${goodsName}`)));
      } else {
        void message.send(format(Text('已取消操作')));
      }
    },
    ['UserId']
  );

  timeout = setTimeout(
    () => {
      try {
        subscribe.cancel(sub);
        void message.send(format(Text('已取消操作')));
      } catch (e) {
        logger.error('取消订阅失败', e);
      }
    },
    1000 * 60 * 1
  );

  //
});

export default onResponse(selects, [mw.current, res.current]);
