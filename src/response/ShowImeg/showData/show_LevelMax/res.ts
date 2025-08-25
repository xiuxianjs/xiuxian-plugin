import { Image, useSend } from 'alemonjs';
import { selects } from '@src/response/mw';
import { getStatemaxImage } from '@src/model/image';
export const regular = /^(#|＃|\/)?炼体境界$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const img = await getStatemaxImage(e, null);
  if (Buffer.isBuffer(img)) {
    Send(Image(img));
  }
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
