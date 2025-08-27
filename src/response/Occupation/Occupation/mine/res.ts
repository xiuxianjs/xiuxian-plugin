import { Text, useSend } from 'alemonjs';

import { existplayer, readPlayer, addCoin } from '@src/model/index';
import {
  readAction,
  isActionRunning,
  startAction,
  normalizeDurationMinutes,
  remainingMs,
  formatRemaining
} from '@src/model/actionHelper';
import { setValue, userKey, getString } from '@src/model/utils/redisHelper';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?(采矿$)|(采矿(.*)(分|分钟)$)/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId; // 用户qq

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
  const player = await readPlayer(usr_qq);

  if (player.occupation != '采矿师') {
    Send(Text('你挖矿许可证呢？非法挖矿，罚款200灵石'));
    await addCoin(usr_qq, -200);

    return false;
  }
  // 获取时间
  const timeRaw = e.MessageText.replace(/^(#|＃|\/)?采矿/, '').replace('分钟', '');
  const time = normalizeDurationMinutes(timeRaw, 30, 24, 30);
  // 查询redis中的人物动作
  const current = await readAction(usr_qq);

  if (isActionRunning(current)) {
    Send(Text(`正在${current?.action}中，剩余时间:${formatRemaining(remainingMs(current))}`));

    return false;
  }

  const action_time = time * 60 * 1000;
  const arr = await startAction(usr_qq, '采矿', action_time, {
    plant: '1',
    mine: '0',
    shutup: '1',
    working: '1',
    Place_action: '1',
    Place_actionplus: '1',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  });

  await setValue(userKey(usr_qq, 'action'), arr);
  Send(Text(`现在开始采矿${time}分钟`));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
