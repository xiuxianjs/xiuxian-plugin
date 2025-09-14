import { Image, useSend } from 'alemonjs';
import { selects } from '@src/response/mw-captcha';
import { getValuablesImage } from '@src/model/image';
import { existplayer } from '@src/model';

export const regular = /^(#|＃|\/)?万宝楼$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const img = await getValuablesImage(e);

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
