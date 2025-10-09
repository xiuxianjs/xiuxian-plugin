import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import { getAllDailyTasksStatus } from '../../../../model/dailyTasks.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?每日任务$/;
const res = onResponse(selects, async (e) => {
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
    const dailyStatus = await getAllDailyTasksStatus(userId);
    let hasGuild = false;
    let guildName = '';
    let hasZhudi = false;
    let hasBeast = false;
    if (isKeys(player.宗门, ['宗门名称'])) {
        hasGuild = true;
        guildName = player.宗门.宗门名称;
        const assRaw = await getDataJSONParseByKey(keys.association(guildName));
        if (assRaw && isKeys(assRaw, ['宗门驻地', '宗门神兽'])) {
            const ass = assRaw;
            if (ass.宗门驻地 && ass.宗门驻地 !== 0) {
                hasZhudi = true;
            }
            if (ass.宗门神兽 && ass.宗门神兽 !== '0' && ass.宗门神兽 !== '无') {
                hasBeast = true;
            }
        }
    }
    let message = '【每日任务】\n\n';
    const signIcon = dailyStatus.sign.completed ? '✅' : '❌';
    message += `${signIcon} 修仙签到: ${dailyStatus.sign.completed ? '已完成' : '未完成'}\n`;
    message += `   连续签到: ${dailyStatus.sign.consecutiveDays}天\n\n`;
    if (!dailyStatus.biwu.isRegistered) {
        message += '⚠️ 每日比试: 需先报名比赛\n';
        message += '   使用 #报名比赛 参加\n\n';
    }
    else {
        const biwuIcon = dailyStatus.biwu.completed ? '✅' : '❌';
        message += `${biwuIcon} 每日比试: ${dailyStatus.biwu.currentCount}/${dailyStatus.biwu.maxCount}\n`;
        message += `   ${dailyStatus.biwu.completed ? '已完成' : `剩余${dailyStatus.biwu.remainingCount}次`}\n\n`;
    }
    if (!hasGuild) {
        message += '⚠️ 开采灵脉: 需要加入宗门\n\n';
    }
    else if (!hasZhudi) {
        message += '⚠️ 开采灵脉: 宗门需要驻地\n';
        message += `   所属宗门: ${guildName}\n\n`;
    }
    else {
        const exploitIcon = dailyStatus.exploitation.completed ? '✅' : '❌';
        message += `${exploitIcon} 开采灵脉: ${dailyStatus.exploitation.completed ? '已完成' : '未完成'}\n`;
        message += `   所属宗门: ${guildName}\n\n`;
    }
    if (!hasGuild) {
        message += '⚠️ 神兽赐福: 需要加入宗门\n\n';
    }
    else if (!hasBeast) {
        message += '⚠️ 神兽赐福: 宗门需要召唤神兽\n';
        message += `   所属宗门: ${guildName}\n\n`;
    }
    else {
        const bonusIcon = dailyStatus.beastBonus.completed ? '✅' : '❌';
        message += `${bonusIcon} 神兽赐福: ${dailyStatus.beastBonus.completed ? '已完成' : '未完成'}\n`;
        message += `   所属宗门: ${guildName}\n\n`;
    }
    if (dailyStatus.shenjie.isMojie) {
        message += '😈 堕入魔界: 无次数限制\n';
        message += `   当前魔道值: ${dailyStatus.shenjie.modaoValue}\n`;
        message += '   (每次消耗100魔道值)\n\n';
    }
    else {
        const shenjieIcon = dailyStatus.shenjie.remainingCount > 0 ? '🔵' : '✅';
        message += `${shenjieIcon} 踏入神界: ${dailyStatus.shenjie.remainingCount}/${dailyStatus.shenjie.maxCount}\n`;
        message += `   ${dailyStatus.shenjie.remainingCount === 0 ? '今日已用完' : `还可踏入${dailyStatus.shenjie.remainingCount}次`}\n\n`;
    }
    let completed = 0;
    const total = 5;
    if (dailyStatus.sign.completed) {
        completed++;
    }
    if (dailyStatus.biwu.isRegistered && dailyStatus.biwu.completed) {
        completed++;
    }
    if (dailyStatus.exploitation.completed) {
        completed++;
    }
    if (dailyStatus.beastBonus.completed) {
        completed++;
    }
    if (!dailyStatus.shenjie.isMojie && dailyStatus.shenjie.remainingCount === 0) {
        completed++;
    }
    message += '━━━━━━━━━━━━━━\n';
    message += `完成度: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`;
    void Send(Text(message));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
