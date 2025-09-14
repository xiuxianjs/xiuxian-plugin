import { Text, useSend } from 'alemonjs';
import { __PATH, keysByPath, readPlayer, existplayer, keys } from '@src/model/index';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?入驻洞天.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const player = await readPlayer(userId);

  if (!player || !isKeys(player['宗门'], ['宗门名称', '职位'])) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }

  const playerGuild = player['宗门'] as any;
  const role = playerGuild.职位;

  if (role !== '宗主') {
    void Send(Text('只有宗主可以操作'));

    return false;
  }

  const assRaw = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));

  if (!assRaw || !isKeys(assRaw, ['宗门名称', '宗门驻地', '宗门建设等级', '大阵血量', '所有成员'])) {
    void Send(Text('宗门数据不存在'));

    return false;
  }

  const ass = assRaw as any;

  const blessedName = e.MessageText.replace(/^(#|＃|\/)?入驻洞天/, '').trim();

  if (!blessedName) {
    void Send(Text('请在指令后补充洞天名称'));

    return false;
  }

  const blessRaw = await getDataList('Bless');
  const dongTan = blessRaw?.find(i => isKeys(i, ['name']) && i.name === blessedName);

  if (!dongTan) {
    void Send(Text('未找到该洞天'));

    return false;
  }

  if (ass.宗门驻地 === dongTan.name) {
    void Send(Text('该洞天已是你宗门的驻地'));

    return false;
  }

  const guildNames = await keysByPath(__PATH.association);
  const assDatas = await Promise.all(guildNames.map(n => getDataJSONParseByKey(keys.association(n))));
  const assListRaw = assDatas.filter(Boolean);

  for (const other of assListRaw) {
    if (!other || !isKeys(other, ['power', '宗门名称', '宗门驻地', '宗门建设等级', '大阵血量', '所有成员'])) {
      continue;
    }

    const otherData = other as any;

    if (otherData.宗门名称 === ass.宗门名称) {
      continue;
    }

    if (otherData.宗门驻地 !== dongTan.name) {
      continue;
    }

    const attackMembers = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    const defendMembers = Array.isArray(otherData.所有成员) ? otherData.所有成员 : [];

    let attackPower = 0;

    for (const m of attackMembers) {
      const memberData = await readPlayer(m);

      if (memberData) {
        const val = Math.trunc(memberData.攻击 + memberData.血量上限 * 0.5);

        attackPower += val;
      }
    }

    let defendPower = 0;

    for (const m of defendMembers) {
      const memberData = await readPlayer(m);

      if (memberData) {
        const val = Math.trunc(memberData.防御 + memberData.血量上限 * 0.5);

        defendPower += val;
      }
    }

    const randA = Math.random();
    const randB = Math.random();

    if (randA > 0.75) {
      attackPower = Math.trunc(attackPower * 1.1);
    } else if (randA < 0.25) {
      attackPower = Math.trunc(attackPower * 0.9);
    }

    if (randB > 0.75) {
      defendPower = Math.trunc(defendPower * 1.1);
    } else if (randB < 0.25) {
      defendPower = Math.trunc(defendPower * 0.9);
    }

    const ass阵血 = Math.max(0, Number(ass.大阵血量 ?? 0));
    const other阵血 = Math.max(0, Number(otherData.大阵血量 ?? 0));
    const ass建设 = Math.max(0, Number(ass.宗门建设等级 ?? 0));
    const other建设 = Math.max(0, Number(otherData.宗门建设等级 ?? 0));

    attackPower += ass建设 * 100 + Math.trunc(ass阵血 / 2);
    defendPower += other建设 * 100 + other阵血;

    if (attackPower > defendPower) {
      const oldSite = ass.宗门驻地;

      otherData.宗门驻地 = oldSite;
      ass.宗门驻地 = dongTan.name;
      ass.宗门建设等级 = other建设;
      otherData.宗门建设等级 = Math.max(0, other建设 - 10);
      otherData.大阵血量 = 0;

      await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
      await setDataJSONStringifyByKey(keys.association(otherData.宗门名称), otherData);

      void Send(Text(`洞天被占据！${ass.宗门名称} 发动进攻 (战力${attackPower}) 攻破 ${otherData.宗门名称} (防御${defendPower})，夺取了 ${dongTan.name}`));
    } else {
      await setDataJSONStringifyByKey(keys.association(otherData.宗门名称), otherData);

      void Send(Text(`${ass.宗门名称} 进攻 ${otherData.宗门名称} 失败 (进攻${attackPower} / 防御${defendPower})`));
    }

    return false;
  }

  ass.宗门驻地 = dongTan.name;
  ass.宗门建设等级 = 0;

  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);

  void Send(Text(`入驻成功，${ass.宗门名称} 当前驻地为：${dongTan.name}`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
