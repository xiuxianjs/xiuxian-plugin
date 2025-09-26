import { delDataByKey, getPlayerAction, setDataJSONStringifyByKey } from '@src/model/index';
import { mineJiesuan } from '../../../../model/actions/occupation';
import { withLock } from '../../../../model/locks.js';

import { selects } from '@src/response/mw-captcha';
import { keysAction } from '@src/model/keys';
export const regular = /^(#|＃|\/)?结束采矿$/;

interface PlayerAction {
  action: string;
  mine?: number;
  end_time?: number; // 结束时间戳(ms)
  time?: number; // 持续时长(ms)
  start?: number; // 兼容另一种结构: 开始时间
  duration?: number; // 兼容: 持续时长
  is_jiesuan?: number;
  plant?: number;
  shutup?: number;
  working?: number;
  power_up?: number;
  Place_action?: number;
  group_id?: string;
}

const BLOCK_MINUTES = 30; // 满 30 分钟结算一个周期
const MAX_BLOCKS = 24; // 最多 24 个周期 (12 小时)

function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

function normalizeAction(raw): PlayerAction {
  if (!raw || typeof raw !== 'object') {
    return { action: '空闲' };
  }
  const r = raw;
  const action: PlayerAction = {
    action: typeof r.action === 'string' ? r.action : '空闲',
    mine: toInt(r.mine),
    end_time: toInt(r.end_time),
    time: toInt(r.time),
    start: toInt(r.start),
    duration: toInt(r.duration),
    is_jiesuan: toInt(r.is_jiesuan),
    plant: toInt(r.plant),
    shutup: toInt(r.shutup),
    working: toInt(r.working),
    power_up: toInt(r.power_up),
    Place_action: toInt(r.Place_action),
    group_id: typeof r.group_id === 'string' ? r.group_id : undefined
  };

  // 将非法 0 视为未设置
  if (!action.end_time) {
    delete action.end_time;
  }
  if (!action.time) {
    delete action.time;
  }
  if (!action.start) {
    delete action.start;
  }
  if (!action.duration) {
    delete action.duration;
  }

  return action;
}

// 计算可结算分钟(按 30 分钟为一个周期取整; 未满首个周期视为 0)
function calcEffectiveMinutes(act: PlayerAction, now: number): number {
  // 优先使用 (end_time,time) 结构; 否则使用 (start,duration)
  let startMs: number | undefined;
  let durationMs: number | undefined;

  if (act.end_time && act.time) {
    durationMs = act.time;
    startMs = act.end_time - act.time;
  } else if (act.start && act.duration) {
    startMs = act.start;
    durationMs = act.duration;
  }
  if (!startMs || !durationMs) {
    return 0;
  }

  const endMs = startMs + durationMs;
  const elapsed = endMs > now ? Math.max(0, now - startMs) : durationMs;
  const minutes = Math.floor(elapsed / 60000);

  if (minutes < BLOCK_MINUTES) {
    return 0;
  }
  const blocks = Math.min(MAX_BLOCKS, Math.floor(minutes / BLOCK_MINUTES));

  return blocks * BLOCK_MINUTES;
}

const res = onResponse(selects, async e => {
  // 使用分布式锁防止重复结算
  const lockKey = `mine_settlement_${e.UserId}`;
  const result = await withLock(
    lockKey,
    async () => {
      const raw = await getPlayerAction(e.UserId);
      const action = normalizeAction(raw);

      if (action.action === '空闲') {
        return false;
      }
      if (action.mine === 1) {
        return false;
      }

      // 防重复结算：若已结算（通过自定义 is_jiesuan 标志）直接返回
      if (action.is_jiesuan === 1) {
        return false;
      }

      const now = Date.now();
      const minutes = calcEffectiveMinutes(action, now);

      // 执行采矿结算
      if (e.name === 'message.create') {
        await mineJiesuan(e.UserId, minutes, e.ChannelId);
      } else {
        await mineJiesuan(e.UserId, minutes);
      }

      // 防重复结算：设置已结算标志并更新状态，而不是直接删除
      const updatedAction = { ...raw, is_jiesuan: 1 };

      await setDataJSONStringifyByKey(keysAction.action(e.UserId), updatedAction);

      // 延迟删除action数据，给其他可能的并发请求时间检查is_jiesuan标志
      setTimeout(() => {
        void delDataByKey(keysAction.action(e.UserId));
      }, 1000);

      return false;
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
