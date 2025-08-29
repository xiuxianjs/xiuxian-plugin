import { Text, useSend } from 'alemonjs';
import { redis } from '@src/model/api';
import { notUndAndNull, shijianc, addNajieThing } from '@src/model/index';
import type { AssociationDetailData } from '@src/types';
import { getDataList } from '@src/model/DataList';

import { selects } from '@src/response/mw';
import { getRedisKey, keys } from '@src/model/keys';
export const regular = /^(#|＃|\/)?神兽赐福$/;

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
interface ExtAss extends AssociationDetailData {
  宗门神兽?: string;
}
function isExtAss(v): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v;
}
interface DateParts {
  Y: number;
  M: number;
  D: number;
}
function isDateParts(v): v is DateParts {
  return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}
interface NamedClassItem {
  name: string;
  class?: string;
}
function toNamedList(arr): NamedClassItem[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr
    .map(it => {
      if (it && typeof it === 'object') {
        const o = it;

        if (typeof o.name === 'string') {
          return {
            name: o.name,
            class: typeof o.class === 'string' ? o.class : undefined
          };
        }
      }

      return undefined;
    })
    .filter(v => v !== undefined) as NamedClassItem[];
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return;
  }
  if (!notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门)) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }
  const assRaw = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (assRaw === 'error' || !isExtAss(assRaw)) {
    void Send(Text('宗门数据不存在'));

    return false;
  }
  const ass = assRaw;

  if (!ass.宗门神兽 || ass.宗门神兽 === '0' || ass.宗门神兽 === '无') {
    void Send(Text('你的宗门还没有神兽的护佑，快去召唤神兽吧'));

    return false;
  }

  const nowTime = Date.now();
  const Today = shijianc(nowTime);
  const lastsign_time = await getLastsign_Bonus(userId);

  if (isDateParts(Today) && isDateParts(lastsign_time)) {
    if (Today.Y === lastsign_time.Y && Today.M === lastsign_time.M && Today.D === lastsign_time.D) {
      void Send(Text('今日已经接受过神兽赐福了，明天再来吧'));

      return false;
    }
  }

  await redis.set(getRedisKey(userId, 'getLastsign_Bonus'), String(nowTime));

  const random = Math.random();

  if (random <= 0.7) {
    void Send(Text(`${ass.宗门神兽}闭上了眼睛，表示今天不想理你`));

    return false;
  }

  const beast = ass.宗门神兽;

  // const data = {
  //   qilin: await getDataList('qilin'),
  //   qinlong: await getDataList('qinlong'),
  //   xuanwu: await getDataList('xuanwu'),
  //   zhuque: await getDataList('zhuque'),
  //   baihu: await getDataList('baihu'),
  //   Danyao: await getDataList('Danyao'),
  //   Gongfa: await getDataList('Gongfa'),
  //   Equipment: await getDataList('Equipment')
  // }

  const qilinData = await getDataList('Qilin');
  const qinlongData = await getDataList('Qinglong');
  const xuanwuData = await getDataList('Xuanwu');
  const danyaoData = await getDataList('Danyao');
  const gongfaData = await getDataList('Gongfa');
  const equipmentData = await getDataList('Equipment');

  const highProbLists: Record<string, NamedClassItem[]> = {
    麒麟: toNamedList(qilinData),
    青龙: toNamedList(qinlongData),
    玄武: toNamedList(xuanwuData),
    朱雀: toNamedList(xuanwuData), // 原逻辑同 xuanwu
    白虎: toNamedList(xuanwuData)
  };
  const normalLists: Record<string, NamedClassItem[]> = {
    麒麟: toNamedList(danyaoData),
    青龙: toNamedList(gongfaData),
    玄武: toNamedList(equipmentData),
    朱雀: toNamedList(equipmentData), // 原逻辑同 equipment
    白虎: toNamedList(equipmentData)
  };
  const highList = highProbLists[beast] || [];
  const normalList = normalLists[beast] || [];

  if (!highList.length && !normalList.length) {
    void Send(Text('神兽奖励配置缺失'));

    return false;
  }

  const randomB = Math.random();
  const fromList = randomB > 0.9 && highList.length ? highList : normalList;
  const item = fromList[Math.floor(Math.random() * fromList.length)];

  if (!item) {
    void Send(Text('本次赐福意外失败'));

    return false;
  }
  const category = item.class && typeof item.class === 'string' ? item.class : '道具';

  await addNajieThing(userId, item.name, category, 1);
  if (randomB > 0.9) {
    void Send(Text(`看见你来了, ${beast} 很高兴，仔细挑选了 ${item.name} 给你`));
  } else {
    void Send(Text(`${beast} 今天心情不错，随手丢给了你 ${item.name}`));
  }

  return false;
});

async function getLastsign_Bonus(userId: string): Promise<DateParts | null> {
  const time = await redis.get(getRedisKey(userId, 'getLastsign_Bonus'));

  if (time) {
    const parts = shijianc(parseInt(time, 10));

    if (isDateParts(parts)) {
      return parts;
    }
  }

  return null;
}
import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
