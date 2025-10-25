import { useSend, Text, useMention } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
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
import { getAppConfig } from '../../../../model/Config.js';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?一键赠送([\u4e00-\u9fa5]+)?$/;
const ALL_TYPES = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const UserIdA = e.UserId;
    const values = getAppConfig();
    if (!values?.open_give) {
        void Send(Text('该功能优化中……'));
        return;
    }
    if (!(await existplayer(UserIdA))) {
        return false;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        return false;
    }
    const userIdB = target.UserId;
    if (!(await existplayer(userIdB))) {
        void Send(Text('此人尚未踏入仙途'));
        return false;
    }
    const typeArg = (e.MessageText.match(/一键赠送([\u4e00-\u9fa5]+)?$/) ?? [])[1];
    let targetTypes;
    if (!typeArg) {
        targetTypes = ALL_TYPES;
    }
    else {
        targetTypes = typeArg.split('').filter(t => ALL_TYPES.includes(t) || ALL_TYPES.includes(t + '宠口粮'));
        if (targetTypes.length === 0) {
            void Send(Text('物品类型错误，仅支持：' + ALL_TYPES.join('、')));
            return false;
        }
    }
    const najieDataA = await getDataJSONParseByKey(keys.najie(UserIdA));
    if (!najieDataA) {
        return;
    }
    const sendTypes = [];
    const nothingToSend = [];
    for (const type of targetTypes) {
        const items = najieDataA[type];
        if (!Array.isArray(items)) {
            continue;
        }
        if (!items.length) {
            nothingToSend.push(type);
            continue;
        }
        let sent = false;
        for (const l of items) {
            if (l && l.islockd === 0 && Number(l.数量) > 0) {
                const quantity = Number(l.数量);
                if (type === '装备' || type === '仙宠') {
                    await addNajieThing(userIdB, l, l.class, quantity, l.pinji);
                    await addNajieThing(UserIdA, l, l.class, -quantity, l.pinji);
                }
                else {
                    await addNajieThing(UserIdA, l.name, l.class, -quantity);
                    await addNajieThing(userIdB, l.name, l.class, quantity);
                }
                sent = true;
            }
        }
        if (sent) {
            sendTypes.push(type);
        }
        else {
            nothingToSend.push(type);
        }
    }
    let msg = '';
    if (sendTypes.length) {
        msg += `已赠送：${sendTypes.join('、')}\n`;
    }
    if (nothingToSend.length) {
        msg += `无可赠送：${nothingToSend.join('、')}`;
    }
    void Send(Text(msg.trim() || '一键赠送完成'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
