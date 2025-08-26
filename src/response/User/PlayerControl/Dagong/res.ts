import { Text, useSend } from 'alemonjs';

// 直接 redis.get 改为 helper
import { existplayer, readPlayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import { setDataByUserId } from '@src/model/Redis';
import { getString, userKey } from '@src/model/utils/redisHelper';
import {
  readAction,
  isActionRunning,
  startAction,
  normalizeDurationMinutes,
  remainingMs,
  formatRemaining
} from '@src/model/actionHelper';
export const regular = /^(#|＃|\/)?(降妖$)|(降妖(.*)(分|分钟)$)/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(usr_qq))) {
    return false;
  }
  // 获取游戏状态
  const game_action = await getString(userKey(usr_qq, 'game_action'));

  // 防止继续其他娱乐行为
  if (game_action === '1') {
    Send(Text('修仙：游戏进行中...'));

    return false;
  }
  // 获取时间
  let timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '');

  timeStr = timeStr.replace('降妖', '').replace('分', '').replace('钟', '');
  const time = normalizeDurationMinutes(timeStr, 15, 48, 15);

  const player = await readPlayer(usr_qq);

  if (player.当前血量 < 200) {
    Send(Text('你都伤成这样了,先去疗伤吧'));

    return false;
  }
  // 查询redis中的人物动作

  const current = await readAction(usr_qq);

  if (isActionRunning(current)) {
    Send(Text(`正在${current?.action}中,剩余时间:${formatRemaining(remainingMs(current))}`));

    return false;
  }
  const action_time = time * 60 * 1000;
  const arr = await startAction(usr_qq, '降妖', action_time, {
    plant: '1',
    shutup: '1',
    working: '0',
    Place_action: '1',
    Place_actionplus: '1',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    mine: '1'
  });

  await setDataByUserId(usr_qq, 'action', JSON.stringify(arr));
  Send(Text(`现在开始降妖${time}分钟`));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
