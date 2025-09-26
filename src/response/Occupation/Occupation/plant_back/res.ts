import { delDataByKey, getPlayerAction, setDataJSONStringifyByKey } from '@src/model/index';
import { plantJiesuan, calcEffectiveMinutes } from '../../../../model/actions/occupation';
import { withLock } from '../../../../model/locks.js';

import { selects } from '@src/response/mw-captcha';
import { keysAction } from '@src/model/keys';
export const regular = /^(#|＃|\/)?结束采药$/;

const res = onResponse(selects, async e => {
  // 使用分布式锁防止重复结算
  const lockKey = `plant_settlement_${e.UserId}`;
  const result = await withLock(
    lockKey,
    async () => {
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

      // 防重复结算：若已结算（通过自定义 is_jiesuan 标志）直接返回
      if (raw.is_jiesuan === 1) {
        return;
      }

      const start_time = raw.end_time - raw.time;
      const now = Date.now();
      const effective = calcEffectiveMinutes(start_time, raw.end_time, now);

      // 执行采药结算
      if (e.name === 'message.create') {
        await plantJiesuan(e.UserId, effective, e.ChannelId);
      } else {
        await plantJiesuan(e.UserId, effective);
      }

      // 防重复结算：设置已结算标志并更新状态，而不是直接删除
      const updatedAction = { ...raw, is_jiesuan: 1 };

      await setDataJSONStringifyByKey(keysAction.action(e.UserId), updatedAction);

      // 延迟删除action数据，给其他可能的并发请求时间检查is_jiesuan标志
      setTimeout(() => {
        void delDataByKey(keysAction.action(e.UserId));
      }, 1000);
    },
    { timeout: 5000, maxRetries: 0 }
  );

  // 如果获取锁失败，说明正在结算中
  if (!result.success) {
    return false;
  }

  return false;
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
