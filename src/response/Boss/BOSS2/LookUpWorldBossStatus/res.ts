import { Text, useSend } from 'alemonjs';
import { bossStatus, existplayer, InitWorldBoss, InitWorldBoss2, isBossWord2 } from '@src/model';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/keys';
import mw from '@src/response/mw';

const selects = onSelects(['message.create']);

export const regular = /^(#|＃|\/)?金角大王状态$/;

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

  if (!(await isBossWord2())) {
    void Send(Text('金角大王未刷新'));

    return;
  }

  const initStatus = await bossStatus('2');

  if (!initStatus) {
    void Send(Text('金角大王正在初始化，请稍后'));

    return;
  }

  const statusStr = await getDataJSONParseByKey(KEY_WORLD_BOOS_STATUS_TWO);

  if (!statusStr) {
    void InitWorldBoss2();

    void Send(Text('状态数据缺失，开始重新初始化！'));

    return false;
  }

  const reply = `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${formatNum(statusStr.Health)}\n奖励:${formatNum(statusStr.Reward)}`;

  void Send(Text(reply));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
