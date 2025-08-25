import { Text, useSend } from 'alemonjs';

import { redis, config } from '@src/model/api';
import { getDataList } from '@src/model/DataList';
import { getRedisKey } from '@src/model/keys';
import { startAction } from '@src/response/actionHelper';
import {
  Go,
  readPlayer,
  notUndAndNull,
  existHunyin,
  addQinmidu,
  addCoin,
  findDaolvQinmidu
} from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?降临秘境.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  const player = await readPlayer(usr_qq);
  let didian = e.MessageText.replace(/^(#|＃|\/)?降临秘境/, '');

  didian = didian.trim();
  const didianList = await getDataList('Didian');
  const weizhiRaw = didianList?.find(item => item.name == didian);

  if (!notUndAndNull(weizhiRaw)) {
    return false;
  }
  const weizhiUnknown = weizhiRaw;
  const guardWeizhi = (v): v is { name: string; Price: number } => {
    if (!v || typeof v !== 'object') { return false; }
    const r = v;

    return typeof r.Price === 'number' && typeof r.name === 'string';
  };

  if (!guardWeizhi(weizhiUnknown)) {
    return false;
  }
  const weizhi = weizhiUnknown;

  if (player.灵石 < weizhi.Price) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));

    return false;
  }
  if (didian == '桃花岛') {
    const exist_B = await existHunyin(usr_qq);

    if (!exist_B) {
      Send(Text('还请少侠找到道侣之后再来探索吧'));

      return false;
    }
    const qinmidu = await findDaolvQinmidu(usr_qq);

    if (typeof qinmidu === 'number' && qinmidu < 550) {
      Send(Text('少侠还是先和道侣再联络联络感情吧'));

      return false;
    }
    await addQinmidu(usr_qq, exist_B, -50);
  }
  const Price = weizhi.Price;

  await addCoin(usr_qq, -Price);
  const cf = await config.getConfig('xiuxian', 'xiuxian');
  const time = cf.CD.secretplace; // 时间（分钟）
  const action_time = 60000 * time; // 持续时间，单位毫秒
  const arr = await startAction(usr_qq, '历练', action_time, {
    shutup: '1',
    working: '1',
    Place_action: '0',
    Place_actionplus: '1',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    plant: '1',
    mine: '1',
    Place_address: weizhi,
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  });

  await redis.set(getRedisKey(String(usr_qq), 'action'), JSON.stringify(arr));
  Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
