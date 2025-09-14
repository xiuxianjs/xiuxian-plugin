import { Text, useSend } from 'alemonjs';

import { getDataList } from '@src/model/DataList';
import { existplayer, readPlayer, existNajieThing, addNajieThing } from '@src/model/index';
import { NajieCategory } from '@src/types/model';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?献祭魔石$/;

interface PrizeItem {
  name: string;
  class?: string;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据读取失败'));

    return false;
  }

  const needMagic = 1000;
  const playerMagic = Number(player.魔道值) || 0;

  if (playerMagic < needMagic) {
    void Send(Text('你不是魔头'));

    return false;
  }

  const COST = 8;
  const hasCount = await existNajieThing(userId, '魔石', '道具');
  const owned = Number(hasCount) || 0;

  if (owned <= 0) {
    void Send(Text('你没有魔石'));

    return false;
  }
  if (owned < COST) {
    void Send(Text(`魔石不足${COST}个,当前魔石数量${owned}个`));

    return false;
  }

  const xinggeList = await getDataList('Xingge');
  const pool = xinggeList[0]?.one as PrizeItem[] | undefined;

  if (!Array.isArray(pool) || pool.length === 0) {
    void Send(Text('奖励配置缺失'));

    return false;
  }

  await addNajieThing(userId, '魔石', '道具', -COST);

  const idx = Math.floor(Math.random() * pool.length);
  const prize = pool[idx];

  if (!prize || typeof prize !== 'object' || !prize.name) {
    void Send(Text('奖励生成失败'));

    return false;
  }
  const name = prize.name;
  const cls = (prize.class || '道具') as NajieCategory;

  void Send(Text('获得了' + name));
  await addNajieThing(userId, name, cls, 1);

  return false;
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
