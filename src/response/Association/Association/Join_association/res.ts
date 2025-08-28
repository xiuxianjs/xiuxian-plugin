import { Text, useSend } from 'alemonjs';
import { getIoRedis } from '@alemonjs/db';

import { getDataList } from '@src/model/DataList';
import { keys } from '@src/model/keys';
import {
  notUndAndNull,
  timestampToTime,
  playerEfficiency,
  existplayer,
  readPlayer,
  writePlayer
} from '@src/model/index';
import type { Player, JSONValue } from '@src/types';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
export const regular = /^(#|＃|\/)?加入宗门.*$/;

const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];

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

interface PlayerGuildEntry {
  宗门名称: string;
  职位: string;
  time?: [string, number];
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }
  if (notUndAndNull(player.宗门)) {
    return false;
  }
  if (!notUndAndNull(player.level_id)) {
    void Send(Text('请先#同步信息'));

    return false;
  }
  const levelList = await getDataList('Level1');
  const levelEntry = levelList.find(
    (item: { level_id: number }) => item.level_id === player.level_id
  );

  if (!levelEntry) {
    void Send(Text('境界数据缺失'));

    return false;
  }
  const now_level_id = levelEntry.level_id;
  const association_name = e.MessageText.replace(/^(#|＃|\/)?加入宗门/, '').trim();

  if (!association_name) {
    void Send(Text('请输入宗门名称'));

    return false;
  }
  const redis = getIoRedis();
  const ifexistass = await redis.exists(keys.association(association_name));

  if (!ifexistass) {
    void Send(Text('这方天地不存在' + association_name));

    return false;
  }
  const ass = await getDataJSONParseByKey(keys.association(association_name));

  if (!ass) {
    void Send(Text('没有这个宗门'));

    return;
  }

  ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
  ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : [];
  const guildLevel = Number(ass.宗门等级 ?? 1);

  if (now_level_id >= 42 && ass.power === 0) {
    void Send(Text('仙人不可下界！'));

    return false;
  }
  if (now_level_id < 42 && ass.power === 1) {
    void Send(Text('你在仙界吗？就去仙界宗门'));

    return false;
  }

  if (Number(ass.最低加入境界 || 0) > now_level_id) {
    const levelList = await getDataList('Level1');
    const levelEntry = levelList.find(
      (item: { level_id: number }) => item.level_id === ass.最低加入境界
    );
    const level = levelEntry?.level || '未知境界';

    void Send(Text(`${association_name}招收弟子的最低加入境界要求为:${level},当前未达到要求`));

    return false;
  }
  const capIndex = Math.max(0, Math.min(宗门人数上限.length - 1, guildLevel - 1));
  const mostmem = 宗门人数上限[capIndex];
  const nowmem = ass.所有成员.length;

  if (mostmem <= nowmem) {
    void Send(Text(`${association_name}的弟子人数已经达到目前等级最大,无法加入`));

    return false;
  }
  const nowTime = Date.now();
  const date = timestampToTime(nowTime);

  player.宗门 = {
    宗门名称: association_name,
    职位: '外门弟子',
    time: [date, nowTime]
  } as PlayerGuildEntry;
  ass.所有成员.push(userId);
  ass.外门弟子.push(userId);
  await playerEfficiency(userId);
  await writePlayer(userId, serializePlayer(player) as unknown as Player);
  await setDataJSONStringifyByKey(keys.association(association_name), ass);
  void Send(Text(`恭喜你成功加入${association_name}`));
});

export default onResponse(selects, [mw.current, res.current]);
