import { Text, useSend } from 'alemonjs';
import { getDataJSONParseByKey, readPlayer, setDataJSONStringifyByKey, writePlayer, 宗门灵石池上限 } from '@src/model';

import { __PATH, keys } from '@src/model/keys';
import type { ZongMen } from '@src/types';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石\d+$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  if (!isKeys(player.宗门, ['宗门名称', '职位'])) {
    void Send(Text('宗门信息不完整'));

    return;
  }

  const msg = e.MessageText.replace(/^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石/, '').trim();

  if (!msg) {
    void Send(Text('请输入灵石数量'));

    return;
  }

  const lingshi = Number.parseInt(msg, 10);

  if (!Number.isFinite(lingshi) || lingshi <= 0) {
    void Send(Text('请输入正确的灵石数量'));

    return;
  }

  //
  if (player.灵石 < lingshi) {
    void Send(Text(`你身上只有${player.灵石}灵石,数量不足`));

    return false;
  }
  // const assData = await redis.get(`${__PATH.association}:${player.宗门.宗门名称}`);

  // if (!assData) {
  //   void Send(Text('宗门数据异常'));

  //   return;
  // }
  // const assRaw = JSON.parse(assData);

  // if (assRaw === 'error') {
  //   void Send(Text('宗门数据不存在或已损坏'));

  //   return false;
  // }
  // interface ExtendedAss extends AssociationDetailData {
  //   灵石池?: number;
  //   宗门等级?: number;
  //   power?: number;
  // }
  // const ass = assRaw as ExtendedAss;

  const ass: ZongMen | null = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!ass) {
    void Send(Text('宗门数据不存在或已损坏'));

    return;
  }

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
  player.宗门.lingshi_donate = (player.宗门.lingshi_donate ?? 0) + lingshi;
  player.灵石 -= lingshi;
  await writePlayer(userId, player);
  //
  void setDataJSONStringifyByKey(keys.association(player.宗门.宗门名称), ass);

  //
  void Send(Text(`捐赠成功,你身上还有${player.灵石}灵石,宗门灵石池目前有${ass.灵石池}灵石`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
