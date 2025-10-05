import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { useMessage, Text } from 'alemonjs';
import 'dayjs';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
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
import { addNajieThing } from '../../../../model/najie.js';
import { isUserMonthCard } from '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?新手礼包$/;
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const user = await readPlayer(e.UserId);
    if (!user) {
        await message.send(format(Text('请先创建角色')));
        return;
    }
    if (user.newbie === 1) {
        await message.send(format(Text('新手礼包已领取！')));
        return;
    }
    user.newbie = 1;
    await addCoin(e.UserId, 50000);
    const list = [
        {
            name: '五阶玄元丹',
            class: '丹药',
            account: 1
        },
        {
            name: '五阶淬体丹',
            class: '丹药',
            account: 1
        },
        {
            name: '性转丹',
            class: '丹药',
            account: 1
        },
        {
            name: '寒龙刀',
            class: '装备',
            account: 1
        },
        {
            name: '昊天印',
            class: '装备',
            account: 1
        },
        {
            name: '金光天甲',
            class: '装备',
            account: 1
        },
        {
            name: '更名卡',
            class: '道具',
            account: 1
        }
    ];
    const isMonth = await isUserMonthCard(e.UserId);
    for (const thing of list) {
        await addNajieThing(e.UserId, thing.name, thing.class, isMonth ? thing.account * 2 : thing.account);
    }
    await writePlayer(e.UserId, user);
    const msg = list.map(thing => {
        return `${thing.name}*${isMonth ? thing.account * 2 : thing.account}`;
    });
    await message.send(format(Text('新手礼包领取成功！获得: ' + msg.join('\n'))));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
