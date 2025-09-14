import { Text, useSend } from 'alemonjs';

import { existNajieThing, existplayer } from '@src/model/index';
import { useLevelUp } from '../level';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?幸运突破$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  const x = await existNajieThing(userId, '幸运草', '道具');

  if (!x) {
    void Send(Text('醒醒，你没有道具【幸运草】!'));

    return false;
  }
  void useLevelUp(e, true);
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
