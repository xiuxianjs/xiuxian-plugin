import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import mw, { selects } from '../../../mw.js';
import { screenshot } from '../../../../image/index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?金银坊记录$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const qq = e.UserId;
    const player_raw = await data.getData('player', qq);
    if (!player_raw || player_raw === 'error' || Array.isArray(player_raw)) {
        return false;
    }
    const player_data = player_raw;
    const toNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };
    const victory = toNum(player_data.金银坊胜场);
    const victory_num = toNum(player_data.金银坊收入);
    const defeated = toNum(player_data.金银坊败场);
    const defeated_num = toNum(player_data.金银坊支出);
    const totalRounds = victory + defeated;
    const shenglv = totalRounds > 0 ? ((victory / totalRounds) * 100).toFixed(2) : '0';
    const img = await screenshot('moneyCheck', e.UserId, {
        user_qq: qq,
        victory,
        victory_num,
        defeated,
        defeated_num,
        shenglv
    });
    if (!img) {
        Send(Text('生成记录失败'));
        return false;
    }
    Send(Image(img));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
