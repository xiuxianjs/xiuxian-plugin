import { Text, useSend } from 'alemonjs';
import { keys } from '@src/model/keys';
import { timestampToTime, readPlayer, writePlayer, notUndAndNull, checkPlayerCanJoinAssociation } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { playerEfficiency } from '@src/model';
import { redis } from '@src/model/api';
import { isKeys } from '@src/model/utils/isKeys';
import type { AssociationAuditRecord } from '@src/types/ass';
import type { ZongMen } from '@src/types/ass';
export const regular = /^(#|＃|\/)?宗门审核(通过|拒绝)\s*(.+)$/;

// 过滤超过7天的审核记录
const filterExpiredAudits = (auditList: AssociationAuditRecord[]): AssociationAuditRecord[] => {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7天的毫秒数

  return auditList.filter(record => now - record.applyTime < sevenDays);
};

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  if (!notUndAndNull(player?.宗门)) {
    void Send(Text('你还没有加入宗门'));

    return;
  }

  if (!isKeys(player.宗门, ['宗门名称', '职位'])) {
    void Send(Text('宗门信息不完整'));

    return;
  }

  const guildInfo = player.宗门;
  const role = guildInfo.职位;

  // 只有长老及以上可以审核
  if (role !== '宗主' && role !== '副宗主' && role !== '长老') {
    void Send(Text('只有长老及以上职位才能审核'));

    return;
  }

  // 解析指令
  const match = e.MessageText.match(regular);

  if (!match) {
    void Send(Text('指令格式错误'));

    return;
  }

  const action = match[2]; // 通过 或 拒绝
  const targetUserId = match[3].trim();

  if (!targetUserId) {
    void Send(Text('请输入要审核的玩家QQ号'));

    return;
  }

  // 获取审核列表
  const auditListStr = await redis.get(keys.associationAudit(guildInfo.宗门名称));

  if (!auditListStr) {
    void Send(Text('当前没有待审核的申请'));

    return;
  }

  let auditList: AssociationAuditRecord[] = [];

  try {
    auditList = JSON.parse(auditListStr);
  } catch (error) {
    console.error('审核列表数据异常:', error);
    void Send(Text('审核列表数据异常'));

    return;
  }

  // 过滤超过7天的记录
  const validAudits = filterExpiredAudits(auditList);

  // 查找目标玩家
  const targetIndex = validAudits.findIndex(record => record.userId === targetUserId);

  if (targetIndex === -1) {
    void Send(Text('未找到该玩家的审核申请'));

    return;
  }

  const targetRecord = validAudits[targetIndex];

  if (action === '拒绝') {
    // 从列表中移除
    validAudits.splice(targetIndex, 1);

    // 更新 Redis
    if (validAudits.length === 0) {
      await redis.del(keys.associationAudit(guildInfo.宗门名称));
    } else {
      await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
    }

    void Send(Text(`已拒绝 ${targetRecord.name} 的加入申请`));

    return;
  }

  // 审核通过，加入宗门
  const ass: ZongMen | null = await getDataJSONParseByKey(keys.association(guildInfo.宗门名称));

  if (!ass) {
    void Send(Text('宗门数据异常'));

    return;
  }

  // 检查玩家是否存在
  const targetPlayer = await readPlayer(targetUserId);

  if (!targetPlayer) {
    void Send(Text('该玩家数据不存在'));

    return;
  }

  // 检查玩家是否已经加入其他宗门
  if (notUndAndNull(targetPlayer.宗门)) {
    // 从列表中移除
    validAudits.splice(targetIndex, 1);

    if (validAudits.length === 0) {
      await redis.del(keys.associationAudit(guildInfo.宗门名称));
    } else {
      await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
    }

    void Send(Text(`${targetRecord.name} 已经加入其他宗门`));

    return;
  }

  // 初始化宗门成员数组
  ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
  ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : [];

  // 检查玩家是否可以加入宗门
  const checkResult = await checkPlayerCanJoinAssociation(targetPlayer, ass, targetRecord.name);

  if (!checkResult.success) {
    void Send(Text(checkResult.message ?? '无法加入宗门'));

    return;
  }

  const nowTime = Date.now();
  const date = timestampToTime(nowTime);

  // 加入宗门
  (targetPlayer.宗门 as any) = {
    宗门名称: guildInfo.宗门名称,
    职位: '外门弟子',
    time: [date, nowTime]
  };

  ass.所有成员.push(targetUserId);
  ass.外门弟子.push(targetUserId);

  // 更新效率
  await playerEfficiency(targetUserId);

  // 保存数据
  await writePlayer(targetUserId, targetPlayer);
  await setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);

  // 从审核列表中移除
  validAudits.splice(targetIndex, 1);

  if (validAudits.length === 0) {
    await redis.del(keys.associationAudit(guildInfo.宗门名称));
  } else {
    await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
  }

  void Send(Text(`已批准 ${targetRecord.name} 加入${guildInfo.宗门名称}`));
});

export default onResponse(selects, [mw.current, res.current]);
