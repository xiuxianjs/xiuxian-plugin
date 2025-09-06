import { getConfig, getPlayerAction, getString, readPlayer, userKey } from '@src/model/index';
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

  // 没有动作
  if (!action) {
    void Send(Text('空闲中'));

    return;
  }

  // action === '空闲' 表示空闲
  if (action?.action && action.action === '空闲') {
    void Send(Text('空闲中'));

    return;
  }

  // working !== 0 表示不在降妖
  if (action?.working !== undefined && +action.working !== 0) {
    void Send(Text('不在降妖'));

    return;
  }

  const config = await getConfig('', 'xiuxian');

  // 计算实际降妖时间
  const now = Date.now();
  const startTime = action.end_time - action.time;
  const actualWorkTime = now - startTime;
  const minWorkTime = 5 * 60 * 1000; // 5分钟

  // 检查是否达到最小降妖时间
  if (actualWorkTime < minWorkTime) {
    const remainingTime = Math.ceil((minWorkTime - actualWorkTime) / 60000);

    void Send(Text(`降妖时间不足，需要至少降妖5分钟才能获得收益。还需降妖${remainingTime}分钟。`));

    return;
  }

  void handleWorkSettlement(userId, action, player, config, {
    callback: (msg: string) => {
      void Send(Text(msg));
    }
  });
});

export default onResponse(selects, [mw.current, res.current]);
