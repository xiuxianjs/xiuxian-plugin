import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { shijianc, getLastsign } from '../../../../model/common.js';
import { addExp } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?修仙签到$/;
function isLastSignStruct(v) {
    if (!v || typeof v !== 'object')
        return false;
    const obj = v;
    return (typeof obj.Y === 'number' &&
        typeof obj.M === 'number' &&
        typeof obj.D === 'number');
}
const isSameDay = (a, b) => a.Y === b.Y && a.M === b.M && a.D === b.D;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const nowTime = Date.now();
    const yesterdayStruct = await shijianc(nowTime - 24 * 60 * 60 * 1000);
    const todayStruct = await shijianc(nowTime);
    const lastSignStruct = await getLastsign(usr_qq);
    if (isLastSignStruct(lastSignStruct) &&
        isLastSignStruct(todayStruct) &&
        isSameDay(todayStruct, lastSignStruct)) {
        Send(Text('今日已经签到过了'));
        return false;
    }
    const continued = isLastSignStruct(lastSignStruct) &&
        isLastSignStruct(yesterdayStruct) &&
        isSameDay(yesterdayStruct, lastSignStruct);
    await redis.set(`xiuxian@1.3.0:${usr_qq}:lastsign_time`, String(nowTime));
    const player = (await data.getData('player', usr_qq));
    if (!player) {
        Send(Text('玩家数据异常'));
        return false;
    }
    const record = player;
    let currentStreak = 0;
    const rawStreak = record['连续签到天数'];
    if (typeof rawStreak === 'number' && Number.isFinite(rawStreak))
        currentStreak = rawStreak;
    let newStreak = currentStreak === 7 || !continued ? 0 : currentStreak;
    newStreak += 1;
    record.连续签到天数 = newStreak;
    await writePlayer(usr_qq, player);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const ticketNum = Math.max(0, Number(cf?.Sign?.ticket ?? 0));
    const gift_xiuwei = newStreak * 3000;
    if (ticketNum > 0)
        await addNajieThing(usr_qq, '秘境之匙', '道具', ticketNum);
    await addExp(usr_qq, gift_xiuwei);
    Send(Text(`已经连续签到${newStreak}天，获得修为${gift_xiuwei}${ticketNum > 0 ? `，秘境之匙x${ticketNum}` : ''}`));
    return false;
});

export { res as default, regular };
