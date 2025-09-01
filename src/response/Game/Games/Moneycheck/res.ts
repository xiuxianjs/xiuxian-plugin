import { getRedisKey } from '@src/model/keys';
import { Text, useMessage } from 'alemonjs';
import { redis } from '@src/model/api';
import { compulsoryToNumber, readPlayer } from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?(取消)?(梭哈|投入)(\d+)?$/;
import { game } from '../game';

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);

  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    // 不是就返回
    return false;
  }
  //
  const gameAction = await redis.get(getRedisKey(userId, 'game_action'));

  if (!gameAction || +gameAction !== 1) {
    //
    return false;
  }

  const onCencel = async () => {
    // 重新记录本次时间
    await redis.set(getRedisKey(userId, 'last_game_time'), Date.now()); // 存入缓存
    // 清除游戏状态
    await redis.del(getRedisKey(userId, 'game_action'));
    // 清除金额
    game.yazhu[userId] = 0;
  };

  if (/取消/.test(e.MessageText)) {
    void onCencel();
    void message.send(format(Text('媚娘：某人看来是玩不起')));

    return;
  }

  // 梭哈|投入999。如果是投入。就留下999
  const num = e.MessageText.replace(/#|＃|\/|取消|梭哈|投入/g, '');

  // 这里限制一下，至少押1w
  const money = 10000;

  // 梭哈，全部灵石
  if (e.MessageText.includes('梭哈')) {
    if (player.灵石 < money) {
      void message.send(format(Text('媚娘：灵石不足1w，无法梭哈\n>取消请发送【取消梭哈】或【取消投入】')));

      return;
    }

    // 得到投入金额
    game.yazhu[userId] = -1;
    game.game_key_user[userId] = true;

    void message.send(format(Text('媚娘：梭哈完成,发送[大|小|1-6]')));

    return false;
  }

  const size = compulsoryToNumber(num);

  if (size < money) {
    void message.send(format(Text(`媚娘：最低押注${money}灵石\n>取消请发送【取消梭哈】或【取消投入】`)));

    return false;
  }

  if (player.灵石 < size) {
    void onCencel();
    void message.send(format(Text('媚娘：你没那么多灵石')));

    return false;
  }

  // 得到投入数
  game.yazhu[userId] = size;
  game.game_key_user[userId] = true;

  // 发送提示信息
  void message.send(format(Text('媚娘：投入完成,发送[大|小|1-6]')));
});

export default onResponse(selects, [mw.current, res.current]);
