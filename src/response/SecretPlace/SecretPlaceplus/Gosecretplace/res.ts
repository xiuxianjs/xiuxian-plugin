import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { getRedisKey } from '@src/model/keys';
import { startAction } from '@src/response/actionHelper';
import {
  Go,
  convert2integer,
  notUndAndNull,
  readPlayer,
  existNajieThing,
  addNajieThing,
  addCoin
} from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?沉迷秘境.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const flag = await Go(e);
  if (!flag) {
    return false;
  }
  let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷秘境/, '');
  const code = didian.split('*');
  didian = code[0];
  const i = await convert2integer(code[1]);
  if (i > 12) {
    return false;
  }
  const diDianList = await getDataList('Didian');
  const weizhi = await diDianList.find(item => item.name == didian);
  if (!notUndAndNull(weizhi)) {
    return false;
  }
  const player = await readPlayer(usr_qq);
  // weizhi 结构断言（原 data.didian_list 项目应包含 Price:number）
  const placeUnknown = weizhi;
  if (
    !placeUnknown ||
    typeof placeUnknown !== 'object' ||
    !('Price' in placeUnknown) ||
    !('name' in placeUnknown) ||
    typeof placeUnknown.Price !== 'number'
  ) {
    return false;
  }
  const place = placeUnknown as { name: string; Price: number } & Record<string, unknown>;
  if (player.灵石 < place.Price * 10 * i) {
    Send(Text('没有灵石寸步难行,攒到' + place.Price * 10 * i + '灵石才够哦~'));
    return false;
  }
  if (didian == '大千世界' || didian == '桃花岛') {
    Send(Text('该秘境不支持沉迷哦'));
    return false;
  }
  const keyCount = await existNajieThing(usr_qq, '秘境之匙', '道具');
  if (typeof keyCount === 'number' && keyCount >= i) {
    await addNajieThing(usr_qq, '秘境之匙', '道具', -i);
  } else {
    Send(Text('你没有足够数量的秘境之匙'));
    return false;
  }
  const Price = place.Price * 10 * i;
  await addCoin(usr_qq, -Price);
  const time = i * 10 * 5 + 10; //时间（分钟）
  const action_time = 60000 * time; //持续时间，单位毫秒
  const arr = await startAction(usr_qq, '历练', action_time, {
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
    group_id: e.name == 'message.create' ? e.ChannelId : undefined
  });
  await redis.set(getRedisKey(usr_qq, 'action'), JSON.stringify(arr));
  Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});
import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
export default onResponse(selects, [mw.current, res.current]);
