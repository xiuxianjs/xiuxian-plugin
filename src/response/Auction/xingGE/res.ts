import { Text, useSend } from 'alemonjs';

import { existplayer, getDataJSONParseByKey, readPlayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getAuctionKeyManager } from '@src/model/auction';
export const regular = /^(#|＃|\/)?星阁拍卖行$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }

  // 获取星阁key管理器，支持多机器人部署和自动数据迁移
  const auctionKeyManager = getAuctionKeyManager();

  const auctionTaskKey = await auctionKeyManager.getAuctionOfficialTaskKey();
  const auction = await getDataJSONParseByKey(auctionTaskKey);

  if (!auction) {
    void Send(Text('目前没有拍卖正在进行'));

    return false;
  }

  let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;

  if (auction.last_offer_player === 0) {
    msg += '暂无人出价';
  } else {
    const player = await readPlayer(auction.last_offer_player);

    if (player) {
      msg += `最高出价是${player.名号}叫出的${auction.lastPrice}`;
    }
  }
  void Send(Text(msg));
});

export default onResponse(selects, [mw.current, res.current]);
