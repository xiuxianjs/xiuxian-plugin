import { Text, useSend } from 'alemonjs';

import { existNajieThing, existplayer } from '@src/model/index';
import { userLevelMaxUp } from '../level';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?幸运破体$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  const x = await existNajieThing(userId, '幸运草', '道具');

  if (!x) {
    void Send(Text('醒醒，你没有道具【幸运草】!'));

    return false;
  }
  void userLevelMaxUp(e, true);
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
