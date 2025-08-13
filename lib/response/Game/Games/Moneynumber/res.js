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
import '../../../../model/danyao.js';
import { Go } from '../../../../model/common.js';
import 'lodash-es';
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
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
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
