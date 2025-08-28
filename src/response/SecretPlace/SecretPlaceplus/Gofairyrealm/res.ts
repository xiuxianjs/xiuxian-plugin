import { getRedisKey } from '@src/model/keys';
import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { startAction } from '@src/model/actionHelper';
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
import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
export const regular = /^(#|＃|\/)?沉迷仙境.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷仙境/, '');
  const code = didian.split('*');

  didian = code[0];
  const i = await convert2integer(code[1]);

  if (i > 12) {
    return false;
  }
  const fairyrealmList = await getDataList('FairyRealm');
  const weizhiRaw = await fairyrealmList.find(item => item.name === didian);

  if (!notUndAndNull(weizhiRaw)) {
    return false;
  }
  const weizhiUnknown = weizhiRaw;
  const guardWeizhi = (v): v is { name: string; Price: number } => {
    if (!v || typeof v !== 'object') {
      return false;
    }
    const r = v;

    return typeof r.Price === 'number' && typeof r.name === 'string';
  };

  if (!guardWeizhi(weizhiUnknown)) {
    return false;
  }
  const weizhi = weizhiUnknown;
  let player = await readPlayer(usr_qq);

  if (player.灵石 < weizhi.Price * 10 * i) {
    void Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'));

    return false;
  }
  // 当前境界 id
  if (didian === '仙界矿场') {
    void Send(Text('打工本不支持沉迷哦'));

    return false;
  }
  player = await readPlayer(usr_qq);
  const now_level_id = (await getDataList('Level1')).find(
    item => item.level_id === player.level_id
  ).level_id;

  if (now_level_id < 42 && player.lunhui === 0) {
    return false;
  }
  const number = await existNajieThing(usr_qq, '秘境之匙', '道具');

  if (typeof number === 'number' && number >= i) {
    await addNajieThing(usr_qq, '秘境之匙', '道具', -i);
  } else {
    void Send(Text('你没有足够数量的秘境之匙'));

    return false;
  }
  const Price = weizhi.Price * 10 * i;

  await addCoin(usr_qq, -Price);
  const time = i * 10 * 5 + 10; // 时间（分钟）
  const action_time = 60000 * time; // 持续时间，单位毫秒
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
    cishu: 10 * i,
    Place_address: weizhi,
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  });

  await redis.set(getRedisKey(usr_qq, 'action'), JSON.stringify(arr));
  void Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'));
});

export default onResponse(selects, [mw.current, res.current]);
