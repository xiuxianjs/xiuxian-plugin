import { Text, useSend } from 'alemonjs';
import { redis } from '@src/model/api';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getAuctionKeys } from '@src/model/constants';
import { getAppCofig } from '@src/model/Config';
export const regular = /^(#|＃|\/)?关闭星阁体系$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    void Send(Text('只有主人可以关闭'));

    return false;
  }

  // 获取机器人配置，用于多机器人部署的key区分
  const { botId } = getAppCofig();
  const auctionKeys = getAuctionKeys(botId);

  await redis.del(auctionKeys.AUCTION_OFFICIAL_TASK);
  await redis.del(auctionKeys.AUCTION_GROUP_LIST);

  void Send(Text('星阁体系已关闭！'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
