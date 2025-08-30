import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { getConfig, notUndAndNull, readPlayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getAuctionKeyManager } from '@src/model/auction';
export const regular = /^(#|＃|\/)?星阁出价.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  // 获取星阁key管理器，支持多机器人部署和自动数据迁移
  const auctionKeyManager = getAuctionKeyManager();

  const isGroupEnabled = await auctionKeyManager.isGroupAuctionEnabled(String(e.ChannelId));

  if (!isGroupEnabled) {
    void Send(Text('本群未开启星阁拍卖'));

    return false;
  }

  const auctionTaskKey = await auctionKeyManager.getAuctionOfficialTaskKey();
  const auction = await redis.get(auctionTaskKey);

  const cfg = await getConfig('xiuxian', 'xiuxian');

  if (!notUndAndNull(auction)) {
    const { openHour, closeHour } = cfg.Auction;

    void Send(Text(`不在拍卖时间，开启时间为每天${openHour}时~${closeHour}时`));

    return false;
  }

  const auctionData = JSON.parse(auction);
  const lastPrice = auctionData.lastPrice;
  const reg = e.MessageText.replace(/^(#|＃|\/)?星阁出价/, '');

  if (auctionData.last_offer_player === userId) {
    void Send(Text('不能自己给自己抬价哦!'));

    return false;
  }
  let newPrice = Number(reg);

  if (!newPrice) {
    newPrice = Math.floor(Math.ceil(lastPrice * 1.1));
  } else {
    if (newPrice < Math.ceil(lastPrice * 1.1)) {
      void Send(Text(`最新价格为${lastPrice}，每次加价不少于10 %！`));

      return false;
    }
  }
  if (player.灵石 < newPrice) {
    void Send(Text('没这么多钱也想浑水摸鱼?'));

    return false;
  }

  const groupListKey = await auctionKeyManager.getAuctionGroupListKey();

  auctionData.groupList = await redis.smembers(groupListKey);

  const msg = `${player.名号}叫价${newPrice} `;

  void Send(Text(msg));

  auctionData.lastPrice = newPrice;
  auctionData.last_offer_player = userId;
  auctionData.last_offer_price = Date.now(); // NOTE: Big SB

  //
  await redis.set(auctionTaskKey, JSON.stringify(auctionData));
});

export default onResponse(selects, [mw.current, res.current]);
