import { Text, useMention, useSend } from 'alemonjs';

import {
  existplayer,
  existNajieThing,
  findQinmidu,
  fstaddQinmidu,
  addQinmidu,
  addNajieThing,
  existHunyin
} from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?^赠予百合花篮$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    return false;
  }

  const B = target.UserId;
  const A = e.UserId;
  const ifexistplay = await existplayer(A);

  if (!ifexistplay) {
    return false;
  }
  if (A == B) {
    Send(Text('精神分裂?'));

    return false;
  }
  const ifexistplay_B = await existplayer(B);

  if (!ifexistplay_B) {
    Send(Text('修仙者不可对凡人出手!'));

    return false;
  }
  const ishavejz = await existNajieThing(A, '百合花篮', '道具');

  if (!ishavejz) {
    Send(Text('你没有[百合花篮]'));

    return false;
  }
  const pd = await findQinmidu(A, B);

  if (pd === false) {
    await fstaddQinmidu(A, B);
  } else if (pd == 0) {
    // 查询A的道侣
    const existHunyinA = await existHunyin(A);

    if (existHunyinA !== B) {
      Send(Text('对方已有道侣'));

      return false;
    }
  }

  await addQinmidu(A, B, 60);
  await addNajieThing(A, '百合花篮', '道具', -1);
  Send(Text('你们的亲密度增加了60'));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
