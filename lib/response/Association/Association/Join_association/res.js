import { useSend, Text } from 'alemonjs';
import { getDataList } from '../../../../model/DataList.js';
import { keys } from '../../../../model/keys.js';
import { redis } from '../../../../model/api.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import { checkPlayerCanJoinAssociation } from '../../../../model/association.js';
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
import 'dayjs';
import 'buffer';
import '@alemonjs/db';
import { notUndAndNull, timestampToTime } from '../../../../model/common.js';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?加入宗门.*$/;
const res = onResponse(selects, async (e) => {
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
    const ass = assData;
    ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : [];
    const checkResult = await checkPlayerCanJoinAssociation(player, ass);
    if (!checkResult.success) {
        void Send(Text(checkResult.message ?? '无法加入宗门'));
        return false;
    }
    const levelEntry = checkResult.levelEntry;
    const nowTime = Date.now();
    if (ass.需要审核) {
        const level2List = await getDataList('Level2');
        const physiqueEntry = level2List.find((item) => item.Physique_id === player.Physique_id);
        const auditRecord = {
            userId: userId,
            name: player.名号,
            level: levelEntry.level ?? '未知',
            physique: physiqueEntry?.Physique ?? '未知',
            applyTime: nowTime
        };
        const auditListStr = await redis.get(keys.associationAudit(associationName));
        let auditList = [];
        if (auditListStr) {
            try {
                auditList = JSON.parse(auditListStr);
            }
            catch (error) {
                console.error('获取宗门审核列表:', error);
                auditList = [];
            }
        }
        const existingIndex = auditList.findIndex(record => record.userId === userId);
        if (existingIndex !== -1) {
            void Send(Text(`你已经提交过加入${associationName}的申请，请耐心等待审核`));
            return false;
        }
        auditList.push(auditRecord);
        await redis.set(keys.associationAudit(associationName), JSON.stringify(auditList));
        void Send(Text(`已提交加入${associationName}的申请，请等待宗门长老及以上成员审核`));
        return;
    }
    const date = timestampToTime(nowTime);
    player.宗门 = {
        宗门名称: associationName,
        职位: '外门弟子',
        time: [date, nowTime]
    };
    ass.所有成员.push(userId);
    ass.外门弟子.push(userId);
    await playerEfficiency(userId);
    await writePlayer(userId, player);
    await setDataJSONStringifyByKey(keys.association(associationName), ass);
    void Send(Text(`恭喜你成功加入${associationName}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
