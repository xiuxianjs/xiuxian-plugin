import { Text, useSend } from 'alemonjs';
import { keys, notUndAndNull, playerEfficiency } from '@src/model/index';
import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?(升级宗门|宗门升级)$/;

const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
}

function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }
  if (!notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门)) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }
  if (player.宗门.职位 !== '宗主' && player.宗门.职位 !== '副宗主') {
    void Send(Text('只有宗主、副宗主可以操作'));

    return false;
  }
  const assRaw = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!assRaw) {
    void Send(Text('宗门数据不存在'));

    return false;
  }
  const ass = assRaw;
  const level = Number(ass.宗门等级 ?? 1);
  const pool = Number(ass.灵石池 ?? 0);
  const topLevel = 宗门人数上限.length;

  if (level >= topLevel) {
    void Send(Text('已经是最高等级宗门'));

    return false;
  }
  const xian = ass.power === 1 ? 10 : 1;
  const need = level * 300000 * xian;

  if (pool < need) {
    void Send(Text(`本宗门目前灵石池中仅有${pool}灵石,当前宗门升级需要${need}灵石,数量不足`));

    return false;
  }
  ass.灵石池 = pool - need;
  ass.宗门等级 = level + 1;
  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
  await setDataJSONStringifyByKey(keys.player(userId), player);
  await playerEfficiency(userId);
  const newCapIndex = Math.max(0, Math.min(宗门人数上限.length - 1, ass.宗门等级 - 1));

  void Send(
    Text(
      `宗门升级成功当前宗门等级为${ass.宗门等级},宗门人数上限提高到:${宗门人数上限[newCapIndex]}`
    )
  );

  return false;
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
