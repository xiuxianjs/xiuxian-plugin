import { Text, useSend } from 'alemonjs';

import { notUndAndNull } from '@src/model/common';
import { existplayer, readPlayer, writePlayer } from '@src/model';
import { redis } from '@src/model/api';
import { __PATH } from '@src/model/keys';
import type { AssociationDetailData } from '@src/types';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石\d+$/;
const 宗门灵石池上限 = [2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 25000000, 30000000];

interface GuildInfo {
  宗门名称: string;
  职位: string;
  lingshi_donate?: number;
}
function isGuildInfo(v): v is GuildInfo {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
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

  const reg = /^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石/;
  const msg = e.MessageText.replace(reg, '').trim();

  if (!msg) {
    void Send(Text('请输入灵石数量'));

    return false;
  }
  const lingshi = Number.parseInt(msg, 10);

  if (!Number.isFinite(lingshi) || lingshi <= 0) {
    void Send(Text('请输入正确的灵石数量'));

    return false;
  }
  if (player.灵石 < lingshi) {
    void Send(Text(`你身上只有${player.灵石}灵石,数量不足`));

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
  interface ExtendedAss extends AssociationDetailData {
    灵石池?: number;
    宗门等级?: number;
    power?: number;
  }
  const ass = assRaw as ExtendedAss;
  const guildLevel = Number(ass.宗门等级 ?? 1);
  const pool = Number(ass.灵石池 ?? 0);
  const xf = ass.power === 1 ? 10 : 1;
  const capIndex = Math.max(0, Math.min(宗门灵石池上限.length - 1, guildLevel - 1));
  const cap = 宗门灵石池上限[capIndex] * xf;

  if (pool + lingshi > cap) {
    const remain = cap - pool;

    void Send(Text(`${ass.宗门名称}的灵石池最多还能容纳${remain}灵石,请重新捐赠`));

    return false;
  }
  ass.灵石池 = pool + lingshi;
  player.宗门.lingshi_donate = (player.宗门.lingshi_donate || 0) + lingshi;
  player.灵石 -= lingshi;
  await writePlayer(userId, player);
  await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass));
  void Send(Text(`捐赠成功,你身上还有${player.灵石}灵石,宗门灵石池目前有${ass.灵石池}灵石`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
