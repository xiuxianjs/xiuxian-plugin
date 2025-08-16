import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { notUndAndNull } from '../../../../model/common.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import { openMoneySystem } from '../../../../model/money.js';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';
import { game } from '../game.js';

const regular = /^(#|＃|\/)?((大|小)|([1-6]))$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const now_time = Date.now();
    const ifexistplay = await existplayer(usr_qq);
    const game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (!ifexistplay || !game_action)
        return false;
    if (isNaN(game.yazhu[usr_qq]))
        return false;
    if (!game.game_key_user[usr_qq]) {
        Send(Text('媚娘：公子，你还没投入呢'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    const es = e.MessageText.replace(/^(#|＃|\/)?/, '');
    if (es !== '大' &&
        es !== '小' &&
        ![1, 2, 3, 4, 5, 6].includes(parseInt(es))) {
        return false;
    }
    let isWin = false;
    let touzi = 0;
    const inputMoney = game.yazhu[usr_qq];
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
            game.yazhu[usr_qq] = Math.trunc(inputMoney * x);
            if (notUndAndNull(player.金银坊胜场)) {
                player.金银坊胜场 = ensureNumber(player.金银坊胜场) + 1;
                player.金银坊收入 =
                    ensureNumber(player.金银坊收入) + ensureNumber(game.yazhu[usr_qq]);
            }
            else {
                player.金银坊胜场 = 1;
                player.金银坊收入 = ensureNumber(game.yazhu[usr_qq]);
            }
            data.setData('player', usr_qq, JSON.parse(JSON.stringify(player)));
            addCoin(usr_qq, game.yazhu[usr_qq]);
            if (y == 1) {
                Send(Text(`骰子最终为 ${touzi} 你猜对了！\n现在拥有灵石:${player.灵石 + game.yazhu[usr_qq]}`));
            }
            else {
                Send(Text(`骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。\n现在拥有灵石:${player.灵石 + game.yazhu[usr_qq]}`));
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
            data.setData('player', usr_qq, JSON.parse(JSON.stringify(player)));
            addCoin(usr_qq, -inputMoney);
            const now_money = player.灵石 - inputMoney;
            const msg = [`骰子最终为 ${touzi} 你猜错了！\n现在拥有灵石:${now_money}`];
            if (now_money <= 0) {
                msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！');
            }
            Send(Text(msg.join('')));
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
            data.setData('player', usr_qq, JSON.parse(JSON.stringify(player)));
            addCoin(usr_qq, winAmount);
            Send(Text(`骰子最终为 ${touzi}，你猜中了！获得${winAmount}灵石\n现在拥有灵石:${player.灵石 + winAmount}`));
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
            data.setData('player', usr_qq, JSON.parse(JSON.stringify(player)));
            addCoin(usr_qq, -inputMoney);
            const now_money = player.灵石 - inputMoney;
            const msg = [`骰子最终为 ${touzi}，你猜错了！\n现在拥有灵石:${now_money}`];
            if (now_money <= 0) {
                msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！');
            }
            Send(Text(msg.join('')));
        }
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
    await redis.del('xiuxian@1.3.0:' + usr_qq + ':game_action');
    game.yazhu[usr_qq] = 0;
    clearTimeout(game.game_time[usr_qq]);
    return false;
});

export { res as default, regular };
