import { useSend, Text } from 'alemonjs';
import { compulsoryToNumber } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import { keysLock } from '../../../../model/keys.js';
import '@alemonjs/db';
import { Go } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';
import { withLock } from '../../../../model/locks.js';

const regular = /^(#|＃|\/)?选购.*$/;
const byGoods = async ({ e, index, count }) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const Exchange = await readExchange();
    if (index >= Exchange.length) {
        return;
    }
    const goods = Exchange[index];
    if (!goods) {
        void Send(Text('物品不存在'));
        return;
    }
    const thingqq = goods.qq;
    if (thingqq === userId) {
        void Send(Text('自己买自己的东西？'));
        return;
    }
    const thingName = goods.thing.name;
    const thingClass = goods.thing.class;
    const thingCount = goods.amount;
    const thingPrice = goods.price;
    const pinji2 = goods.thing?.pinji2;
    if (count > thingCount) {
        void Send(Text(`没有这么多【${thingName}】!`));
        return;
    }
    const money = count * thingPrice;
    const calculateTax = (totalPrice) => {
        const million = 1000000;
        const baseTaxRate = 0.03;
        if (totalPrice < million) {
            return Math.floor(totalPrice * baseTaxRate);
        }
        const millionCount = Math.ceil(totalPrice / million);
        const taxRate = baseTaxRate * millionCount;
        if (taxRate > 0.45) {
            return Math.floor(totalPrice * 0.45);
        }
        return Math.floor(totalPrice * taxRate);
    };
    const tax = calculateTax(money);
    const sellerReceives = money - tax;
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家信息不存在'));
        return;
    }
    if (player.灵石 >= money) {
        const types = ['装备', '仙宠'];
        if (thingClass && types.includes(thingClass)) {
            if (goods.thing.atk !== undefined || goods.thing.def !== undefined || goods.thing.HP !== undefined || goods.thing.bao !== undefined) {
                const fullEquipment = {
                    name: thingName,
                    class: thingClass,
                    pinji: pinji2,
                    atk: goods.thing.atk,
                    def: goods.thing.def,
                    HP: goods.thing.HP,
                    bao: goods.thing.bao,
                    type: goods.thing.type,
                    数量: count,
                    出售价: goods.thing.出售价
                };
                await addNajieThing(userId, fullEquipment, thingClass, count);
            }
            else {
                await addNajieThing(userId, thingName, thingClass, count, pinji2);
            }
        }
        else {
            await addNajieThing(userId, thingName, thingClass, count);
        }
        await addCoin(userId, -money);
        await addCoin(thingqq, sellerReceives);
        Exchange[index].amount = Exchange[index].amount - count;
        await writeExchange(Exchange.filter(item => item.amount > 0));
        let message = `${player.名号}在冲水堂购买了${count}个【${thingName}】！\n支付金额：${money}灵石`;
        if (tax > 0) {
            message += `\n卖家获得：${sellerReceives}灵石（已扣除${tax}灵石税费）`;
        }
        else {
            message += `\n卖家获得：${sellerReceives}灵石`;
        }
        void Send(Text(message));
    }
    else {
        void Send(Text('醒醒，你没有那么多钱！'));
    }
};
const executeBattleWithLock = async (props) => {
    const lockKey = keysLock.exchange(String(props.index));
    const result = await withLock(lockKey, async () => {
        await byGoods(props);
    }, {
        timeout: 30000,
        retryDelay: 100,
        maxRetries: 5,
        enableRenewal: true,
        renewalInterval: 10000
    });
    if (!result.success) {
        const Send = useSend(props.e);
        logger.error('Exchange purchase lock error:', result.error);
        void Send(Text('操作失败，请稍后再试'));
    }
};
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*');
    if (!/^[1-9]\d*$/.test(t[0])) {
        void Send(Text(`请输入正确的编号,${t[0]}不是合法的数字`));
        return false;
    }
    const index = compulsoryToNumber(t[0], 1) - 1;
    const count = compulsoryToNumber(t[1], 1);
    void executeBattleWithLock({ e, index, count });
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
