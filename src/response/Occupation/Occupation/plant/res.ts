import { Text, useSend } from 'alemonjs';

import { existplayer, readPlayer } from '@src/model/index';
import {
  readAction,
  isActionRunning,
  startAction,
  normalizeDurationMinutes,
  remainingMs,
  formatRemaining
} from '@src/model/actionHelper';
import { setValue, userKey } from '@src/model/utils/redisHelper';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?(采药$)|(采药(.*)(分|分钟)$)/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId; // 用户qq

  if (!(await existplayer(usr_qq))) {
    return false;
  }
  // 不开放私聊

  // 获取游戏状态
  const game_action = await getGameFlag(usr_qq);

  // 防止继续其他娱乐行为
  if (+game_action == 1) {
    Send(Text('修仙：游戏进行中...'));

    return false;
  }
  const player = await readPlayer(usr_qq);

  if (player.occupation != '采药师') {
    Send(Text('您采药，您配吗?'));

    return false;
  }
  // 获取时间
  const timeRaw = e.MessageText.replace(/^(#|＃|\/)?采药/, '').replace('分钟', '');
  const time = normalizeDurationMinutes(timeRaw, 15, 48, 30);

  // 查询redis中的人物动作
  const current = await readAction(usr_qq);

  if (isActionRunning(current)) {
    Send(Text(`正在${current?.action}中，剩余时间:${formatRemaining(remainingMs(current))}`));

    return false;
  }

  const action_time = time * 60 * 1000;
  const arr = await startAction(usr_qq, '采药', action_time, {
    plant: '0',
    shutup: '1',
    working: '1',
    Place_action: '1',
    Place_actionplus: '1',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    mine: '1',
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  });

  await setValue(userKey(usr_qq, 'action'), arr);
  Send(Text(`现在开始采药${time}分钟`));
});

export default onResponse(selects, [mw.current, res.current]);

// 兼容读取 game_action 标志（保持旧 key）
async function getGameFlag(userId: string | number) {
  return await import('@src/model/utils/redisHelper').then(m =>
    m.getString(userKey(userId, 'game_action'))
  );
}
