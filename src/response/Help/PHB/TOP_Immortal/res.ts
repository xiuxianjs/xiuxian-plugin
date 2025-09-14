import { Image, Text, useSend } from 'alemonjs';

import { __PATH, existplayer, keysByPath, readPlayer, sortBy } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
import { screenshot } from '@src/image';
export const regular = /^(#|＃|\/)?魔道榜$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }

  const playerList = await keysByPath(__PATH.player_path);
  // 数组
  const temp = [];

  let i = 0;

  for (const playerId of playerList) {
    // (攻击+防御*0.8+生命*0.5)*暴击率=理论战力
    const player = await readPlayer(playerId);
    // 计算并保存到数组
    let power = player.魔道值;

    power = Math.trunc(power);
    temp[i] = {
      power: power,
      qq: playerId,
      name: player.名号,
      level_id: player.level_id
    };
    i++;
  }
  // 根据力量排序
  temp.sort(sortBy('power'));

  // 取前10名
  const top = temp.slice(0, 10);
  const image = await screenshot('immortal_genius', userId, {
    allplayer: top,
    title: '魔道榜',
    label: '魔道值'
  });

  if (Buffer.isBuffer(image)) {
    void Send(Image(image));

    return;
  }

  void Send(Text('图片生产失败'));
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
