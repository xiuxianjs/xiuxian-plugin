import { Text, useSend } from 'alemonjs';
import { getDataList } from '@src/model/DataList';
import { keys } from '@src/model/keys';
import { timestampToTime, readPlayer, writePlayer, 宗门人数上限, notUndAndNull } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { playerEfficiency } from '@src/model';
import { redis } from '@src/model/api';
import type { AssociationAuditRecord } from '@src/types/ass';
export const regular = /^(#|＃|\/)?加入宗门.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  if (notUndAndNull(player.宗门)) {
    void Send(Text('已经加入宗门'));

    return false;
  }

  const levelList = await getDataList('Level1');
  const levelEntry = levelList.find((item: { level_id: number }) => item.level_id === player.level_id);

  if (!levelEntry) {
    void Send(Text('境界数据缺失'));

    return false;
  }

  const nowLevelId = levelEntry.level_id;
  const associationName = e.MessageText.replace(/^(#|＃|\/)?加入宗门/, '').trim();

  if (!associationName) {
    void Send(Text('请输入宗门名称'));

    return;
  }

  const ass = await getDataJSONParseByKey(keys.association(associationName));

  if (!ass) {
    void Send(Text('没有这个宗门'));

    return;
  }

  ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
  ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : [];

  //
  const guildLevel = Number(ass.宗门等级 ?? 1);

  if (nowLevelId >= 42 && ass.power === 0) {
    void Send(Text('仙人不可下界！'));

    return false;
  }

  if (nowLevelId < 42 && ass.power === 1) {
    void Send(Text('你在仙界吗？就去仙界宗门'));

    return false;
  }

  if (Number(ass.最低加入境界 || 0) > nowLevelId) {
    const levelList = await getDataList('Level1');
    const levelEntry = levelList.find((item: { level_id: number }) => item.level_id === ass.最低加入境界);
    const level = levelEntry?.level ?? '未知境界';

    void Send(Text(`${associationName}招收弟子的最低加入境界要求为:${level},当前未达到要求`));

    return false;
  }

  //
  const capIndex = Math.max(0, Math.min(宗门人数上限.length - 1, guildLevel - 1));
  const mostmem = 宗门人数上限[capIndex];
  const nowmem = ass.所有成员.length;

  if (mostmem <= nowmem) {
    void Send(Text(`${associationName}的弟子人数已经达到目前等级最大,无法加入`));

    return false;
  }

  const nowTime = Date.now();

  // 检查是否需要审核
  if (ass.需要审核) {
    // 获取练气境界和炼体境界
    const level2List = await getDataList('Level2');
    const physiqueEntry = level2List.find((item: { Physique_id: number }) => item.Physique_id === player.Physique_id);

    const auditRecord: AssociationAuditRecord = {
      userId: userId,
      name: player.名号,
      level: levelEntry.level ?? '未知',
      physique: physiqueEntry?.Physique ?? '未知',
      applyTime: nowTime
    };

    // 获取现有审核列表
    const auditListStr = await redis.get(keys.associationAudit(associationName));
    let auditList: AssociationAuditRecord[] = [];

    if (auditListStr) {
      try {
        auditList = JSON.parse(auditListStr);
      } catch (error) {
        console.error('获取宗门审核列表:', error);
        auditList = [];
      }
    }

    // 检查是否已经在审核列表中
    const existingIndex = auditList.findIndex(record => record.userId === userId);

    if (existingIndex !== -1) {
      void Send(Text(`你已经提交过加入${associationName}的申请，请耐心等待审核`));

      return false;
    }

    // 添加到审核列表
    auditList.push(auditRecord);
    await redis.set(keys.associationAudit(associationName), JSON.stringify(auditList));

    void Send(Text(`已提交加入${associationName}的申请，请等待宗门长老及以上成员审核`));

    return;
  }

  // 无需审核，直接加入
  const date = timestampToTime(nowTime);

  player.宗门 = {
    宗门名称: associationName,
    职位: '外门弟子',
    time: [date, nowTime]
  };
  //
  ass.所有成员.push(userId);
  //
  ass.外门弟子.push(userId);
  //
  await playerEfficiency(userId);
  //
  await writePlayer(userId, player);
  //
  await setDataJSONStringifyByKey(keys.association(associationName), ass);
  //
  void Send(Text(`恭喜你成功加入${associationName}`));
});

export default onResponse(selects, [mw.current, res.current]);
