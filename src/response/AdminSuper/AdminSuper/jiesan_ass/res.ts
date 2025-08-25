import { Text, useSend } from 'alemonjs';
import { __PATH, keys, readPlayer, writePlayer } from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { redis } from '@src/model/api';
import type { AssociationDetailData, PlayerData, Player } from '@src/types';

export const regular = /^(#|＃|\/)?解散宗门.*$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);
  {
    if (!e.IsMaster) return false;
    const didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim();
    if (didian == '') {
      Send(Text('请输入要解散的宗门名称'));
      return false;
    }
    const assRaw = await redis.get(keys.association(didian));
    if (!assRaw) {
      Send(Text('该宗门不存在'));
      return false;
    }
    let ass: AssociationDetailData | null = null;
    try {
      ass = JSON.parse(assRaw) as AssociationDetailData;
    } catch {
      Send(Text('宗门数据损坏，无法解散'));
      return false;
    }
    const members = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    for (const qq of members) {
      // 使用readPlayer读取玩家数据
      const player = (await readPlayer(qq)) as (Player & PlayerData) | null;
      if (!player) continue;
      const guild = player.宗门;
      if (
        guild &&
        typeof guild === 'object' &&
        '宗门名称' in guild &&
        (guild as { 宗门名称?: string }).宗门名称 === didian
      ) {
        // 写入前去除宗门字段
        const { 宗门: _ignored, ...rest } = player;
        await writePlayer(qq, rest as Player);
      }
    }
    await redis.del(keys.association(didian));
    Send(Text('解散成功!'));
    return false;
  }
});

export default onResponse(selects, [mw.current, res.current]);
