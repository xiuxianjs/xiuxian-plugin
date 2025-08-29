import { Text, useSend } from 'alemonjs';
import { keys } from '@src/model/index';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?查看护宗大阵$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!isKeys(player['宗门'], ['宗门名称', '职位'])) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }

  const playerGuild = player['宗门'];

  const assRaw = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));

  if (!assRaw || !isKeys(assRaw, ['宗门名称', '大阵血量'])) {
    void Send(Text('宗门数据不存在'));

    return false;
  }

  const ass = assRaw;
  const hp = typeof ass.大阵血量 === 'number' ? ass.大阵血量 : 0;

  void Send(Text(`护宗大阵血量:${hp}`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
