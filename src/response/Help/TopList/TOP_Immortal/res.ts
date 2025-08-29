import { Image, Text, useSend } from 'alemonjs';

import { __PATH, existplayer, keysByPath, readPlayer, sortBy } from '@src/model/index';

import { selects } from '@src/response/mw';
import { screenshot } from '@src/image';
export const regular = /^(#|＃|\/)?封神榜$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  // const msg = ['___[封神榜]___']
  // 数组
  const temp = [];

  const playerList = await keysByPath(__PATH.player_path);
  let i = 0;

  for (const playerId of playerList) {
    // (攻击+防御*0.8+生命*0.5)*暴击率=理论战力
    const player = await readPlayer(playerId);
    // 计算并保存到数组
    let power = player.攻击 * 0.9 + player.防御 * 1.1 + player.血量上限 * 0.6 + player.暴击率 * player.攻击 * 0.5;

    if (player.level_id < 42) {
      // 跳过凡人
      continue;
    }
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
    title: '封神榜',
    label: '战力'
  });

  if (Buffer.isBuffer(image)) {
    void Send(Image(image));

    return;
  }

  void Send(Text('图片生产失败'));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
