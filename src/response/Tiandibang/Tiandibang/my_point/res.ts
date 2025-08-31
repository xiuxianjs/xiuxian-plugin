import { Image, Text, useSend } from 'alemonjs';

import { existplayer } from '@src/model/index';
import { readTiandibang } from '../../../../model/tian';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { screenshot } from '@src/image';
export const regular = /^(#|＃|\/)?天地榜$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 查看存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }

  //
  const tiandibang = await readTiandibang();

  // 查找用户是否报名
  const userIndex = tiandibang.findIndex(p => p.qq === userId);

  if (userIndex === -1) {
    void Send(Text('请先报名!'));

    return false;
  }

  // 生成图片，传递实际排行榜数据
  const image = await screenshot('immortal_genius', userId, {
    allplayer: tiandibang
      .sort((a, b) => b.积分 - a.积分)
      .slice(0, 10)
      .map(item => {
        return {
          power: item.积分,
          qq: item.qq,
          name: item.name
        };
      }),
    title: '天地榜(每日免费三次)',
    label: '积分'
  });

  if (Buffer.isBuffer(image)) {
    void Send(Image(image));

    return;
  }

  // 图片生成失败，仅提示错误
  void Send(Text('图片生产失败'));
});

export default onResponse(selects, [mw.current, res.current]);
