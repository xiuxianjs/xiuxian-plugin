import { getRedisKey } from '../../../../model/keys.js';
import { useMessage, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';
import { game } from '../game.js';

const regular = /^(#|＃|\/)?((梭哈)|(投入\d+))$/;
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const usr_qq = e.UserId;
    const now_time = Date.now();
    const ifexistplay = await existplayer(usr_qq);
    const game_action = await redis.get(getRedisKey(usr_qq, 'game_action'));
    if (!ifexistplay || !game_action) {
        return false;
    }
    const num = e.MessageText.replace(/#|＃|\/|梭哈|投入/g, '');
    if (e.MessageText.includes('梭哈')) {
        const player = await readPlayer(usr_qq);
        game.yazhu[usr_qq] = player.灵石 - 1;
        game.game_key_user[usr_qq] = true;
        message.send(format(Text('媚娘：梭哈完成,发送[大|小|1-6]')));
        return false;
    }
    if (parseInt(num) <= 0 || isNaN(parseInt(num))) {
        message.send(format(Text('媚娘：请输入正确的投入金额')));
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (player.灵石 >= parseInt(num)) {
        game.yazhu[usr_qq] = parseInt(num);
        const money = 10000;
        if (game.yazhu[usr_qq] >= money) {
            game.game_key_user[usr_qq] = true;
            message.send(format(Text('媚娘：投入完成,发送[大|小|1-6]')));
            return;
        }
        else {
            await redis.set(getRedisKey(usr_qq, 'last_game_time'), now_time);
            await redis.del(getRedisKey(usr_qq, 'game_action'));
            game.yazhu[usr_qq] = 0;
            clearTimeout(game.game_time[usr_qq]);
            message.send(format(Text('媚娘：钱不够也想玩？')));
            return;
        }
    }
});

export { res as default, regular };
