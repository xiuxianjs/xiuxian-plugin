import { Text, useSend } from 'alemonjs';

import { existplayer, existNajieThing, readPlayer, writePlayer, addNajieThing } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?供奉神石$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 查看存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const x = await existNajieThing(userId, '神石', '道具');

  if (!x) {
    void Send(Text('你没有神石'));

    return false;
  }
  const player = await readPlayer(userId);

  if (player.魔道值 > 0 || (player.灵根.type !== '转生' && player.level_id < 42)) {
    void Send(Text('你尝试供奉神石,但是失败了'));

    return false;
  }
  player.神石 += x;
  await writePlayer(userId, player);
  void Send(Text('供奉成功,当前供奉进度' + player.神石 + '/200'));
  await addNajieThing(userId, '神石', '道具', -x);
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
