import { Text, Image, useSend } from 'alemonjs';

import { existplayer } from '@src/model/index';
import { readTiandibang, getTianditangImage } from '../../../../model/tian';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?天地堂/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 查看存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const tiandibang = await readTiandibang();

  // 查找用户是否报名
  const userIndex = tiandibang.findIndex(p => p.qq === userId);

  if (userIndex === -1) {
    void Send(Text('请先报名!'));

    return false;
  }

  const img = await getTianditangImage(e, tiandibang[userIndex].积分);

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));

    return;
  }

  void Send(Text('图片生成失败'));
});

export default onResponse(selects, [mw.current, res.current]);
