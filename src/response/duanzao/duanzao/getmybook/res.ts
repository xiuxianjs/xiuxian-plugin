import { Text, useSend } from 'alemonjs';

import { existplayer, settripod, readPlayer } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?炼器师能力评测/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const user_qq = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(user_qq))) {
    return false;
  }
  const player = await readPlayer(user_qq);

  if (player.occupation != '炼器师') {
    Send(Text('你还不是炼器师哦,宝贝'));

    return false;
  }
  if (player.锻造天赋) {
    Send(Text('您已经测评过了'));

    return false;
  }
  const b = await settripod(user_qq);

  Send(Text(b));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
