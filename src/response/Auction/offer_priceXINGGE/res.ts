import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { existplayer, getConfig, notUndAndNull, readPlayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getAuctionKeyManager } from '@src/model/auction';
export const regular = /^(#|＃|\/)?星阁出价.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  // 固定写法
  // 判断是否为匿名创建存档
  // 有无存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
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

  if (!notUndAndNull(auction)) {
    const { openHour, closeHour } = (await getConfig('xiuxian', 'xiuxian')).Auction;

    void Send(Text(`不在拍卖时间，开启时间为每天${openHour}时~${closeHour}时`));

    return false;
  }

  const player = await readPlayer(userId);
  const auctionData = JSON.parse(auction);
  // let start_price = auction.start_price;
  const last_price = auctionData.last_price;
  const reg = e.MessageText.replace(/^(#|＃|\/)?星阁出价/, '');

  if (auctionData.last_offer_player === userId) {
    void Send(Text('不能自己给自己抬价哦!'));

    return false;
  }
  let new_price = Number(reg);

  if (!new_price) {
    new_price = Math.floor(Math.ceil(last_price * 1.1));
  } else {
    if (new_price < Math.ceil(last_price * 1.1)) {
      void Send(Text(`最新价格为${last_price}，每次加价不少于10 %！`));

      return false;
    }
  }
  if (player.灵石 < new_price) {
    void Send(Text('没这么多钱也想浑水摸鱼?'));

    return false;
  }

  // if (auction.group_id.indexOf(e.group_id) < 0) {
  //   auction.group_id += '|' + e.group_id;
  // } NOTE: 过时的
  // 关掉了
  // await redis.sAdd(auctionKeys.AUCTION_GROUP_LIST, String(e.group_id));
  const groupListKey = await auctionKeyManager.getAuctionGroupListKey();

  auctionData.groupList = await redis.smembers(groupListKey);

  const msg = `${player.名号}叫价${new_price} `;

  void Send(Text(msg));
  // ↑新的：RetuEase

  auctionData.last_price = new_price;
  auctionData.last_offer_player = userId;
  auctionData.last_offer_price = Date.now(); // NOTE: Big SB
  await redis.set(auctionTaskKey, JSON.stringify(auctionData));
});

export default onResponse(selects, [mw.current, res.current]);
