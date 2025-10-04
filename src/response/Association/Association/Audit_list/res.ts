import { Text, useSend } from 'alemonjs';
import { keys } from '@src/model/keys';
import { readPlayer, notUndAndNull } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { redis } from '@src/model/api';
import { isKeys } from '@src/model/utils/isKeys';
import type { AssociationAuditRecord } from '@src/types/ass';
export const regular = /^(#|＃|\/)?宗门审核列表$/;

// 过滤超过7天的审核记录
const filterExpiredAudits = (auditList: AssociationAuditRecord[]): AssociationAuditRecord[] => {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7天的毫秒数

  return auditList.filter(record => now - record.applyTime < sevenDays);
};

// 格式化时间戳
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}-${day} ${hours}:${minutes}`;
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

  // 只有长老及以上可以查看
  if (role !== '宗主' && role !== '副宗主' && role !== '长老') {
    void Send(Text('只有长老及以上职位才能查看审核列表'));

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

  // 如果过滤后列表为空
  if (validAudits.length === 0) {
    // 清空 Redis 中的审核列表
    await redis.del(keys.associationAudit(guildInfo.宗门名称));
    void Send(Text('当前没有待审核的申请'));

    return;
  }

  // 如果过滤后列表有变化，更新 Redis
  if (validAudits.length !== auditList.length) {
    await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
  }

  // 构建审核列表消息
  let message = `【${guildInfo.宗门名称}审核列表】\n\n`;

  validAudits.forEach((record, index) => {
    message += `${index + 1}. ${record.name}\n`;
    message += `   QQ: ${record.userId}\n`;
    message += `   练气: ${record.level} | 炼体: ${record.physique}\n`;
    message += `   申请时间: ${formatTime(record.applyTime)}\n\n`;
  });

  message += '使用"#宗门审核通过 QQ"或"#宗门审核拒绝 QQ"进行审核';

  void Send(Text(message));
});

export default onResponse(selects, [mw.current, res.current]);
