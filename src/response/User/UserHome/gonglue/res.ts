import { Text, useSend } from 'alemonjs';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?修仙攻略$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'));
});
export default onResponse(selects, [mw.current, res.current]);
