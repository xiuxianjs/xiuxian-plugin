import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { getRedisKey } from '@src/model/keys';
import { startAction } from '@src/model/actionHelper';
import { Go, convert2integer, notUndAndNull, readPlayer, existNajieThing, addNajieThing, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?沉迷秘境.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷秘境/, '');
  const code = didian.split('*');

  didian = code[0];
  const i = convert2integer(code[1]);

  if (i > 12) {
    return false;
  }
  const diDianList = await getDataList('Didian');
  const weizhi = diDianList.find(item => item.name === didian);

  if (!notUndAndNull(weizhi)) {
    return false;
  }
  const player = await readPlayer(userId);
  // weizhi 结构断言（原 data.didian_list 项目应包含 Price:number）
  const placeUnknown = weizhi;

  if (!placeUnknown || typeof placeUnknown !== 'object' || !('Price' in placeUnknown) || !('name' in placeUnknown) || typeof placeUnknown.Price !== 'number') {
    return false;
  }
  const place = placeUnknown as { name: string; Price: number } & Record<string, unknown>;

  if (player.灵石 < place.Price * 10 * i) {
    void Send(Text('没有灵石寸步难行,攒到' + place.Price * 10 * i + '灵石才够哦~'));

    return false;
  }
  if (didian === '大千世界' || didian === '桃花岛') {
    void Send(Text('该秘境不支持沉迷哦'));

    return false;
  }
  const keyCount = await existNajieThing(userId, '秘境之匙', '道具');

  if (typeof keyCount === 'number' && keyCount >= i) {
    await addNajieThing(userId, '秘境之匙', '道具', -i);
  } else {
    void Send(Text('你没有足够数量的秘境之匙'));

    return false;
  }
  const Price = place.Price * 10 * i;

  await addCoin(userId, -Price);
  const time = i * 10 * 5 + 10; // 时间（分钟）
  const action_time = 60000 * time; // 持续时间，单位毫秒
  const arr = await startAction(userId, '历练', action_time, {
    shutup: '1',
    working: '1',
    Place_action: '1',
    Place_actionplus: '0',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    plant: '1',
    mine: '1',
    cishu: i * 10,
    Place_address: place,
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  });

  await redis.set(getRedisKey(userId, 'action'), JSON.stringify(arr));
  void Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});

import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
export default onResponse(selects, [mw.current, res.current]);
