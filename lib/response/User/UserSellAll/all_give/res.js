import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键赠送([\u4e00-\u9fa5]+)?$/;
const ALL_TYPES = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
];
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const A_qq = e.UserId;
    if (!(await existplayer(A_qq)))
        return false;
    const [mention] = useMention(e);
    const User = (await mention.findOne()).data;
    if (!User)
        return;
    const B_qq = User.UserId;
    if (!(await existplayer(B_qq))) {
        Send(Text(`此人尚未踏入仙途`));
        return false;
    }
    const typeArg = (e.MessageText.match(/一键赠送([\u4e00-\u9fa5]+)?$/) || [])[1];
    let targetTypes;
    if (!typeArg) {
        targetTypes = ALL_TYPES;
    }
    else {
        targetTypes = typeArg
            .split('')
            .filter(t => ALL_TYPES.includes(t) || ALL_TYPES.includes(t + '宠口粮'));
        if (targetTypes.length === 0) {
            Send(Text('物品类型错误，仅支持：' + ALL_TYPES.join('、')));
            return false;
        }
    }
    const A_najie = await data.getData('najie', A_qq);
    const sendTypes = [];
    const nothingToSend = [];
    for (const type of targetTypes) {
        const items = A_najie[type];
        if (!Array.isArray(items) || !items.length) {
            nothingToSend.push(type);
            continue;
        }
        let sent = false;
        for (const l of items) {
            if (l && l.islockd == 0 && Number(l.数量) > 0) {
                const quantity = Number(l.数量);
                if (type === '装备' || type === '仙宠') {
                    await addNajieThing(B_qq, l, l.class, quantity, l.pinji);
                    await addNajieThing(A_qq, l, l.class, -quantity, l.pinji);
                }
                else {
                    await addNajieThing(A_qq, l.name, l.class, -quantity);
                    await addNajieThing(B_qq, l.name, l.class, quantity);
                }
                sent = true;
            }
        }
        if (sent)
            sendTypes.push(type);
        else
            nothingToSend.push(type);
    }
    let msg = '';
    if (sendTypes.length)
        msg += `已赠送：${sendTypes.join('、')}\n`;
    if (nothingToSend.length)
        msg += `无可赠送：${nothingToSend.join('、')}`;
    Send(Text(msg.trim() || '一键赠送完成'));
});

export { res as default, regular };
