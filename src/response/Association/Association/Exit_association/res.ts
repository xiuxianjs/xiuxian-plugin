import { Text, useSend } from 'alemonjs';
import { __PATH, keys } from '@src/model/keys';
import { getRandomFromARR, notUndAndNull } from '@src/model/common';
import { getDataJSONParseByKey, readPlayer, setDataJSONStringifyByKey, writePlayer } from '@src/model/';
import { redis } from '@src/model/api';
import type { AssociationDetailData } from '@src/types';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getConfig } from '@src/model';
import { playerEfficiency } from '@src/model';
import { isKeys } from '@src/model/utils/isKeys';
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

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  if (!notUndAndNull(player?.宗门)) {
    return;
  }

  if (!isKeys(player.宗门, ['宗门名称', '职位'])) {
    void Send(Text('宗门信息不完整'));

    return;
  }

  const guildInfo = player.宗门;

  const nowTime = Date.now();

  const cfg = await getConfig('xiuxian', 'xiuxian');

  const timeCfg = cfg.CD.joinassociation; // 分钟

  const joinTuple = guildInfo.time || guildInfo.加入时间;

  if (joinTuple && Array.isArray(joinTuple) && joinTuple.length >= 2) {
    const addTime = joinTuple[1] + 60000 * timeCfg;

    if (addTime > nowTime) {
      void Send(Text(`加入宗门不满${timeCfg}分钟,无法退出`));

      return false;
    }
  }

  const role = guildInfo.职位;

  const ass: AssociationDetailData | null = await getDataJSONParseByKey(keys.association(guildInfo.宗门名称));

  if (!ass) {
    return;
  }

  if (role !== '宗主') {
    const roleList = getRoleList(ass, role).filter(item => item !== userId);

    setRoleList(ass, role, roleList);
    ass.所有成员 = ensureStringArray(ass.所有成员).filter(i => i !== userId);
    void setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);

    delete player.宗门;

    await writePlayer(userId, player);
    //
    await playerEfficiency(userId);

    //
    void Send(Text('退出宗门成功'));
  } else {
    ass.所有成员 = ensureStringArray(ass.所有成员);
    if (ass.所有成员.length < 2) {
      await redis.del(keys.association(guildInfo.宗门名称));
      delete player.宗门;
      player.favorability = 0;
      await writePlayer(userId, player);
      await playerEfficiency(userId);
      void Send(Text('退出宗门成功,退出后宗门空无一人。\n一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'));
    } else {
      ass.所有成员 = ass.所有成员.filter(item => item !== userId);
      delete player.宗门;
      player.favorability = 0;
      await writePlayer(userId, player);
      await playerEfficiency(userId);
      //
      const fz = getRoleList(ass, '副宗主');
      const zl = getRoleList(ass, '长老');
      const nmdz = getRoleList(ass, '内门弟子');
      let randmemberId: string;

      if (fz.length > 0) {
        randmemberId = getRandomFromARR(fz);
      } else if (zl.length > 0) {
        randmemberId = getRandomFromARR(zl);
      } else if (nmdz.length > 0) {
        randmemberId = getRandomFromARR(nmdz);
      } else {
        randmemberId = getRandomFromARR(ass.所有成员);
      }

      const randmember = await readPlayer(randmemberId);

      if (!randmember || !isPlayerGuildInfo(randmember.宗门)) {
        void Send(Text('随机继任者数据错误'));

        return false;
      }

      //
      const rGuild = randmember.宗门;
      const oldList = getRoleList(ass, rGuild.职位).filter(i => i !== randmemberId);

      setRoleList(ass, rGuild.职位, oldList);
      setRoleList(ass, '宗主', [randmemberId]);
      rGuild.职位 = '宗主';

      await writePlayer(randmemberId, randmember);
      await writePlayer(userId, player);
      void setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
      void Send(Text(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`));
    }
  }
});

export default onResponse(selects, [mw.current, res.current]);
