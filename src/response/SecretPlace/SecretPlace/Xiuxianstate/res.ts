import { Text, useSend } from 'alemonjs';

import { Go } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?修仙状态$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const flag = await Go(e);
  if (!flag) {
    return;
  }
  Send(Text('空闲中!'));
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
