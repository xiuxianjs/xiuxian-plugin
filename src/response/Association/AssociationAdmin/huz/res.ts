import { Text, useSend } from 'alemonjs';
import { keys, notUndAndNull } from '@src/model/index';
import type { AssociationDetailData } from '@src/types';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?查看护宗大阵$/;

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isAssDetail(v): v is AssociationDetailData {
  return !!v && typeof v === 'object' && '宗门名称' in v;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const player = await getDataJSONParseByKey(keys.player(usr_qq));

  if (!player) { return false; }
  if (
    // !player ||
    !notUndAndNull(player.宗门)
    || !isPlayerGuildRef(player.宗门)
  ) {
    Send(Text('你尚未加入宗门'));

    return false;
  }
  const assRaw = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!assRaw || !isAssDetail(assRaw)) {
    Send(Text('宗门数据不存在'));

    return;
  }
  const hp = typeof assRaw.大阵血量 === 'number' ? assRaw.大阵血量 : 0;

  Send(Text(`护宗大阵血量:${hp}`));

  return false;
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
