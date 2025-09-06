import { config } from '@src/model/api';
import { getPlayerAction, getString, readPlayer, userKey } from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { useSend, Text } from 'alemonjs';
import { handleWorkSettlement } from '@src/model/actions/PlayerControlTask';
export const regular = /^(#|＃|\/)?降妖归来$/;

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

  if (action?.working !== undefined && +action.working === 1) {
    void Send(Text('不在降妖'));

    return;
  }

  if (action?.action && action.action === '空闲') {
    void Send(Text('空闲中'));

    return;
  }

  void handleWorkSettlement(userId, action, player, config, {
    callback: (msg: string) => {
      void Send(Text(msg));
    }
  });
});

export default onResponse(selects, [mw.current, res.current]);
