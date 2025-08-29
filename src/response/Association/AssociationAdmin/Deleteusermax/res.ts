import { Text, useSend } from 'alemonjs';
import { keys, playerEfficiency } from '@src/model/index';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import type { Player } from '@src/types';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?逐出.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!isKeys(player['宗门'], ['宗门名称', '职位'])) {
    void Send(Text('您尚未加入宗门'));

    return false;
  }

  const playerGuild = player.宗门;

  const memberQq = e.MessageText.replace(/^(#|＃|\/)?逐出/, '').trim();

  if (!memberQq) {
    void Send(Text('请输入要逐出成员的QQ'));

    return false;
  }

  if (userId === memberQq) {
    void Send(Text('不能踢自己'));

    return false;
  }

  const playerB = await getDataJSONParseByKey(keys.player(memberQq));

  if (!playerB) {
    void Send(Text('目标玩家不存在'));

    return false;
  }

  if (!isKeys(playerB['宗门'], ['宗门名称', '职位'])) {
    void Send(Text('对方尚未加入宗门'));

    return false;
  }

  const playerBGuild = playerB.宗门;

  const assRaw = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
  const bssRaw = await getDataJSONParseByKey(keys.association(playerBGuild.宗门名称));

  if (!assRaw || !bssRaw) {
    void Send(Text('宗门数据异常'));

    return false;
  }

  const ass = assRaw;
  const bss = bssRaw;

  if (ass.宗门名称 !== bss.宗门名称) {
    void Send(Text('不是同一个宗门的'));

    return false;
  }

  const actorRole = playerGuild.职位;
  const targetRole = playerBGuild.职位;

  const removeMember = () => {
    const roleList = bss[targetRole];

    if (Array.isArray(roleList)) {
      bss[targetRole] = roleList.filter(q => q !== memberQq);
    }

    bss.所有成员 = Array.isArray(bss.所有成员) ? bss.所有成员.filter(q => q !== memberQq) : [];
    delete (playerB as Player & { 宗门? }).宗门;
  };

  if (actorRole === '宗主') {
    removeMember();
    await setDataJSONStringifyByKey(keys.association(bss.宗门名称), bss);
    await setDataJSONStringifyByKey(keys.player(memberQq), playerB);
    await playerEfficiency(memberQq);

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
    await setDataJSONStringifyByKey(keys.player(memberQq), playerB);
    await playerEfficiency(memberQq);

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
    await setDataJSONStringifyByKey(keys.player(memberQq), playerB);
    await playerEfficiency(memberQq);

    void Send(Text('已踢出！'));

    return false;
  }

  void Send(Text('您没有权限执行此操作'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
