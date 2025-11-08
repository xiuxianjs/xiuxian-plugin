import { Text, useSend } from 'alemonjs';
import { Go, keys, readPlayer, writePlayer } from '@src/model/index';
import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw-captcha';
import { withLock } from '@src/model/locks';
export const regular = /^(#|＃|\/)?转换副职$/;

/**
 * 转换副职指令处理（带分布式锁）
 *
 * 为避免并发请求导致主副职业互换时出现数据错乱（两个职业变成一个），
 * 这里对每位玩家的“转换副职”操作施加分布式锁，保证同一时间仅有一个转换流程进行。
 * 锁键使用 `occupation_convert:${usrId}`，锁超时为 5 秒，不重试。
 */
const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usrId = e.UserId;

  // 校验当前是否可进行操作
  const flag = await Go(e);

  if (!flag) {
    return false;
  }

  // 分布式锁：确保单用户转换过程的原子性
  const lockKey = `occupation_convert:${usrId}`;
  const result = await withLock(
    lockKey,
    async () => {
      const player = await readPlayer(usrId);

      if (!player) {
        return false;
      }

      const action = await getDataJSONParseByKey(keys.fuzhi(usrId));

      if (!action) {
        // 没有副职信息，直接返回
        return false;
      }

      // 执行主副职业互换（在锁保护下的临界区）
      const a = action.职业名;
      const b = action.职业经验;
      const c = action.职业等级;

      action.职业名 = player.occupation;
      action.职业经验 = player.occupation_exp;
      action.职业等级 = player.occupation_level;

      player.occupation = a;
      player.occupation_exp = b;
      player.occupation_level = c;

      await setDataJSONStringifyByKey(keys.fuzhi(usrId), action);
      await writePlayer(usrId, player);

      void Send(Text(`恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`));

      return true;
    },
    { timeout: 5000, retryDelay: 100, maxRetries: 0 }
  );

  // 获取锁失败，说明正在转换中或并发冲突
  if (!result.success) {
    void Send(Text('正在进行职业转换，请稍后再试'));

    return false;
  }

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
