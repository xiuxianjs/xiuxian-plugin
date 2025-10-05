import { Text, useSend } from 'alemonjs';
import { getDataList } from '@src/model/DataList';
import { keys } from '@src/model/keys';
import { timestampToTime, readPlayer, writePlayer, notUndAndNull, checkPlayerCanJoinAssociation } from '@src/model/index';
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

  const associationName = e.MessageText.replace(/^(#|＃|\/)?加入宗门/, '').trim();

  if (!associationName) {
    void Send(Text('请输入宗门名称'));

    return;
  }

  const assData = await getDataJSONParseByKey(keys.association(associationName));

  if (!assData) {
    void Send(Text('没有这个宗门'));

    return;
  }

  const ass = assData as any;

  ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
  ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : [];

  // 检查玩家是否可以加入宗门
  const checkResult = await checkPlayerCanJoinAssociation(player, ass);

  if (!checkResult.success) {
    void Send(Text(checkResult.message ?? '无法加入宗门'));

    return false;
  }

  const levelEntry = checkResult.levelEntry;
  const nowTime = Date.now();

  // 检查是否需要审核
  if (ass.需要审核) {
    // 获取练气境界和炼体境界
    const level2List = await getDataList('Level2');
    const physiqueEntry = level2List.find((item: any) => item.Physique_id === player.Physique_id);

    const auditRecord: AssociationAuditRecord = {
      userId: userId,
      name: player.名号,
      level: levelEntry.level ?? '未知',
      physique: (physiqueEntry as any)?.Physique ?? '未知',
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

  (player.宗门 as any) = {
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
