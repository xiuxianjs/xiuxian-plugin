import { Text, useSend } from 'alemonjs';

import { readPlayer, readQinmidu, writeQinmidu } from '@src/model/index';
import { Daolv, found } from '../daolv';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?^(我同意|我拒绝)$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  if (e.UserId != Daolv.user_B) return false;
  if (Daolv.x == 2) {
    const player_A = await readPlayer(Daolv.user_A);
    const player_B = await readPlayer(Daolv.user_B);
    const qinmidu = await readQinmidu();
    const i = await found(Daolv.user_A, Daolv.user_B);
    if (i != qinmidu.length) {
      if (e.MessageText == '我同意') {
        qinmidu[i].婚姻 = 0;
        await writeQinmidu(qinmidu);
        Send(Text(`${player_A.名号}和${player_B.名号}和平分手`));
      } else if (e.MessageText == '我拒绝') {
        Send(Text(`${player_B.名号}拒绝了${player_A.名号}提出的建议`));
      }
    }
    clearTimeout(Daolv.chaoshi_time);
    Daolv.set_chaoshi_time(null);
    Daolv.set_x(0);
    return false;
  }
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
