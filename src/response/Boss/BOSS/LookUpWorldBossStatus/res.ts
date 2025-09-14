import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { bossStatus, isBossWord } from '../../../../model/boss';
import { KEY_WORLD_BOOS_STATUS } from '@src/model/keys';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?妖王状态$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!(await isBossWord())) {
    void Send(Text('妖王未刷新'));

    return;
  }

  const bossStatusResult = await bossStatus('1');

  if (bossStatusResult === 'dead') {
    void Send(Text('妖王已经被击败了，请等待下次刷新'));

    return;
  } else if (bossStatusResult === 'initializing') {
    void Send(Text('妖王正在初始化，请稍后'));

    return;
  }

  const WorldBossStatusStr = await redis.get(KEY_WORLD_BOOS_STATUS);

  if (WorldBossStatusStr) {
    const WorldBossStatus = JSON.parse(WorldBossStatusStr);
    const ReplyMsg = [`----妖王状态----\n攻击:????????????\n防御:????????????\n血量:${WorldBossStatus.Health}\n奖励:${WorldBossStatus.Reward}`];

    void Send(Text(ReplyMsg.join('\n')));
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
