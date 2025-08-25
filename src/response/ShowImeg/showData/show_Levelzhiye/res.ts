import { Image, useSend } from 'alemonjs';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getStatezhiyeImage } from '@src/model/image';
import { existplayer } from '@src/model';
export const regular = /^(#|＃|\/)?职业等级$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const usr_qq = e.UserId;
  const ifexistplay = await existplayer(usr_qq);
  if (!ifexistplay) return false;
  const img = await getStatezhiyeImage(e, null);
  if (Buffer.isBuffer(img)) {
    Send(Image(img));
  }
});
export default onResponse(selects, [mw.current, res.current]);
