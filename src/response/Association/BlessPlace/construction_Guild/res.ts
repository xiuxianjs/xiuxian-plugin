import { Text, useSend } from 'alemonjs';

import { keys, notUndAndNull } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?建设宗门$/;

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
  const player = await getDataJSONParseByKey(keys.player(usr_qq));

  if (!player) {
    return false;
  }
  if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门)) {
    Send(Text('你尚未加入宗门'));

    return false;
  }

  // 可选：限制权限（只有宗主/副宗主/长老）
  if (!['宗主', '副宗主', '长老'].includes(player.宗门.职位)) {
    Send(Text('权限不足'));

    return false;
  }
  const assRaw = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!assRaw) {
    Send(Text('宗门数据不存在'));

    return false;
  }
  const ass = assRaw;

  if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
    Send(Text('你的宗门还没有驻地，无法建设宗门'));

    return false;
  }
  let level = Number(ass.宗门建设等级 || 0);

  if (level < 0) {
    level = 0;
  }
  ass.宗门建设等级 = level;
  const pool = Math.max(0, Number(ass.灵石池 || 0));

  ass.灵石池 = pool;
  const cost = Math.trunc(level * 10000);

  if (pool < cost) {
    Send(Text(`宗门灵石池不足，还需[${cost}]灵石`));

    return false;
  }
  ass.灵石池 = pool - cost;
  const add = Math.trunc(Number(player.level_id || 0) / 7) + 1;

  ass.宗门建设等级 = level + add;
  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
  await setDataJSONStringifyByKey(keys.player(usr_qq), player);
  Send(Text(`成功消耗 宗门${cost}灵石 建设宗门，增加了${add}点建设度,当前宗门建设等级为${ass.宗门建设等级}`));

  return false;
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
