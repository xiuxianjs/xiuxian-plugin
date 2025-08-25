import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { BossIsAlive, InitWorldBoss, LookUpWorldBossStatus } from '../../../../model/boss';
import { KEY_WORLD_BOOS_STATUS } from '@src/model/constants';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?妖王状态$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  if (await BossIsAlive()) {
    const WorldBossStatusStr = await redis.get(KEY_WORLD_BOOS_STATUS);
    if (WorldBossStatusStr) {
      const WorldBossStatus = JSON.parse(WorldBossStatusStr);
      if (Date.now() - WorldBossStatus.KilledTime < 86400000) {
        Send(Text('妖王正在刷新,21点开启'));
        return false;
      } else if (WorldBossStatus.KilledTime != -1) {
        if ((await InitWorldBoss()) == false) await LookUpWorldBossStatus(e);
        return false;
      }
      const ReplyMsg = [
        `----妖王状态----\n攻击:????????????\n防御:????????????\n血量:${WorldBossStatus.Health}\n奖励:${WorldBossStatus.Reward}`
      ];
      Send(Text(ReplyMsg.join('\n')));
    }
  } else Send(Text('妖王未开启！'));
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
