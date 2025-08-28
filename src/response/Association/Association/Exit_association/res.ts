import { Text, useSend } from 'alemonjs';
import { __PATH, keys } from '@src/model/keys';
import { getRandomFromARR, notUndAndNull } from '@src/model/common';
import { existplayer, readPlayer, writePlayer } from '@src/model/xiuxian_impl';
import { playerEfficiency } from '@src/model/efficiency';
import { redis } from '@src/model/api';
import type { AssociationDetailData, Player, JSONValue } from '@src/types';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getConfig } from '@src/model';
export const regular = /^(#|＃|\/)?退出宗门$/;

// 成员宗门信息运行期形状（旧数据兼容）
interface PlayerGuildInfo {
  宗门名称: string;
  职位: string;
  加入时间?: [number, number];
  time?: [number, number];
}

function isPlayerGuildInfo(val): val is PlayerGuildInfo {
  return !!val && typeof val === 'object' && '宗门名称' in val && '职位' in val;
}

type RoleKey = '宗主' | '副宗主' | '长老' | '内门弟子' | string;
function getRoleList(ass: AssociationDetailData, role: RoleKey): string[] {
  const raw = ass[role];

  return Array.isArray(raw) ? raw.filter(i => typeof i === 'string') : [];
}
function setRoleList(ass: AssociationDetailData, role: RoleKey, list: string[]): void {
  ass[role] = list;
}

function ensureStringArray(v): string[] {
  return Array.isArray(v) ? v.filter(i => typeof i === 'string') : [];
}

function serializePlayer(p: Player): Record<string, JSONValue> {
  const result: Record<string, JSONValue> = {};

  for (const [k, v] of Object.entries(p)) {
    if (typeof v === 'function') {
      continue;
    }
    // 简单递归：仅处理对象/数组基础可序列化部分
    if (v && typeof v === 'object') {
      if (Array.isArray(v)) {
        result[k] = v.filter(x => typeof x !== 'function') as JSONValue;
      } else {
        const obj: Record<string, JSONValue> = {};

        for (const [ik, iv] of Object.entries(v)) {
          if (typeof iv === 'function') {
            continue;
          }
          if (iv && typeof iv === 'object') {
            // 深层再做一次浅拷贝（避免过度复杂）
            obj[ik] = JSON.parse(JSON.stringify(iv));
          } else {
            obj[ik] = iv as JSONValue;
          }
        }
        result[k] = obj as JSONValue;
      }
    } else {
      result[k] = v as JSONValue;
    }
  }

  return result;
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
  if (!notUndAndNull(player.宗门)) {
    return false;
  }
  if (!isPlayerGuildInfo(player.宗门)) {
    return false;
  }

  const guildInfo = player.宗门;
  const nowTime = Date.now();
  const timeCfg = (await getConfig('xiuxian', 'xiuxian')).CD.joinassociation; // 分钟
  const joinTuple = guildInfo.time || guildInfo.加入时间;

  if (joinTuple && Array.isArray(joinTuple) && joinTuple.length >= 2) {
    const addTime = joinTuple[1] + 60000 * timeCfg;

    if (addTime > nowTime) {
      void Send(Text(`加入宗门不满${timeCfg}分钟,无法退出`));

      return false;
    }
  }

  const role = guildInfo.职位;
  const assData = await redis.get(`${__PATH.association}:${guildInfo.宗门名称}`);

  if (!assData) {
    void Send(Text('宗门数据异常'));

    return;
  }
  const assRaw = JSON.parse(assData);

  if (assRaw === 'error') {
    void Send(Text('宗门数据错误'));

    return false;
  }
  const ass = assRaw as AssociationDetailData;

  if (role !== '宗主') {
    const roleList = getRoleList(ass, role).filter(item => item !== userId);

    setRoleList(ass, role, roleList);
    ass.所有成员 = ensureStringArray(ass.所有成员).filter(i => i !== userId);
    await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass));
    delete (player as Player & { 宗门? }).宗门;
    await writePlayer(userId, serializePlayer(player));
    await playerEfficiency(userId);
    void Send(Text('退出宗门成功'));
  } else {
    ass.所有成员 = ensureStringArray(ass.所有成员);
    if (ass.所有成员.length < 2) {
      await redis.del(keys.association(guildInfo.宗门名称));
      delete (player as Player & { 宗门? }).宗门;
      await writePlayer(userId, serializePlayer(player));
      await playerEfficiency(userId);
      void Send(
        Text(
          '退出宗门成功,退出后宗门空无一人。\n一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'
        )
      );
    } else {
      ass.所有成员 = ass.所有成员.filter(item => item !== userId);
      delete (player as Player & { 宗门? }).宗门;
      await writePlayer(userId, serializePlayer(player));
      await playerEfficiency(userId);
      const fz = getRoleList(ass, '副宗主');
      const zl = getRoleList(ass, '长老');
      const nmdz = getRoleList(ass, '内门弟子');
      let randmemberId: string;

      if (fz.length > 0) {
        randmemberId = await getRandomFromARR(fz);
      } else if (zl.length > 0) {
        randmemberId = await getRandomFromARR(zl);
      } else if (nmdz.length > 0) {
        randmemberId = await getRandomFromARR(nmdz);
      } else {
        randmemberId = await getRandomFromARR(ass.所有成员);
      }

      const randmember = await readPlayer(randmemberId);

      if (!randmember || !isPlayerGuildInfo(randmember.宗门)) {
        void Send(Text('随机继任者数据错误'));

        return false;
      }
      const rGuild = randmember.宗门;
      const oldList = getRoleList(ass, rGuild.职位).filter(i => i !== randmemberId);

      setRoleList(ass, rGuild.职位, oldList);
      setRoleList(ass, '宗主', [randmemberId]);
      rGuild.职位 = '宗主';
      await writePlayer(randmemberId, serializePlayer(randmember));
      await writePlayer(userId, serializePlayer(player));
      await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass));
      void Send(Text(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`));
    }
  }
  player.favorability = 0;
  await writePlayer(userId, serializePlayer(player));
});

export default onResponse(selects, [mw.current, res.current]);
