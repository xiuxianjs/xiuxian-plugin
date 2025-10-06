import { Text, useSend } from 'alemonjs';
import { existplayer, readPlayer } from '@src/model';
import { getAllDailyTasksStatus } from '@src/model/dailyTasks';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { keys } from '@src/model/keys';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?每日任务$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    void Send(Text('请先创建角色'));

    return false;
  }

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据异常'));

    return false;
  }

  // 获取所有每日任务状态
  const dailyStatus = await getAllDailyTasksStatus(userId);

  // 检查宗门相关状态
  let hasGuild = false;
  let guildName = '';
  let hasZhudi = false; // 是否有驻地（开采灵脉需要）
  let hasBeast = false; // 是否有神兽（神兽赐福需要）

  if (isKeys(player.宗门, ['宗门名称'])) {
    hasGuild = true;
    guildName = player.宗门.宗门名称;

    // 检查宗门是否有驻地和神兽
    const assRaw = await getDataJSONParseByKey(keys.association(guildName));

    if (assRaw && isKeys(assRaw, ['宗门驻地', '宗门神兽'])) {
      const ass = assRaw as any;

      // 检查是否有驻地（开采灵脉需要）
      if (ass.宗门驻地 && ass.宗门驻地 !== 0) {
        hasZhudi = true;
      }

      // 检查是否有神兽（神兽赐福需要）
      if (ass.宗门神兽 && ass.宗门神兽 !== '0' && ass.宗门神兽 !== '无') {
        hasBeast = true;
      }
    }
  }

  // 构建消息
  let message = '【每日任务】\n\n';

  // 1. 签到
  const signIcon = dailyStatus.sign.completed ? '✅' : '❌';

  message += `${signIcon} 修仙签到: ${dailyStatus.sign.completed ? '已完成' : '未完成'}\n`;
  message += `   连续签到: ${dailyStatus.sign.consecutiveDays}天\n\n`;

  // 2. 每日比试
  if (!dailyStatus.biwu.isRegistered) {
    // 未报名比赛
    message += '⚠️ 每日比试: 需先报名比赛\n';
    message += '   使用 #报名比赛 参加\n\n';
  } else {
    // 已报名
    const biwuIcon = dailyStatus.biwu.completed ? '✅' : '❌';

    message += `${biwuIcon} 每日比试: ${dailyStatus.biwu.currentCount}/${dailyStatus.biwu.maxCount}\n`;
    message += `   ${dailyStatus.biwu.completed ? '已完成' : `剩余${dailyStatus.biwu.remainingCount}次`}\n\n`;
  }

  // 3. 开采灵脉（需要宗门+驻地）
  if (!hasGuild) {
    message += '⚠️ 开采灵脉: 需要加入宗门\n\n';
  } else if (!hasZhudi) {
    message += '⚠️ 开采灵脉: 宗门需要驻地\n';
    message += `   所属宗门: ${guildName}\n\n`;
  } else {
    const exploitIcon = dailyStatus.exploitation.completed ? '✅' : '❌';

    message += `${exploitIcon} 开采灵脉: ${dailyStatus.exploitation.completed ? '已完成' : '未完成'}\n`;
    message += `   所属宗门: ${guildName}\n\n`;
  }

  // 4. 神兽赐福（需要宗门+神兽）
  if (!hasGuild) {
    message += '⚠️ 神兽赐福: 需要加入宗门\n\n';
  } else if (!hasBeast) {
    message += '⚠️ 神兽赐福: 宗门需要召唤神兽\n';
    message += `   所属宗门: ${guildName}\n\n`;
  } else {
    const bonusIcon = dailyStatus.beastBonus.completed ? '✅' : '❌';

    message += `${bonusIcon} 神兽赐福: ${dailyStatus.beastBonus.completed ? '已完成' : '未完成'}\n`;
    message += `   所属宗门: ${guildName}\n\n`;
  }

  // 5. 踏入神界/堕入魔界
  if (dailyStatus.shenjie.isMojie) {
    // 魔界模式：显示魔道值
    message += '😈 堕入魔界: 无次数限制\n';
    message += `   当前魔道值: ${dailyStatus.shenjie.modaoValue}\n`;
    message += '   (每次消耗100魔道值)\n\n';
  } else {
    // 神界模式：显示剩余次数
    const shenjieIcon = dailyStatus.shenjie.remainingCount > 0 ? '🔵' : '✅';

    message += `${shenjieIcon} 踏入神界: ${dailyStatus.shenjie.remainingCount}/${dailyStatus.shenjie.maxCount}\n`;
    message += `   ${dailyStatus.shenjie.remainingCount === 0 ? '今日已用完' : `还可踏入${dailyStatus.shenjie.remainingCount}次`}\n\n`;
  }

  // 计算完成度
  let completed = 0;
  const total = 5;

  if (dailyStatus.sign.completed) {
    completed++;
  }
  // 比试：只有报名后才计入完成度
  if (dailyStatus.biwu.isRegistered && dailyStatus.biwu.completed) {
    completed++;
  }
  if (dailyStatus.exploitation.completed) {
    completed++;
  }
  if (dailyStatus.beastBonus.completed) {
    completed++;
  }
  // 神界/魔界：魔界不计入完成度，神界按次数计算
  if (!dailyStatus.shenjie.isMojie && dailyStatus.shenjie.remainingCount === 0) {
    completed++;
  }

  message += '━━━━━━━━━━━━━━\n';
  message += `完成度: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`;

  void Send(Text(message));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
