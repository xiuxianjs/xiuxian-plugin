import { getString, userKey } from '@src/model/utils/redisHelper';
import { getConfig, getPlayerAction, readPlayer } from '@src/model/index';
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

  // 没有动作
  if (!action) {
    // 没有动作
    void Send(Text('空闲中'));

    return;
  }

  // action === '空闲' 表示空闲
  if (action?.action && action.action === '空闲') {
    void Send(Text('空闲中'));

    return;
  }

  // shutup !== 0 表示不在闭关
  if (action?.shutup !== undefined && +action.shutup !== 0) {
    void Send(Text('不在闭关'));

    return;
  }

  const config = await getConfig('', 'xiuxian');

  // 计算实际闭关时间
  const now = Date.now();
  const startTime = action.end_time - action.time;
  const actualCultivationTime = now - startTime;
  const minCultivationTime = 10 * 60 * 1000; // 10分钟

  // 检查是否达到最小闭关时间
  if (actualCultivationTime < minCultivationTime) {
    const remainingTime = Math.ceil((minCultivationTime - actualCultivationTime) / 60000);

    void Send(Text(`闭关时间不足，需要至少闭关10分钟才能获得收益。还需闭关${remainingTime}分钟。`));

    return;
  }

  void handleCultivationSettlement(userId, action, player, config, {
    callback: (msg: string) => {
      void Send(Text(msg));
    }
  });
});

export default onResponse(selects, [mw.current, res.current]);
