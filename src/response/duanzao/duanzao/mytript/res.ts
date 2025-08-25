import { Text, useSend } from 'alemonjs';

import { existplayer, looktripod, readMytripod } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?我的锻炉/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const user_qq = e.UserId;
  if (!(await existplayer(user_qq))) return false;
  const A = await looktripod(user_qq);
  if (A != 1) {
    Send(Text('请先去#炼器师能力评测,再来煅炉吧'));
    return false;
  }

  const a = await readMytripod(user_qq);

  if (a.材料.length == 0) {
    Send(Text('锻炉里空空如也,没什么好看的'));
    return false;
  }
  const shuju = [];
  const shuju2 = [];
  let xuanze = 0;
  let b = '您的锻炉里,拥有\n';
  for (const item in a.材料) {
    for (const item1 in shuju) {
      if (shuju[item1] == a.材料[item]) {
        shuju2[item1] = shuju2[item1] * 1 + a.数量[item] * 1;
        xuanze = 1;
      }
    }
    if (xuanze == 0) {
      shuju.push(a.材料[item]);
      shuju2.push(a.数量[item]);
    } else {
      xuanze = 0;
    }
    //不要问我为啥不在前面优化，问就是懒，虽然确实前面优化会加快机器人反应速度
  }
  for (const item2 in shuju) {
    b += shuju[item2] + shuju2[item2] + '个\n';
  }
  Send(Text(b));
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
