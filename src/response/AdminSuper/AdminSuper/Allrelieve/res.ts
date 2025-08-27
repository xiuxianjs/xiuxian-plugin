import { Text, useSend } from 'alemonjs';
import { redis } from '@src/model/api';
import { stopAction, readAction } from '@src/model/actionHelper';
import { userKey } from '@src/model/utils/redisHelper';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { __PATH, keysByPath } from '@src/model/index';
export const regular = /^(#|＃|\/)?解除所有$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return;
  }
  Send(Text('开始行动！'));
  const playerList = await keysByPath(__PATH.player_path);

  for (const player_id of playerList) {
    // 清除游戏状态
    await redis.del(userKey(player_id, 'game_action'));
    const action = await readAction(player_id);

    if (action) {
      await stopAction(player_id, {
        is_jiesuan: 1,
        shutup: '1',
        working: '1',
        power_up: '1',
        Place_action: '1',
        Place_actionplus: '1'
      });
    }
  }
  Send(Text('行动结束！'));
});

export default onResponse(selects, [mw.current, res.current]);
