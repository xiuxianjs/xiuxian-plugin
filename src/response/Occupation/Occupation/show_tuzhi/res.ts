import { Image, useSend } from 'alemonjs';
import { selects } from '@src/response/mw-captcha';
import { getTuzhiImage } from '@src/model/image';
import { existplayer } from '@src/model';

export const regular = /^(#|＃|\/)?装备图纸$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const img = await getTuzhiImage(e);

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
