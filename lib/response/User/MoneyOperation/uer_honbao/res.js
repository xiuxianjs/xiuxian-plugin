import { useMessage, Text } from 'alemonjs';
import { RedEnvelopesKey } from '../Give_honbao/res.js';
import { redis } from '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import { addUserCurrency } from '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?抢红包/;
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const redEnvelopesId = e.MessageText.replace(/^(#|＃|\/)?抢红包/, '').trim();
    if (!redEnvelopesId) {
        void message.send(format(Text('红包ID不能为空，请使用 #抢红包 <红包ID>，如 #抢红包 1234567')));
        return;
    }
    const redEnvelopes = await redis.get(`${RedEnvelopesKey}${redEnvelopesId}`);
    if (!redEnvelopes) {
        void message.send(format(Text('红包不存在，请检查红包ID是否正确')));
        return;
    }
    const { num, currency, userId, time } = JSON.parse(redEnvelopes);
    if (num <= 0) {
        void message.send(format(Text('红包已被抢完')));
        await redis.del(`${RedEnvelopesKey}${redEnvelopesId}`);
        return;
    }
    if (userId === e.UserId) {
        void message.send(format(Text('不能抢自己的红包')));
        return;
    }
    await redis.set(`${RedEnvelopesKey}${redEnvelopesId}`, JSON.stringify({ num: num - 1, currency, userId, time }));
    await addUserCurrency(e.UserId, currency);
    if (num - 1 <= 0) {
        await redis.del(`${RedEnvelopesKey}${redEnvelopesId}`);
    }
    void message.send(format(Text(`恭喜你抢到一个${currency}仙缘的红包`)));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
