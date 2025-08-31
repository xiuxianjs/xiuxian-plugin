import { delDataByKey, getPlayerAction } from '@src/model/index';
import { plantJiesuan, calcEffectiveMinutes } from '../../../../model/actions/occupation';

import { selects } from '@src/response/mw';
import { keysAction } from '@src/model/keys';
export const regular = /^(#|＃|\/)?结束采药$/;

const res = onResponse(selects, async e => {
  const raw = await getPlayerAction(e.UserId);

  if (!raw) {
    return;
  }
  if (raw.action === '空闲') {
    return;
  }

  if (raw.plant === '1') {
    return;
  }

  // 若已结算（通过自定义 is_jiesuan 标志）直接返回
  if (raw.is_jiesuan === 1) {
    return;
  }

  const start_time = raw.end_time - raw.time;
  const now = Date.now();
  const effective = calcEffectiveMinutes(start_time, raw.end_time, now);

  if (e.name === 'message.create') {
    await plantJiesuan(e.UserId, effective, e.ChannelId);
  } else {
    await plantJiesuan(e.UserId, effective);
  }

  // 非任务取消的。直接删除del
  void delDataByKey(keysAction.action(e.UserId));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
