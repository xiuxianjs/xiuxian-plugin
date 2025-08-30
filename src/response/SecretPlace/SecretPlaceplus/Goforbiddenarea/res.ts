import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { getRedisKey } from '@src/model/keys';
import { startAction } from '@src/model/actionHelper';
import { Go, readPlayer, notUndAndNull, convert2integer, existNajieThing, addNajieThing, addCoin, addExp } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?沉迷禁地.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('请先#踏入仙途'));

    return false;
  }

  // 当前境界 id
  if (!notUndAndNull(player.level_id)) {
    void Send(Text('请先#同步信息'));

    return false;
  }
  if (!notUndAndNull(player.power_place)) {
    void Send(Text('请#同步信息'));

    return false;
  }
  const levelList = await getDataList('Level1');
  const now_level_id = levelList.find(item => item.level_id === player.level_id).level_id;

  if (now_level_id < 22) {
    void Send(Text('没有达到化神之前还是不要去了'));

    return false;
  }
  let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷禁地/, '');
  const code = didian.split('*');

  didian = code[0];
  const i = convert2integer(code[1]);

  if (i > 12) {
    return false;
  }
  const forbiddenareaList = await getDataList('ForbiddenArea');
  const weizhiRaw = forbiddenareaList.find(item => item.name === didian);

  if (!notUndAndNull(weizhiRaw)) {
    return false;
  }
  // 类型收窄
  const weizhiUnknown = weizhiRaw;
  const guardWeizhi = (v): v is { name: string; Price: number; experience: number } => {
    if (!v || typeof v !== 'object') {
      return false;
    }
    const r = v;

    return typeof r.Price === 'number' && typeof r.experience === 'number' && typeof r.name === 'string';
  };

  if (!guardWeizhi(weizhiUnknown)) {
    return false;
  }
  const weizhi = weizhiUnknown;

  if (player.灵石 < weizhi.Price * 10 * i) {
    void Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'));

    return false;
  }
  if (player.修为 < weizhi.experience * 10 * i) {
    void Send(Text('你需要积累' + weizhi.experience * 10 * i + '修为，才能抵抗禁地魔气！'));

    return false;
  }
  const number = await existNajieThing(userId, '秘境之匙', '道具');

  if (typeof number === 'number' && number >= i) {
    await addNajieThing(userId, '秘境之匙', '道具', -i);
  } else {
    void Send(Text('你没有足够数量的秘境之匙'));

    return false;
  }
  const Price = weizhi.Price * 10 * i;
  const Exp = weizhi.experience * 10 * i;

  await addCoin(userId, -Price);
  await addExp(userId, -Exp);
  const time = i * 10 * 5 + 10; // 时间（分钟）
  const action_time = 60000 * time; // 持续时间，单位毫秒
  const arr = await startAction(userId, '禁地', action_time, {
    shutup: '1',
    working: '1',
    Place_action: '1',
    Place_actionplus: '0',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    plant: '1',
    mine: '1',
    cishu: 10 * i,
    Place_address: weizhi,
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  });

  await redis.set(getRedisKey(String(userId), 'action'), JSON.stringify(arr));
  void Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'));
});

import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
export default onResponse(selects, [mw.current, res.current]);
