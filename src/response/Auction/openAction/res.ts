import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { getConfig, openAU, readPlayer } from '@src/model/index';
import type { ExchangeRecord } from '@src/types';
import { KEY_AUCTION_GROUP_LIST } from '@src/model/constants';
import mw from '@src/response/mw';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?开启星阁体系$/;

function isExchangeRecord(v): v is ExchangeRecord {
  return !!v && typeof v === 'object' && 'thing' in v && 'start_price' in v;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    Send(Text('只有主人可以开启'));

    return false;
  }

  const redisGlKey = KEY_AUCTION_GROUP_LIST;
  const channelId = String(e.ChannelId);

  // 已存在开启记录 -> 直接加入
  const already = await redis.sismember(redisGlKey, channelId);

  if (already) {
    Send(Text('星阁拍卖行已经开啦'));

    return false;
  }
  const groupList = await redis.smembers(redisGlKey);

  if (groupList.length > 0) {
    await redis.sadd(redisGlKey, channelId);
    Send(Text('星阁已开启，已将本群添加至星阁体系'));

    return false;
  }

  // 尚未开启：检查时间窗口
  const cfg = (await getConfig('xiuxian', 'xiuxian')) as Partial<{
    openHour: number;
    closeHour: number;
  }>;
  const openHour = typeof cfg.openHour === 'number' ? cfg.openHour : 20;
  const closeHour = typeof cfg.closeHour === 'number' ? cfg.closeHour : 22;
  const now = new Date();
  const day0 = new Date(now);
  const midnight = day0.setHours(0, 0, 0, 0);
  const openTime = midnight + openHour * 3600 * 1000;
  const closeTime = midnight + closeHour * 3600 * 1000;
  const nowTs = now.getTime();

  if (nowTs > openTime && nowTs < closeTime) {
    try {
      const auction = await openAU();

      if (!isExchangeRecord(auction)) { throw new Error('拍卖数据结构异常'); }
      let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;

      if (auction.last_offer_player === 0) {
        msg += '暂无人出价';
      } else {
        const player = await readPlayer(String(auction.last_offer_player));

        msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
      }
      await Send(Text(msg));
    } catch (err) {
      Send(Text('开启拍卖失败: ' + (err as Error).message));

      return false;
    }
  } else {
    Send(Text('当前不在星阁开启时间，将直接初始化空白场次'));
  }

  // 重置并加入当前群
  try {
    await redis.del(redisGlKey);
  } catch (_err) {
    // 忽略删除失败
  }
  await redis.sadd(redisGlKey, channelId);
  Send(Text('星阁体系在本群开启！'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
