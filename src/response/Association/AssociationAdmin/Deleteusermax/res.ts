import { Text, useSend } from 'alemonjs';

import { keys, notUndAndNull, playerEfficiency } from '@src/model/index';
import type { Player } from '@src/types';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?逐出.*$/;

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
    return false;
  }

  const member_qq = e.MessageText.replace(/^(#|＃|\/)?逐出/, '').trim();

  if (!member_qq) {
    void Send(Text('请输入要逐出成员的QQ'));

    return false;
  }
  if (usr_qq === member_qq) {
    void Send(Text('不能踢自己'));

    return false;
  }
  const playerB = await getDataJSONParseByKey(keys.player(member_qq));

  if (!playerB) {
    return false;
  }
  if (!playerB || !notUndAndNull(playerB.宗门) || !isPlayerGuildRef(playerB.宗门)) {
    void Send(Text('对方尚未加入宗门'));

    return false;
  }
  const assRaw = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
  const bssRaw = await getDataJSONParseByKey(keys.association(playerB.宗门.宗门名称));

  if (!assRaw || !bssRaw) {
    return false;
  }
  const ass = assRaw;
  const bss = bssRaw;

  if (ass.宗门名称 !== bss.宗门名称) {
    return false;
  }

  const actorRole = player.宗门.职位;
  const targetRole = playerB.宗门.职位;
  const removeMember = () => {
    const roleList = bss[targetRole];

    if (Array.isArray(roleList)) {
      bss[targetRole] = roleList.filter(q => q !== member_qq);
    }
    bss.所有成员 = Array.isArray(bss.所有成员) ? bss.所有成员.filter(q => q !== member_qq) : [];
    delete (playerB as Player & { 宗门? }).宗门;
  };

  if (actorRole === '宗主') {
    removeMember();
    await setDataJSONStringifyByKey(keys.association(bss.宗门名称), bss);
    await setDataJSONStringifyByKey(keys.player(member_qq), playerB);
    await playerEfficiency(member_qq);
    void Send(Text('已踢出！'));

    return false;
  }
  if (actorRole === '副宗主') {
    if (targetRole === '宗主') {
      void Send(Text('你没权限'));

      return false;
    }
    if (targetRole === '长老' || targetRole === '副宗主') {
      void Send(Text(`宗门${targetRole}任免请上报宗主！`));

      return false;
    }
    removeMember();
    await setDataJSONStringifyByKey(keys.association(bss.宗门名称), bss);
    await setDataJSONStringifyByKey(keys.player(member_qq), playerB);
    await playerEfficiency(member_qq);
    void Send(Text('已踢出！'));

    return false;
  }
  if (actorRole === '长老') {
    if (targetRole === '宗主' || targetRole === '副宗主') {
      void Send(Text('造反啦？'));

      return false;
    }
    if (targetRole === '长老') {
      void Send(Text(`宗门${targetRole}任免请上报宗主！`));

      return false;
    }
    removeMember();
    await setDataJSONStringifyByKey(keys.association(bss.宗门名称), bss);
    await setDataJSONStringifyByKey(keys.player(member_qq), playerB);
    await playerEfficiency(member_qq);
    void Send(Text('已踢出！'));

    return false;
  }

  // 其它身份无权限
  return false;
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
