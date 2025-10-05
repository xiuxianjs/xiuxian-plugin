import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import { redis } from '../../../../model/api.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import { checkPlayerCanJoinAssociation } from '../../../../model/association.js';
import '@alemonjs/db';
import { notUndAndNull, timestampToTime } from '../../../../model/common.js';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?宗门审核(通过|拒绝)\s*(.+)$/;
const filterExpiredAudits = (auditList) => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return auditList.filter(record => now - record.applyTime < sevenDays);
};
const res = onResponse(selects, async (e) => {
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
    if (role !== '宗主' && role !== '副宗主' && role !== '长老') {
        void Send(Text('只有长老及以上职位才能审核'));
        return;
    }
    const match = e.MessageText.match(regular);
    if (!match) {
        void Send(Text('指令格式错误'));
        return;
    }
    const action = match[2];
    const targetUserId = match[3].trim();
    if (!targetUserId) {
        void Send(Text('请输入要审核的玩家QQ号'));
        return;
    }
    const auditListStr = await redis.get(keys.associationAudit(guildInfo.宗门名称));
    if (!auditListStr) {
        void Send(Text('当前没有待审核的申请'));
        return;
    }
    let auditList = [];
    try {
        auditList = JSON.parse(auditListStr);
    }
    catch (error) {
        console.error('审核列表数据异常:', error);
        void Send(Text('审核列表数据异常'));
        return;
    }
    const validAudits = filterExpiredAudits(auditList);
    const targetIndex = validAudits.findIndex(record => record.userId === targetUserId);
    if (targetIndex === -1) {
        void Send(Text('未找到该玩家的审核申请'));
        return;
    }
    const targetRecord = validAudits[targetIndex];
    if (action === '拒绝') {
        validAudits.splice(targetIndex, 1);
        if (validAudits.length === 0) {
            await redis.del(keys.associationAudit(guildInfo.宗门名称));
        }
        else {
            await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
        }
        void Send(Text(`已拒绝 ${targetRecord.name} 的加入申请`));
        return;
    }
    const ass = await getDataJSONParseByKey(keys.association(guildInfo.宗门名称));
    if (!ass) {
        void Send(Text('宗门数据异常'));
        return;
    }
    const targetPlayer = await readPlayer(targetUserId);
    if (!targetPlayer) {
        void Send(Text('该玩家数据不存在'));
        return;
    }
    if (notUndAndNull(targetPlayer.宗门)) {
        validAudits.splice(targetIndex, 1);
        if (validAudits.length === 0) {
            await redis.del(keys.associationAudit(guildInfo.宗门名称));
        }
        else {
            await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
        }
        void Send(Text(`${targetRecord.name} 已经加入其他宗门`));
        return;
    }
    ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : [];
    const checkResult = await checkPlayerCanJoinAssociation(targetPlayer, ass, targetRecord.name);
    if (!checkResult.success) {
        void Send(Text(checkResult.message ?? '无法加入宗门'));
        return;
    }
    const nowTime = Date.now();
    const date = timestampToTime(nowTime);
    targetPlayer.宗门 = {
        宗门名称: guildInfo.宗门名称,
        职位: '外门弟子',
        time: [date, nowTime]
    };
    ass.所有成员.push(targetUserId);
    ass.外门弟子.push(targetUserId);
    await playerEfficiency(targetUserId);
    await writePlayer(targetUserId, targetPlayer);
    await setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
    validAudits.splice(targetIndex, 1);
    if (validAudits.length === 0) {
        await redis.del(keys.associationAudit(guildInfo.宗门名称));
    }
    else {
        await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
    }
    void Send(Text(`已批准 ${targetRecord.name} 加入${guildInfo.宗门名称}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
