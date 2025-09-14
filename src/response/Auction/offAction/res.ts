import { Text, useSend } from 'alemonjs';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { closeAuctionKeys } from '@src/model/Config';
export const regular = /^(#|＃|\/)?关闭星阁体系$/;

const res = onResponse(selects, e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    void Send(Text('只有主人可以关闭'));

    return;
  }

  closeAuctionKeys();

  void Send(Text('星阁体系已关闭！'));
});

export default onResponse(selects, [mw.current, res.current]);
