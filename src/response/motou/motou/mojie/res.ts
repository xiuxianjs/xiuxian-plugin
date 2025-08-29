import { Text, useSend } from 'alemonjs';

import { existplayer, readPlayer, writePlayer } from '@src/model/index';
import { readAction, isActionRunning, startAction, remainingMs, formatRemaining } from '@src/model/actionHelper';
import { getString, userKey, setValue } from '@src/model/utils/redisHelper';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?堕入魔界$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 查看存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const game_action = await getString(userKey(userId, 'game_action'));

  // 防止继续其他娱乐行为
  if (game_action === '1') {
    void Send(Text('修仙：游戏进行中...'));

    return false;
  }
  // 查询redis中的人物动作
  const current = await readAction(userId);

  if (isActionRunning(current)) {
    void Send(Text(`正在${current?.action}中,剩余时间:${formatRemaining(remainingMs(current))}`));

    return false;
  }
  const player = await readPlayer(userId);

  if (player.魔道值 < 1000) {
    void Send(Text('你不是魔头'));

    return false;
  }
  if (player.修为 < 4000000) {
    void Send(Text('修为不足'));

    return false;
  }
  player.魔道值 -= 100;
  player.修为 -= 4000000;
  await writePlayer(userId, player);
  const time = 60;
  const action_time = time * 60 * 1000;
  const arr = await startAction(userId, '魔界', action_time, {
    shutup: '1',
    working: '1',
    Place_action: '1',
    mojie: '0',
    Place_actionplus: '1',
    power_up: '1',
    xijie: '1',
    plant: '1',
    mine: '1',
    cishu: 10,
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  });

  await setValue(userKey(userId, 'action'), arr);
  void Send(Text(`开始进入魔界,${time}分钟后归来!`));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
