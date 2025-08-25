import { Text, useSend } from 'alemonjs';
import { __PATH, existplayer, findQinmidu, keysByPath, sleep } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?查询亲密度$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const user_qq = e.UserId; //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false;

  const A = e.UserId;

  let flag = 0; //关系人数
  const msg = []; //回复的消息
  msg.push('\n-----qq----- -亲密度-');
  //遍历所有人的qq

  const playerList = await keysByPath(__PATH.player_path);

  for (let i = 0; i < playerList.length; i++) {
    const B = playerList[i];
    //如果是本人不执行查询
    if (A == B) {
      continue;
    }
    //A与B的亲密度
    const pd = await findQinmidu(A, B);
    if (pd == false) {
      continue;
    }
    flag++;
    msg.push(`\n${B}\t ${pd}`);
  }
  if (flag == 0) {
    Send(Text('其实一个人也不错的'));
  } else {
    for (let i = 0; i < msg.length; i += 8) {
      Send(Text(msg.slice(i, i + 8).join('')));
      await sleep(500);
    }
  }
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
