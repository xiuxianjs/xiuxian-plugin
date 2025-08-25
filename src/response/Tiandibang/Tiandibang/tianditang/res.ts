import { Text, Image, useSend } from 'alemonjs';

import { existplayer } from '@src/model/index';
import { readTiandibang, Write_tiandibang, get_tianditang_img } from '../tian';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?天地堂/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  // 查看存档
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return false;
  }
  let tiandibang = [];

  try {
    tiandibang = await readTiandibang();
  } catch {
    // 没有表要先建立一个！
    await Write_tiandibang([]);
  }
  let m = tiandibang.length;

  for (m = 0; m < tiandibang.length; m++) {
    if (tiandibang[m].qq == usr_qq) {
      break;
    }
  }
  if (m == tiandibang.length) {
    Send(Text('请先报名!'));

    return false;
  }
  const img = await get_tianditang_img(e, tiandibang[m].积分);

  if (Buffer.isBuffer(img)) {
    Send(Image(img));
  }
});

export default onResponse(selects, [mw.current, res.current]);
