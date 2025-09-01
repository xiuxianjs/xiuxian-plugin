import { getRedisKey } from '@src/model/keys';
import { Text, useSend } from 'alemonjs';
import { config, redis } from '@src/model/api';
import { Go, readPlayer } from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { game } from '../game';

export const regular = /^(#|＃|\/)?金银坊$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId;

  // 玩家数据
  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  const cf = await config.getConfig('xiuxian', 'xiuxian');
  const gameswitch = cf?.sw?.Moneynumber;

  if (gameswitch !== true) {
    return false;
  }

  const flag = await Go(e);

  if (!flag) {
    return false;
  }

  const toInt = (v, d = 0) => {
    const n = Number(v);

    return Number.isFinite(n) ? n : d;
  };

  const BASE_COST = 10000; // 进入最低灵石

  //
  const playerCoin = toInt(player.灵石);

  // 灵石不足处理，清理游戏状态
  if (playerCoin < BASE_COST) {
    await redis.set(getRedisKey(userId, 'last_game_time'), Date.now());
    await redis.del(getRedisKey(userId, 'game_action'));

    game.yazhu[userId] = 0;

    void Send(Text('媚娘：钱不够也想玩？'));

    return false;
  }

  const gameAction = await redis.get(getRedisKey(userId, 'game_action'));

  if (gameAction && +gameAction === 1) {
    void Send(Text('媚娘：猜大小正在进行哦!'));

    return false;
  }

  const last_game_time_raw = await redis.get(getRedisKey(userId, 'last_game_time'));
  let last_game_time = Number(last_game_time_raw);

  if (!Number.isFinite(last_game_time)) {
    last_game_time = 0;
  }

  const transferTimeout = toInt(cf?.CD?.gambling, 30) * 1000; // 默认30s

  if (Date.now() < last_game_time + transferTimeout) {
    const left = last_game_time + transferTimeout - Date.now();
    const game_s = Math.ceil(left / 1000);

    void Send(Text(`每${transferTimeout / 1000}秒游玩一次。\ncd: ${game_s}秒`));

    return false;
  }

  // 记录本次时间
  await redis.set(getRedisKey(userId, 'last_game_time'), Date.now());

  await redis.set(getRedisKey(userId, 'game_action'), 1);

  void Send(Text('媚娘：发送[#投入+数字]或[#梭哈]\n>取消请发送【取消投入】或【取消梭哈】'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
