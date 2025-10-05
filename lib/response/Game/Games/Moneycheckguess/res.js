import { getRedisKey, keys } from '../../../../model/keys.js';
import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { notUndAndNull } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import { openMoneySystem } from '../../../../model/money.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';
import { game } from '../game.js';

const regular = /^(#|＃|\/)?((大|小)|([1-6]))$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const gameAction = await redis.get(getRedisKey(userId, 'game_action'));
    if (gameAction && +gameAction !== 1) {
        return false;
    }
    if (isNaN(game.yazhu[userId])) {
        return false;
    }
    if (!game.game_key_user[userId] || !game.yazhu[userId]) {
        void Send(Text('媚娘：公子，你还没投入呢\n>取消请发送【取消梭哈】或【取消投入】'));
        return false;
    }
    const es = e.MessageText.replace(/^(#|＃|\/)?/, '');
    if (es !== '大' && es !== '小' && ![1, 2, 3, 4, 5, 6].includes(parseInt(es))) {
        return false;
    }
    const onClear = async () => {
        await redis.set(getRedisKey(userId, 'last_game_time'), Date.now());
        await redis.del(getRedisKey(userId, 'game_action'));
        game.yazhu[userId] = 0;
        game.game_key_user[userId] = false;
    };
    let isWin = false;
    let touzi = 0;
    const inputMoney = game.yazhu[userId] === -1 ? player.灵石 - 1 : game.yazhu[userId];
    if (inputMoney >= player.灵石) {
        void onClear();
        void Send(Text('媚娘：你这是要把裤衩都输光吗？'));
        return;
    }
    if (inputMoney < 10000) {
        void onClear();
        void Send(Text('媚娘：你身上已不足1w灵石'));
        return;
    }
    function ensureNumber(v) {
        return typeof v === 'number' ? v : parseInt(String(v || 0)) || 0;
    }
    if (/(大|小)/.test(es)) {
        const isBig = /大/.test(es);
        const { win, dice } = await openMoneySystem(isBig, inputMoney);
        isWin = win;
        touzi = dice;
        const cf = await config.getConfig('xiuxian', 'xiuxian');
        const x = cf.percentage.Moneynumber;
        if (isWin) {
            const outMoney = Math.trunc(inputMoney * x);
            if (notUndAndNull(player.金银坊胜场)) {
                player.金银坊胜场 = ensureNumber(player.金银坊胜场) + 1;
                player.金银坊收入 = ensureNumber(player.金银坊收入) + ensureNumber(outMoney);
            }
            else {
                player.金银坊胜场 = 1;
                player.金银坊收入 = ensureNumber(outMoney);
            }
            await setDataJSONStringifyByKey(keys.player(userId), player);
            if (Math.random() < 0.05) {
                void addCoin(userId, -9999);
                void Send(Text(`骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。\n现在拥有灵石:${player.灵石 - 9999}`));
            }
            else {
                void addCoin(userId, outMoney);
                void Send(Text(`骰子最终为 ${touzi} 你猜对了！\n现在拥有灵石:${player.灵石 + outMoney}`));
            }
        }
        else {
            if (notUndAndNull(player.金银坊败场)) {
                player.金银坊败场 = ensureNumber(player.金银坊败场) + 1;
                player.金银坊支出 = ensureNumber(player.金银坊支出) + inputMoney;
            }
            else {
                player.金银坊败场 = 1;
                player.金银坊支出 = inputMoney;
            }
            await setDataJSONStringifyByKey(keys.player(userId), player);
            void addCoin(userId, -inputMoney);
            const nowMoney = player.灵石 - inputMoney;
            const msg = [`骰子最终为 ${touzi} 你猜错了！\n现在拥有灵石:${nowMoney}`];
            if (nowMoney <= 1) {
                msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去赚钱吧！');
            }
            void Send(Text(msg.join('')));
        }
    }
    else {
        const inputNumber = parseInt(es);
        touzi = Math.floor(Math.random() * 6) + 1;
        isWin = inputNumber === touzi;
        if (isWin) {
            const outMoney = inputMoney * 5;
            if (notUndAndNull(player.金银坊胜场)) {
                player.金银坊胜场 = ensureNumber(player.金银坊胜场) + 1;
                player.金银坊收入 = ensureNumber(player.金银坊收入) + outMoney;
            }
            else {
                player.金银坊胜场 = 1;
                player.金银坊收入 = outMoney;
            }
            await setDataJSONStringifyByKey(keys.player(userId), player);
            void addCoin(userId, outMoney);
            void Send(Text(`骰子最终为 ${touzi}，你猜中了！获得${outMoney}灵石\n现在拥有灵石:${player.灵石 + outMoney}`));
        }
        else {
            if (notUndAndNull(player.金银坊败场)) {
                player.金银坊败场 = ensureNumber(player.金银坊败场) + 1;
                player.金银坊支出 = ensureNumber(player.金银坊支出) + inputMoney;
            }
            else {
                player.金银坊败场 = 1;
                player.金银坊支出 = inputMoney;
            }
            await setDataJSONStringifyByKey(keys.player(userId), player);
            void addCoin(userId, -inputMoney);
            const nowMoney = player.灵石 - inputMoney;
            const msg = [`骰子最终为 ${touzi}，你猜错了！\n现在拥有灵石:${nowMoney}`];
            if (nowMoney <= 1) {
                msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去赚钱吧！');
            }
            void Send(Text(msg.join('')));
        }
    }
    void onClear();
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
