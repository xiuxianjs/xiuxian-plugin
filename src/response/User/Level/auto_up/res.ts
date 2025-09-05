import { Text, useSend } from 'alemonjs';
import { existplayer, readPlayer } from '@src/model/index';
import { useLevelUp } from '../level';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';

export const regular = /^(#|＃|\/)?自动突破$/;

const timeout: {
  [key: string]: NodeJS.Timeout;
} = {};

const autoBreakthroughStatus: {
  [key: string]: boolean;
} = {};

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const player = await readPlayer(userId);

  if (!player || player.level_id > 31 || player.level_id === 0) {
    return false;
  }

  // 检查是否已经有自动突破在进行中
  if (autoBreakthroughStatus[userId]) {
    void Send(Text('自动突破已在进行中，请勿重复使用'));

    return false;
  }

  // 清除之前的定时器（如果存在）
  if (timeout[userId]) {
    clearTimeout(timeout[userId]);
  }

  void Send(Text('已为你开启10次自动突破'));
  autoBreakthroughStatus[userId] = true;

  let num = 1;

  const performAutoBreakthrough = () => {
    if (num > 10) {
      autoBreakthroughStatus[userId] = false;
      if (timeout[userId]) {
        clearTimeout(timeout[userId]);
      }

      return;
    }

    void useLevelUp(e);
    num++;

    if (num <= 10) {
      timeout[userId] = setTimeout(performAutoBreakthrough, 185000);
    } else {
      autoBreakthroughStatus[userId] = false;
      if (timeout[userId]) {
        clearTimeout(timeout[userId]);
      }
    }
  };

  timeout[userId] = setTimeout(performAutoBreakthrough, 185000);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
