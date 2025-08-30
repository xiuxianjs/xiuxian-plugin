import { getRedisKey, keys } from '../../../../model/keys.js';
import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { notUndAndNull } from '../../../../model/common.js';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { openMoneySystem } from '../../../../model/money.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';
import { game } from '../game.js';

const regular = /^(#|＃|\/)?((大|小)|([1-6]))$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const now_time = Date.now();
    const ifexistplay = await existplayer(userId);
    const game_action = await redis.get(getRedisKey(userId, 'game_action'));
    if (!ifexistplay || !game_action) {
        return false;
    }
    if (isNaN(game.yazhu[userId])) {
        return false;
    }
    if (!game.game_key_user[userId]) {
        void Send(Text('媚娘：公子，你还没投入呢'));
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const es = e.MessageText.replace(/^(#|＃|\/)?/, '');
    if (es !== '大' && es !== '小' && ![1, 2, 3, 4, 5, 6].includes(parseInt(es))) {
        return false;
    }
    let isWin = false;
    let touzi = 0;
    const inputMoney = game.yazhu[userId];
    function ensureNumber(v) {
        return typeof v === 'number' ? v : parseInt(String(v || 0)) || 0;
    }
    if (/^(#|＃|\/)?(大|小)$/.test(es)) {
        const isBig = es === '大';
        const { win, dice } = await openMoneySystem(isBig, inputMoney);
        isWin = win;
        touzi = dice;
        const cf = await config.getConfig('xiuxian', 'xiuxian');
        let x = cf.percentage.Moneynumber;
        let y = 1;
        const z = cf.size.Money * 10000;
        if (isWin) {
            if (inputMoney >= z) {
                x = cf.percentage.punishment;
                y = 0;
            }
            game.yazhu[userId] = Math.trunc(inputMoney * x);
            if (notUndAndNull(player.金银坊胜场)) {
                player.金银坊胜场 = ensureNumber(player.金银坊胜场) + 1;
                player.金银坊收入 = ensureNumber(player.金银坊收入) + ensureNumber(game.yazhu[userId]);
            }
            else {
                player.金银坊胜场 = 1;
                player.金银坊收入 = ensureNumber(game.yazhu[userId]);
            }
            await setDataJSONStringifyByKey(keys.player(userId), player);
            void addCoin(userId, game.yazhu[userId]);
            if (y === 1) {
                void Send(Text(`骰子最终为 ${touzi} 你猜对了！\n现在拥有灵石:${player.灵石 + game.yazhu[userId]}`));
            }
            else {
                void Send(Text(`骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。\n现在拥有灵石:${player.灵石 + game.yazhu[userId]}`));
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
            const now_money = player.灵石 - inputMoney;
            const msg = [`骰子最终为 ${touzi} 你猜错了！\n现在拥有灵石:${now_money}`];
            if (now_money <= 0) {
                msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！');
            }
            void Send(Text(msg.join('')));
        }
    }
    else {
        const inputNumber = parseInt(es);
        touzi = Math.floor(Math.random() * 6) + 1;
        isWin = inputNumber === touzi;
        if (isWin) {
            const winAmount = inputMoney * 5;
            if (notUndAndNull(player.金银坊胜场)) {
                player.金银坊胜场 = ensureNumber(player.金银坊胜场) + 1;
                player.金银坊收入 = ensureNumber(player.金银坊收入) + winAmount;
            }
            else {
                player.金银坊胜场 = 1;
                player.金银坊收入 = winAmount;
            }
            await setDataJSONStringifyByKey(keys.player(userId), player);
            void addCoin(userId, winAmount);
            void Send(Text(`骰子最终为 ${touzi}，你猜中了！获得${winAmount}灵石\n现在拥有灵石:${player.灵石 + winAmount}`));
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
            const now_money = player.灵石 - inputMoney;
            const msg = [`骰子最终为 ${touzi}，你猜错了！\n现在拥有灵石:${now_money}`];
            if (now_money <= 0) {
                msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！');
            }
            void Send(Text(msg.join('')));
        }
    }
    await redis.set(getRedisKey(userId, 'last_game_time'), now_time);
    await redis.del(getRedisKey(userId, 'game_action'));
    game.yazhu[userId] = 0;
    clearTimeout(game.game_time[userId]);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
