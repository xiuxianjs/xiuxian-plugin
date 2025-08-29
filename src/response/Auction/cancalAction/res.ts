import { Text, useSend } from 'alemonjs';

import mw from '@src/response/mw';
import { getAuctionKeyManager } from '@src/model/auction';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?取消星阁体系$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    void Send(Text('只有主人可以取消'));

    return false;
  }

  // 获取星阁key管理器，支持多机器人部署和自动数据迁移
  const auctionKeyManager = getAuctionKeyManager();
  const groupId = String(e.ChannelId);

  const isGroupEnabled = await auctionKeyManager.isGroupAuctionEnabled(groupId);

  if (!isGroupEnabled) {
    void Send(Text('本群未开启星阁拍卖'));

    return false;
  }

  await auctionKeyManager.disableGroupAuction(groupId);
  void Send(Text('星阁体系在本群取消了'));
});

export default onResponse(selects, [mw.current, res.current]);
