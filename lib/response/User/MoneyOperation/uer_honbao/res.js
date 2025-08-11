import { useSend, Text, useMention } from 'alemonjs';
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
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
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
import 'md5';
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

const regular = /^(#|＃|\/)?抢红包$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const player = await data.getData('player', usr_qq);
    const now = Date.now();
    const lastKey = `xiuxian@1.3.0:${usr_qq}:last_getbung_time`;
    const lastStr = await redis.get(lastKey);
    const lastTime = toInt(lastStr);
    const cf = config.getConfig('xiuxian', 'xiuxian') || {};
    const cdMinutes = toInt(cf?.CD?.honbao, 1);
    const cdMs = cdMinutes * 60000;
    if (now < lastTime + cdMs) {
        const remain = lastTime + cdMs - now;
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        Send(Text(`每${cdMinutes}分钟抢一次，正在CD中，剩余cd: ${m}分${s}秒`));
        return false;
    }
    const [mention] = useMention(e);
    const found = await mention.find({ IsBot: false });
    const list = (found && found.data) || [];
    const target = list.find(u => !u.IsBot);
    if (!target)
        return false;
    const honbao_qq = target.UserId;
    if (honbao_qq === usr_qq) {
        Send(Text('不能抢自己的红包'));
        return false;
    }
    if (!(await existplayer(honbao_qq)))
        return false;
    const countKey = `xiuxian@1.3.0:${honbao_qq}:honbaoacount`;
    const countStr = await redis.get(countKey);
    let count = toInt(countStr);
    if (count <= 0) {
        Send(Text('他的红包被光啦！'));
        return false;
    }
    const valueKey = `xiuxian@1.3.0:${honbao_qq}:honbao`;
    const valStr = await redis.get(valueKey);
    const lingshi = toInt(valStr);
    if (lingshi <= 0) {
        Send(Text('这个红包里居然是空的...'));
        count--;
        await redis.set(countKey, count);
        await redis.set(lastKey, now);
        return false;
    }
    count--;
    await redis.set(countKey, count);
    await addCoin(usr_qq, lingshi);
    await redis.set(lastKey, now);
    Send(Text(`【全服公告】${player.名号 || usr_qq}抢到一个${lingshi}灵石的红包！`));
    return false;
});

export { res as default, regular };
