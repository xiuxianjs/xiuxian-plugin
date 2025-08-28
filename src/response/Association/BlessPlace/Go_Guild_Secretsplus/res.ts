import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { getDataList } from '@src/model/DataList';
import { Go, notUndAndNull } from '@src/model/common';
import { convert2integer } from '@src/model/utils/number';
import { readPlayer } from '@src/model/xiuxian_impl';
import { existNajieThing, addNajieThing } from '@src/model/najie';
import { addCoin } from '@src/model/economy';
import type { Player } from '@src/types';

import { selects } from '@src/response/mw';
import { getRedisKey, keys } from '@src/model/keys';
export const regular = /^(#|＃|\/)?沉迷宗门秘境.*$/;

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const flag = await Go(e);

  if (!flag) {
    return false;
  }

  const player = await readPlayer(usr_qq);

  if (!player?.宗门 || !isPlayerGuildRef(player.宗门)) {
    void Send(Text('请先加入宗门'));

    return false;
  }
  const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!ass) {
    void Send(Text('宗门数据不存在'));

    return false;
  }
  if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
    void Send(Text('你的宗门还没有驻地，不能探索秘境哦'));

    return false;
  }

  const tail = e.MessageText.replace(/^(#|＃|\/)?沉迷宗门秘境/, '').trim();

  if (!tail) {
    void Send(Text('格式: 沉迷宗门秘境秘境名*次数 (1-12)'));

    return false;
  }
  const [didianRaw, timesRaw] = tail.split('*');
  const didian = (didianRaw || '').trim();
  const i = await convert2integer(timesRaw);

  if (!didian) {
    void Send(Text('请提供秘境名称'));

    return false;
  }
  if (!Number.isFinite(i) || i <= 0 || i > 12) {
    void Send(Text('次数需在 1-12 之间'));

    return false;
  }
  const listRaw = await getDataList('GuildSecrets');
  const weizhi = listRaw?.find(item => item.name === didian);

  if (!notUndAndNull(weizhi)) {
    void Send(Text('未找到该宗门秘境'));

    return false;
  }

  const keyNum = await existNajieThing(usr_qq, '秘境之匙', '道具');

  if (!keyNum || keyNum < i) {
    void Send(Text('你没有足够数量的秘境之匙'));

    return false;
  }

  const priceSingle = Math.max(0, Number(weizhi.Price || 0));

  if (priceSingle <= 0) {
    void Send(Text('秘境费用配置异常'));

    return false;
  }
  const Price = priceSingle * i * 10;
  const playerCoin = Number(player.灵石 || 0);

  if (playerCoin < Price) {
    void Send(Text(`没有灵石寸步难行, 需要${Price}灵石`));

    return false;
  }

  await addNajieThing(usr_qq, '秘境之匙', '道具', -i);

  const guildGain = Math.trunc(Price * 0.05);

  ass.灵石池 = Math.max(0, Number(ass.灵石池 || 0)) + guildGain;
  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);

  await addCoin(usr_qq, -Price);
  const time = i * 10 * 5 + 10; // 分钟
  const action_time = 60000 * time;
  const arr = {
    action: '历练',
    end_time: Date.now() + action_time,
    time: action_time,
    shutup: '1',
    working: '1',
    Place_action: '1',
    Place_actionplus: '0',
    power_up: '1',
    cishu: 10 * i,
    Place_address: weizhi,
    XF: ass.power,
    group_id: e.name === 'message.create' ? e.ChannelId : undefined
  };

  redis.set(getRedisKey(usr_qq, 'action'), JSON.stringify(arr));
  void Send(
    Text(
      `开始沉迷探索 ${didian} 宗门秘境 * ${i} 次，共耗时 ${time} 分钟 (消耗${Price}灵石，上缴宗门${guildGain}灵石)`
    )
  );

  return false;
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
