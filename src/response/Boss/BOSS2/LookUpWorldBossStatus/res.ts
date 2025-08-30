import { Text, useSend } from 'alemonjs';
import { existplayer } from '@src/model';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { Boss2IsAlive, InitWorldBoss, LookUpWorldBossStatus } from '../../../../model/boss';
import { KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/keys';
import mw from '@src/response/mw';

const selects = onSelects(['message.create']);

export const regular = /^(#|＃|\/)?金角大王状态$/;

interface WorldBossStatusInfo {
  Health: number;
  Reward: number;
  KilledTime: number;
}

function formatNum(n: any): string {
  const v = Number(n);

  return Number.isFinite(v) ? v.toLocaleString('zh-CN') : '0';
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    void Send(Text('你还未开始修仙'));

    return false;
  }

  if (!(await Boss2IsAlive())) {
    void Send(Text('金角大王未开启！'));

    return false;
  }

  const statusStr = await getDataJSONParseByKey(KEY_WORLD_BOOS_STATUS_TWO);
  const status = statusStr as WorldBossStatusInfo | null;

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

export default onResponse(selects, [mw.current, res.current]);
