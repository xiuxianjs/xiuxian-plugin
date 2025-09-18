import { getRedisKey } from '../../../../model/keys.js';
import { useMessage, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { compulsoryToNumber } from '../../../../model/utils/number.js';
import '@alemonjs/db';
import 'dayjs';
import { readPlayer } from '../../../../model/xiuxiandata.js';
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
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';
import { game } from '../game.js';

const regular = /^(#|＃|\/)?(取消)?(梭哈|投入)(\d+)?$/;
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const gameAction = await redis.get(getRedisKey(userId, 'game_action'));
    if (!gameAction || +gameAction !== 1) {
        return false;
    }
    const onCencel = async () => {
        await redis.set(getRedisKey(userId, 'last_game_time'), Date.now());
        await redis.del(getRedisKey(userId, 'game_action'));
        game.yazhu[userId] = 0;
    };
    if (/取消/.test(e.MessageText)) {
        void onCencel();
        void message.send(format(Text('媚娘：某人看来是玩不起')));
        return;
    }
    const num = e.MessageText.replace(/#|＃|\/|取消|梭哈|投入/g, '');
    const money = 10000;
    if (e.MessageText.includes('梭哈')) {
        if (player.灵石 < money) {
            void message.send(format(Text('媚娘：灵石不足1w，无法梭哈\n>取消请发送【取消梭哈】或【取消投入】')));
            return;
        }
        game.yazhu[userId] = -1;
        game.game_key_user[userId] = true;
        void message.send(format(Text('媚娘：梭哈完成,发送[大|小|1-6]')));
        return false;
    }
    const size = compulsoryToNumber(num);
    if (size < money) {
        void message.send(format(Text(`媚娘：最低押注${money}灵石\n>取消请发送【取消梭哈】或【取消投入】`)));
        return false;
    }
    if (player.灵石 < size) {
        void onCencel();
        void message.send(format(Text('媚娘：你没那么多灵石')));
        return false;
    }
    game.yazhu[userId] = size;
    game.game_key_user[userId] = true;
    void message.send(format(Text('媚娘：投入完成,发送[大|小|1-6]')));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
