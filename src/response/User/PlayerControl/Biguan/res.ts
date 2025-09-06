import { Text, useSend } from 'alemonjs';
import { getString, userKey } from '@src/model/utils/redisHelper';
import { existplayer, getPlayerAction } from '@src/model/index';
import { isActionRunning, startAction, normalizeBiguanMinutes } from '@src/model/actionHelper';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?(闭关$)|(闭关(.*)(分|分钟)$)/;

const res = onResponse(selects, async e => {
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
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

  // 有动作
  if (isActionRunning(action)) {
    const now = Date.now();
    const rest = action.end_time - now;
    const m = Math.floor(rest / 60000);
    const s = Math.floor((rest - m * 60000) / 1000);

    void Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`));

    return false;
  }

  // shutup === 0 表示在闭关
  if (action?.shutup !== undefined && +action.shutup === 0) {
    void Send(Text('已经在闭关'));

    return;
  }

  // action !== '空闲' 表示不空闲
  if (action?.action && action.action !== '空闲') {
    void Send(Text('不空闲'));

    return;
  }

  // 解析时间并归一化
  const timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '')
    .replace('闭关', '')
    .replace(/[分分钟钟]/g, '')
    .trim();
  const parsed = parseInt(timeStr, 10);
  const time = normalizeBiguanMinutes(Number.isNaN(parsed) ? undefined : parsed);

  const actionTime = time * 60 * 1000; // 持续时间，单位毫秒

  await startAction(userId, '闭关', actionTime, {
    plant: '1',
    shutup: '0',
    working: '1',
    Place_action: '1',
    Place_actionplus: '1',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    mine: '1'
  });

  void Send(Text(`现在开始闭关${time}分钟,两耳不闻窗外事了`));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
