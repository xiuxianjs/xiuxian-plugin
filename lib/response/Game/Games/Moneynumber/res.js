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
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { Go } from '../../../../model/common.js';
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
import { game } from '../game.js';

const regular = /^(#|＃|\/)?金银坊$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const gameswitch = cf?.switch?.Moneynumber;
    if (gameswitch !== true)
        return false;
    const flag = await Go(e);
    if (!flag)
        return false;
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据读取失败'));
        return false;
    }
    const toInt = (v, d = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : d;
    };
    const BASE_COST = 10000;
    const playerCoin = toInt(player.灵石);
    if (playerCoin < BASE_COST) {
        const now_time = Date.now();
        await redis.set(`xiuxian@1.3.0:${usr_qq}:last_game_time`, now_time);
        await redis.del(`xiuxian@1.3.0:${usr_qq}:game_action`);
        game.yazhu[usr_qq] = 0;
        if (game.game_time[usr_qq])
            clearTimeout(game.game_time[usr_qq]);
        Send(Text('媚娘：钱不够也想玩？'));
        return false;
    }
    const now_time = Date.now();
    const last_game_time_raw = await redis.get(`xiuxian@1.3.0:${usr_qq}:last_game_time`);
    let last_game_time = Number(last_game_time_raw);
    if (!Number.isFinite(last_game_time))
        last_game_time = 0;
    const transferTimeout = toInt(cf?.CD?.gambling, 30) * 1000;
    if (now_time < last_game_time + transferTimeout) {
        const left = last_game_time + transferTimeout - now_time;
        const game_s = Math.ceil(left / 1000);
        Send(Text(`每${transferTimeout / 1000}秒游玩一次。\ncd: ${game_s}秒`));
        return false;
    }
    await redis.set(`xiuxian@1.3.0:${usr_qq}:last_game_time`, now_time);
    const game_action = await redis.get(`xiuxian@1.3.0:${usr_qq}:game_action`);
    if (Number(game_action) === 1) {
        Send(Text('媚娘：猜大小正在进行哦!'));
        return false;
    }
    Send(Text('媚娘：发送[#投入+数字]或[#梭哈]'));
    await redis.set(`xiuxian@1.3.0:${usr_qq}:game_action`, 1);
    return false;
});

export { res as default, regular };
