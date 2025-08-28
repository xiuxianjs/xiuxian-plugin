import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { notUndAndNull, shijianc, existplayer, readPlayer, writePlayer } from '@src/model/index';
import { getLastsign_Asso, isNotMaintenance } from '../../ass';
import type { AssociationDetailData, Player, JSONValue } from '@src/types';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getRedisKey, __PATH } from '@src/model/keys';
export const regular = /^(#|＃|\/)?宗门俸禄$/;

interface DateParts {
  Y: number;
  M: number;
  D: number;
  h: number;
  m: number;
  s: number;
}
function isDateParts(v): v is DateParts {
  return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}
function isGuildInfo(v): v is { 宗门名称: string; 职位: string } {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function serializePlayer(p: Player): Record<string, JSONValue> {
  const r: Record<string, JSONValue> = {};

  for (const [k, v] of Object.entries(p)) {
    if (typeof v === 'function') {
      continue;
    }
    if (v && typeof v === 'object') {
      r[k] = JSON.parse(JSON.stringify(v));
    } else {
      r[k] = v as JSONValue;
    }
  }

  return r;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const player = await readPlayer(userId);

  if (!player || !notUndAndNull(player.宗门) || !isGuildInfo(player.宗门)) {
    return false;
  }
  const assData = await redis.get(`${__PATH.association}:${player.宗门.宗门名称}`);

  if (!assData) {
    void Send(Text('宗门数据异常'));

    return;
  }
  const assRaw = JSON.parse(assData);

  if (assRaw === 'error') {
    void Send(Text('宗门数据不存在或已损坏'));

    return false;
  }
  const ass = assRaw as AssociationDetailData;
  const ismt = isNotMaintenance(ass);

  if (ismt) {
    void Send(Text('宗门尚未维护，快找宗主维护宗门'));

    return false;
  }
  const nowTime = Date.now();
  const Today = shijianc(nowTime);
  const lastsign_time = await getLastsign_Asso(userId);

  if (isDateParts(Today) && isDateParts(lastsign_time)) {
    if (Today.Y === lastsign_time.Y && Today.M === lastsign_time.M && Today.D === lastsign_time.D) {
      void Send(Text('今日已经领取过了'));

      return false;
    }
  }
  const role = player.宗门.职位;

  if (role === '外门弟子' || role === '内门弟子') {
    void Send(Text('没有资格领取俸禄'));

    return false;
  }
  let n = 1;

  if (role === '长老') {
    n = 3;
  } else if (role === '副宗主') {
    n = 4;
  } else if (role === '宗主') {
    n = 5;
  }

  interface ExtendedAss extends AssociationDetailData {
    宗门建设等级?: number;
    宗门等级?: number;
  }
  const exAss = ass as ExtendedAss;
  const buildLevel = Number(exAss.宗门建设等级 ?? 0);
  const guildLevel = Number(exAss.宗门等级 ?? 0);
  const fuli = Math.trunc(buildLevel * 2000);
  let gift_lingshi = Math.trunc(guildLevel * 1200 * n + fuli);

  gift_lingshi = Math.trunc(gift_lingshi / 2);
  const pool = Number(ass.灵石池 || 0);

  if (pool - gift_lingshi < 0) {
    void Send(Text('宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧'));

    return false;
  }
  ass.灵石池 = pool - gift_lingshi;
  player.灵石 += gift_lingshi;
  await redis.set(getRedisKey(userId, 'lastsign_Asso_time'), nowTime);
  await writePlayer(userId, serializePlayer(player));
  await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass));
  void Send(Text(`宗门俸禄领取成功,获得了${gift_lingshi}灵石`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
