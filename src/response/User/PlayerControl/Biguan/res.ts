import { Text, useSend } from 'alemonjs';

// redis 直接操作被 helper 替代
import { getString, userKey } from '@src/model/utils/redisHelper';
import { existplayer } from '@src/model/index';
import {
  readAction,
  isActionRunning,
  startAction,
  normalizeBiguanMinutes
} from '@src/response/actionHelper';

import { selects } from '@src/response/mw';
import { setDataByUserId } from '@src/model/Redis';
export const regular = /^(#|＃|\/)?(闭关$)|(闭关(.*)(分|分钟)$)/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  if (!(await existplayer(usr_qq))) { return false; }
  const game_action = await getString(userKey(usr_qq, 'game_action'));

  // 防止继续其他娱乐行为
  if (game_action === '1') {
    Send(Text('修仙：游戏进行中...'));

    return false;
  }

  // 解析时间并归一化
  const timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '')
    .replace('闭关', '')
    .replace(/[分分钟钟]/g, '')
    .trim();
  const parsed = parseInt(timeStr, 10);
  const time = normalizeBiguanMinutes(Number.isNaN(parsed) ? undefined : parsed);

  // 查询redis中的人物动作
  const action = await readAction(usr_qq);

  if (isActionRunning(action)) {
    const now = Date.now();
    const rest = action!.end_time - now;
    const m = Math.floor(rest / 60000);
    const s = Math.floor((rest - m * 60000) / 1000);

    Send(Text(`正在${action!.action}中,剩余时间:${m}分${s}秒`));

    return false;
  }

  const action_time = time * 60 * 1000; // 持续时间，单位毫秒

  await startAction(usr_qq, '闭关', action_time, {
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
  // 保持 setDataByUserId 兼容写入
  const mirror = await readAction(usr_qq);

  if (mirror) { await setDataByUserId(usr_qq, 'action', JSON.stringify(mirror)); }
  Send(Text(`现在开始闭关${time}分钟,两耳不闻窗外事了`));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
