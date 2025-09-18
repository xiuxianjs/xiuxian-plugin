import { useMessage, Text } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
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
import { checkUserMonthCardStatus, consumeUserCurrency } from '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?发红包.*$/;
const RedEnvelopesKey = 'xiuxian@1.3.0:red_envelopes:';
async function getRandomId() {
    const random = Math.floor(Math.random() * 10000000);
    const had = await redis.exists(`${RedEnvelopesKey}${random}`);
    if (had) {
        return getRandomId();
    }
    return random;
}
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const [num, currency] = e.MessageText.replace(/^(#|＃|\/)?发红包/, '')
        .trim()
        .split(' ')
        .map(i => Number(i.trim()));
    if (Number.isNaN(num) || Number.isNaN(currency) || num <= 0 || currency <= 0) {
        void message.send(format(Text('红包格式错误，请使用 #发红包 <数量> <金额>，如 #发红包 5 100')));
        return;
    }
    const UserCurrencyData = await checkUserMonthCardStatus(e.UserId);
    if (!UserCurrencyData) {
        void message.send(format(Text('您没有仙缘币')));
        return;
    }
    if (!UserCurrencyData.has_big_month_card) {
        void message.send(format(Text('您暂未开通此权益')));
        return;
    }
    if (UserCurrencyData.currency < currency * num) {
        void message.send(format(Text('余额不足，发红包失败')));
        return;
    }
    const random = await getRandomId();
    await consumeUserCurrency(e.UserId, currency * num);
    await redis.set(`${RedEnvelopesKey}${random}`, JSON.stringify({ num, currency, userId: e.UserId, time: Date.now() }));
    void message.send(format(Text(`红包已发出，红包ID：${random}，请使用 #抢红包${random} 来抢红包，祝大家好运！`)));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { RedEnvelopesKey, res$1 as default, regular };
