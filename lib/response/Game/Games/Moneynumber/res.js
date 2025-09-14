import { getRedisKey } from '../../../../model/keys.js';
import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { Go } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';
import { game } from '../game.js';

const regular = /^(#|＃|\/)?金银坊$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const gameswitch = cf?.sw?.Moneynumber;
    if (gameswitch !== true) {
        return false;
    }
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const toInt = (v, d = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : d;
    };
    const BASE_COST = 10000;
    const playerCoin = toInt(player.灵石);
    if (playerCoin < BASE_COST) {
        await redis.set(getRedisKey(userId, 'last_game_time'), Date.now());
        await redis.del(getRedisKey(userId, 'game_action'));
        game.yazhu[userId] = 0;
        void Send(Text('媚娘：钱不够也想玩？'));
        return false;
    }
    const gameAction = await redis.get(getRedisKey(userId, 'game_action'));
    if (gameAction && +gameAction === 1) {
        void Send(Text('媚娘：猜大小正在进行哦!'));
        return false;
    }
    const last_game_time_raw = await redis.get(getRedisKey(userId, 'last_game_time'));
    let last_game_time = Number(last_game_time_raw);
    if (!Number.isFinite(last_game_time)) {
        last_game_time = 0;
    }
    const transferTimeout = toInt(cf?.CD?.gambling, 30) * 1000;
    if (Date.now() < last_game_time + transferTimeout) {
        const left = last_game_time + transferTimeout - Date.now();
        const game_s = Math.ceil(left / 1000);
        void Send(Text(`每${transferTimeout / 1000}秒游玩一次。\ncd: ${game_s}秒`));
        return false;
    }
    await redis.set(getRedisKey(userId, 'last_game_time'), Date.now());
    await redis.set(getRedisKey(userId, 'game_action'), 1);
    void Send(Text('媚娘：发送[#投入+数字]或[#梭哈]\n>取消请发送【取消投入】或【取消梭哈】'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
