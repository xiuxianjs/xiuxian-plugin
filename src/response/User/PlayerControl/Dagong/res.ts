import { Text, useSend } from 'alemonjs';
import { getPlayerAction, readPlayer } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import { getString, userKey } from '@src/model/utils/redisHelper';
import { isActionRunning, startAction, normalizeDurationMinutes } from '@src/model/actionHelper';

export const regular = /^(#|＃|\/)?(降妖$)|(降妖(.*)(分|分钟)$)/;

const res = onResponse(selects, async e => {
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  const Send = useSend(e);

  if (player.当前血量 < 200) {
    void Send(Text('你都伤成这样了,先去疗伤吧'));

    return false;
  }

  const gameAction = await getString(userKey(userId, 'game_action'));

  // 游戏状态
  if (gameAction && +gameAction === 1) {
    void Send(Text('修仙：游戏进行中...'));

    return false;
  }

  const action = await getPlayerAction(e.UserId);

  // 有其他动作
  if (isActionRunning(action)) {
    const now = Date.now();
    const rest = action.end_time - now;
    const m = Math.floor(rest / 60000);
    const s = Math.floor((rest - m * 60000) / 1000);

    void Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`));

    return false;
  }

  // working === 0 表示在降妖
  if (action?.working !== undefined && +action.working === 0) {
    void Send(Text('已经在降妖'));

    return;
  }

  // action !== '空闲' 表示不空闲
  if (action?.action && action.action !== '空闲') {
    void Send(Text('不空闲'));

    return;
  }

  // 获取时间
  let timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '');

  timeStr = timeStr.replace('降妖', '').replace('分', '').replace('钟', '');
  const time = normalizeDurationMinutes(timeStr, 15, 48, 15);
  const actionTime = time * 60 * 1000;

  await startAction(userId, '降妖', actionTime, {
    plant: '1',
    shutup: '1',
    working: '0', // 降妖
    Place_action: '1',
    Place_actionplus: '1',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    mine: '1'
  });

  void Send(Text(`现在开始降妖${time}分钟`));
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
