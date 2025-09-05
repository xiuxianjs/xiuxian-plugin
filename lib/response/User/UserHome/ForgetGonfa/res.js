import { useMessage, Text, useSubscribe } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?忘掉/;
const res = onResponse(selects, async (e) => {
    const userId = e.UserId;
    const [message] = useMessage(e);
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const goodsName = e.MessageText.replace(/^(#|＃|\/)?忘掉/, '').trim();
    if (!goodsName) {
        return;
    }
    if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(goodsName)) {
        void message.send(format(Text('非法功法名')));
        return;
    }
    const islearned = player.学习的功法.find(item => item === goodsName);
    if (!islearned) {
        void message.send(format(Text('你还没有学过该功法')));
        return false;
    }
    void message.send(format(Text(`你确定要忘掉${goodsName}吗？\n忘掉后的功法将彻底丢失，回复“确认”以继续，回复任意字以取消`)));
    const [subscribe] = useSubscribe(e, selects);
    let timeout = null;
    const sub = subscribe.mount(async (event) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        const userId = event.UserId;
        const [message] = useMessage(event);
        if (/^(#|＃|\/)?确认/.test(event.MessageText)) {
            const player = await readPlayer(userId);
            if (!player) {
                return;
            }
            const islearned = player.学习的功法.find(item => item === goodsName);
            if (!islearned) {
                void message.send(format(Text('你还没有学过该功法')));
                return false;
            }
            player.学习的功法 = player.学习的功法.filter(item => item !== goodsName);
            await writePlayer(userId, player);
            void playerEfficiency(userId);
            void message.send(format(Text(`你忘掉了${goodsName}`)));
        }
        else {
            void message.send(format(Text('已取消操作')));
        }
    }, ['UserId']);
    timeout = setTimeout(() => {
        try {
            subscribe.cancel(sub);
            void message.send(format(Text('已取消操作')));
        }
        catch (e) {
            logger.error('取消订阅失败', e);
        }
    }, 1000 * 60 * 1);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
