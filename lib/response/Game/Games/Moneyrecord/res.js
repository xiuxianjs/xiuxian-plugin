import { useSend, Image, Text } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
import { screenshot } from '../../../../image/index.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import '../../../../model/DataList.js';
import '@alemonjs/db';
import 'dayjs';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?金银坊记录$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const qq = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(qq));
    if (!player) {
        return;
    }
    const toNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };
    const victory = toNum(player.金银坊胜场);
    const victory_num = toNum(player.金银坊收入);
    const defeated = toNum(player.金银坊败场);
    const defeated_num = toNum(player.金银坊支出);
    const totalRounds = victory + defeated;
    const shenglv = totalRounds > 0 ? ((victory / totalRounds) * 100).toFixed(2) : '0';
    const img = await screenshot('moneyCheck', e.UserId, {
        userId: qq,
        victory,
        victory_num,
        defeated,
        defeated_num,
        shenglv
    });
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
        return;
    }
    void Send(Text('生成记录失败'));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
