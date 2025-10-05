import { getDataList } from './DataList.js';
import './api.js';
import './keys.js';
import '@alemonjs/db';
import 'alemonjs';
import 'dayjs';
import { 宗门人数上限 as ______ } from './settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import './currency.js';
import 'crypto';
import 'posthog-node';
import './message.js';

async function checkPlayerCanJoinAssociation(player, association, playerName) {
    const name = playerName || '该玩家';
    const levelList = await getDataList('Level1');
    const levelEntry = levelList.find((item) => item.level_id === player.level_id);
    if (!levelEntry) {
        return {
            success: false,
            message: `${name}境界数据缺失`
        };
    }
    const nowLevelId = levelEntry.level_id;
    if (nowLevelId >= 42 && association.power === 0) {
        return {
            success: false,
            message: `${name}已是仙人，无法加入凡界宗门`
        };
    }
    if (nowLevelId < 42 && association.power === 1) {
        return {
            success: false,
            message: `${name}还未飞升仙界，无法加入仙界宗门`
        };
    }
    const minLevelId = Number(association.最低加入境界 || 0);
    if (minLevelId > nowLevelId) {
        const minLevelEntry = levelList.find((item) => item.level_id === minLevelId);
        const minLevel = minLevelEntry?.level ?? '未知境界';
        return {
            success: false,
            message: `${name}当前境界未达到宗门要求(需要${minLevel})`
        };
    }
    const members = Array.isArray(association.所有成员) ? association.所有成员 : [];
    const guildLevel = Number(association.宗门等级 ?? 1);
    const capIndex = Math.max(0, Math.min(______.length - 1, guildLevel - 1));
    const maxMembers = ______[capIndex];
    const currentMembers = members.length;
    if (maxMembers <= currentMembers) {
        return {
            success: false,
            message: `${association.宗门名称}的弟子人数已经达到目前等级最大,无法加入`
        };
    }
    return {
        success: true,
        levelEntry
    };
}

export { checkPlayerCanJoinAssociation };
