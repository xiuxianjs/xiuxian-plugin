import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { Boss2IsAlive, InitWorldBoss, LookUpWorldBossStatus } from '../../../../model/boss';
import { existplayer } from '@src/model';
import { KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/keys';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?金角大王状态$/;

interface WorldBossStatusInfo {
  Health: number;
  Reward: number;
  KilledTime: number;
}
function parseJson<T>(raw, fallback: T): T {
  if (typeof raw !== 'string' || raw === '') {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function formatNum(n) {
  const v = Number(n);

  return Number.isFinite(v) ? v.toLocaleString('zh-CN') : '0';
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  if (!(await Boss2IsAlive())) {
    void Send(Text('金角大王未开启！'));

    return false;
  }

  const statusStr = await redis.get(KEY_WORLD_BOOS_STATUS_TWO);
  const status = parseJson<WorldBossStatusInfo | null>(statusStr, null);

  if (!status) {
    void Send(Text('状态数据缺失，请联系管理员重新开启！'));

    return false;
  }

  const now = Date.now();

  // 24h 内为刷新冷却期
  if (now - status.KilledTime < 86400000) {
    void Send(Text('金角大王正在刷新,20点开启'));

    return false;
  }
  // 如果已被击杀但冷却结束需要初始化
  if (status.KilledTime !== -1) {
    if ((await InitWorldBoss()) === false) {
      await LookUpWorldBossStatus(e);
    }

    return false;
  }

  const reply = `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${formatNum(status.Health)}\n奖励:${formatNum(status.Reward)}`;

  void Send(Text(reply));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
