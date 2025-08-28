import { Image, useSend } from 'alemonjs';
import { selects } from '@src/response/mw';
import { getQquipmentImage } from '@src/model/image';
import { existplayer } from '@src/model';
export const regular = /^(#|＃|\/)?我的装备$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const usr_qq = e.UserId;
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return false;
  }
  const img = await getQquipmentImage(e);

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
