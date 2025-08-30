import { useSend, Text } from 'alemonjs';
import { getDataList } from '../../../../model/DataList.js';
import { keys } from '../../../../model/keys.js';
import '../../../../model/api.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { timestampToTime } from '../../../../model/common.js';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { 宗门人数上限 as ______ } from '../../../../model/settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?加入宗门.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelEntry = levelList.find((item) => item.level_id === player.level_id);
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
        const levelEntry = levelList.find((item) => item.level_id === ass.最低加入境界);
        const level = levelEntry?.level ?? '未知境界';
        void Send(Text(`${associationName}招收弟子的最低加入境界要求为:${level},当前未达到要求`));
        return false;
    }
    const capIndex = Math.max(0, Math.min(______.length - 1, guildLevel - 1));
    const mostmem = ______[capIndex];
    const nowmem = ass.所有成员.length;
    if (mostmem <= nowmem) {
        void Send(Text(`${associationName}的弟子人数已经达到目前等级最大,无法加入`));
        return false;
    }
    const nowTime = Date.now();
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
