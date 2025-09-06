import { config } from '@src/model/api';
import { getString, userKey } from '@src/model/utils/redisHelper';
import { getPlayerAction, readPlayer } from '@src/model/index';
import mw from '@src/response/mw';
import { selects } from '@src/response/mw';
import { Text, useSend } from 'alemonjs';
import { handleCultivationSettlement } from '@src/model/actions/PlayerControlTask';
export const regular = /^(#|＃|\/)?出关$/;

const res = onResponse(selects, async e => {
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  const Send = useSend(e);
  const gameAction = await getString(userKey(userId, 'game_action'));

  // 防止继续其他娱乐行为
  if (gameAction && +gameAction === 1) {
    void Send(Text('修仙：游戏进行中...'));

    return false;
  }

  const action = await getPlayerAction(e.UserId);

  if (!action) {
    // 没有动作
    void Send(Text('空闲中'));

    return;
  }
  if (action?.shutup !== undefined && +action.shutup === 1) {
    void Send(Text('不空闲'));

    return;
  }

  if (action?.action && action.action === '空闲') {
    void Send(Text('空闲中'));

    return;
  }

  void handleCultivationSettlement(userId, action, player, config, {
    callback: (msg: string) => {
      void Send(Text(msg));
    }
  });
});

export default onResponse(selects, [mw.current, res.current]);
