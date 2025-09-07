import { Go } from '@src/model/index';
import mw from '@src/response/mw';
import { Text, useSend } from 'alemonjs';
import { selects } from '@src/response/mw';

export const regular = /^(#|＃|\/)?修仙状态$/;

const res = onResponse(selects, async e => {
  const flag = await Go(e);

  if (!flag) {
    return;
  }
  const Send = useSend(e);

  void Send(Text('空闲中'));
});

export default onResponse(selects, [mw.current, res.current]);
