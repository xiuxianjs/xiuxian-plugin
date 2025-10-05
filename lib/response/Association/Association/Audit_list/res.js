import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import { redis } from '../../../../model/api.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { notUndAndNull } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
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
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?宗门审核列表$/;
const filterExpiredAudits = (auditList) => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return auditList.filter(record => now - record.applyTime < sevenDays);
};
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
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
        void Send(Text('只有长老及以上职位才能查看审核列表'));
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
    if (validAudits.length === 0) {
        await redis.del(keys.associationAudit(guildInfo.宗门名称));
        void Send(Text('当前没有待审核的申请'));
        return;
    }
    if (validAudits.length !== auditList.length) {
        await redis.set(keys.associationAudit(guildInfo.宗门名称), JSON.stringify(validAudits));
    }
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
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
