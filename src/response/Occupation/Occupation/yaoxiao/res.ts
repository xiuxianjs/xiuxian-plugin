import { Text, useSend } from 'alemonjs';

import { readDanyao, readPlayer, existplayer } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?我的药效$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  const dy = await readDanyao(userId);
  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据读取失败'));

    return false;
  }

  const parts: string[] = ['丹药效果:'];

  if (dy.ped > 0) {
    parts.push(`仙缘丹药力${(dy.beiyong1 * 100).toFixed(0)}%药效${dy.ped}次`);
  }
  if (dy.lianti > 0) {
    parts.push(`炼神丹药力${(dy.beiyong4 * 100).toFixed(0)}%药效${dy.lianti}次`);
  }
  if (dy.beiyong2 > 0) {
    parts.push(`神赐丹药力${(dy.beiyong3 * 100).toFixed(0)}%药效${dy.beiyong2}次`);
  }
  if (dy.biguan > 0) {
    parts.push(`辟谷丹药力${(dy.biguanxl * 100).toFixed(0)}%药效${dy.biguan}次`);
  }
  if ((player.islucky || 0) > 0) {
    parts.push(`福源丹药力${((player.addluckyNo || 0) * 100).toFixed(0)}%药效${player.islucky}次`);
  }
  if (player.breakthrough === true) {
    parts.push('破境丹生效中');
  }
  if (dy.xingyun > 0) {
    parts.push(`真器丹药力${dy.beiyong5}药效${dy.xingyun}次`);
  }
  void Send(Text(parts.join('\n')));

  return false;
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
