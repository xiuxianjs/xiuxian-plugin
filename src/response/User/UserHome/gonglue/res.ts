import { Text, useSend } from 'alemonjs';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?修仙攻略$/;

const res = onResponse(selects, e => {
  const Send = useSend(e);

  void Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'));
});

export default onResponse(selects, [mw.current, res.current]);
