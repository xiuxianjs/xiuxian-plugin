import { Text, useSend } from 'alemonjs';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { reSetTiandibang } from '@src/model/Tiandibang';

export const regular = /^(#|＃|\/)?重置天地榜/;
const res = onResponse(selects, e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return;
  }
  void reSetTiandibang();
  void Send(Text('重置天地榜成功'));
});

export default onResponse(selects, [mw.current, res.current]);
