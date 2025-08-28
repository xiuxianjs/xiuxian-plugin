import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import { foundthing } from '../../../../model/cultivation.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import { addCoin } from '../../../../model/economy.js';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import { existplayer, readNajie, readPlayer } from '../../../../model/xiuxian_impl.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?上架.*$/;
const PINJI_MAP = {
    劣: 0,
    普: 1,
    优: 2,
    精: 3,
    极: 4,
    绝: 5,
    顶: 6
};
const PINJI_TEXT = ['劣', '普', '优', '精', '极', '绝', '顶'];
function parsePinji(raw) {
    if (!raw) {
        return undefined;
    }
    if (raw in PINJI_MAP) {
        return PINJI_MAP[raw];
    }
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
}
function isPositive(n) {
    return typeof n === 'number' && Number.isFinite(n) && n > 0;
}
function normalizeCategory(v) {
    return String(v);
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?上架/, '').trim();
    if (!raw) {
        void Send(Text('格式：#上架物品名*价格*数量 (装备/仙宠可附加 *品级)'));
        return false;
    }
    const parts = raw
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (parts.length < 2) {
        void Send(Text('参数不足，至少需要 物品*价格*数量'));
        return false;
    }
    let thingName = parts[0];
    const numericCode = Number(parts[0]);
    if (Number.isInteger(numericCode)) {
        if (numericCode > 1000) {
            const pet = najie.仙宠?.[numericCode - 1001];
            if (!pet) {
                void Send(Text('仙宠代号输入有误!'));
                return false;
            }
            thingName = pet.name;
        }
        else if (numericCode > 100) {
            const equip = najie.装备?.[numericCode - 101];
            if (!equip) {
                void Send(Text('装备代号输入有误!'));
                return false;
            }
            thingName = equip.name;
        }
    }
    const thingDefRaw = await foundthing(thingName);
    if (!thingDefRaw) {
        void Send(Text(`这方世界没有[${thingName}]`));
        return false;
    }
    const baseItem = {
        name: String(thingDefRaw.name || thingName),
        class: String(thingDefRaw.class || thingDefRaw.type || '道具')
    };
    const itemClass = normalizeCategory(baseItem.class);
    let pinjiInput;
    let priceRaw;
    let amountRaw;
    if (itemClass === '装备') {
        const attemptPinji = parsePinji(parts[1]);
        if (attemptPinji !== undefined) {
            pinjiInput = attemptPinji;
            priceRaw = parts[2];
            amountRaw = parts[3];
        }
        else {
            priceRaw = parts[1];
            amountRaw = parts[2];
        }
    }
    else {
        priceRaw = parts[1];
        amountRaw = parts[2];
    }
    const price = convert2integer(priceRaw);
    const amount = convert2integer(amountRaw);
    if (!isPositive(price) || !isPositive(amount)) {
        void Send(Text('价格与数量需为正整数'));
        return false;
    }
    let selected;
    let finalPinji = pinjiInput;
    if (itemClass === '装备') {
        const equips = (najie.装备 || []).filter(i => i.name === thingName);
        if (!equips.length) {
            void Send(Text(`你没有[${thingName}]`));
            return false;
        }
        if (finalPinji !== undefined) {
            selected = equips.find(ei => ei.pinji === finalPinji);
            if (!selected) {
                void Send(Text(`你没有该品级的[${thingName}]`));
                return false;
            }
        }
        else {
            selected = equips.reduce((p, c) => (c.pinji > p.pinji ? c : p));
            finalPinji = selected.pinji;
        }
    }
    else if (itemClass === '仙宠') {
        const pets = (najie.仙宠 || []).filter(i => i.name === thingName);
        if (!pets.length) {
            void Send(Text(`你没有[${thingName}]`));
            return false;
        }
        selected = pets[0];
    }
    if ((itemClass === '装备' || itemClass === '仙宠') && amount !== 1) {
        void Send(Text(`${itemClass}一次只能上架 1 个`));
        return false;
    }
    const ownedCount = await existNajieThing(userId, thingName, itemClass, finalPinji);
    if (!ownedCount || ownedCount < amount) {
        void Send(Text(`你没有那么多[${thingName}]`));
        return false;
    }
    const totalPrice = Math.trunc(price * amount);
    if (!isPositive(totalPrice)) {
        void Send(Text('总价计算异常'));
        return false;
    }
    let fee = Math.trunc(totalPrice * 0.03);
    if (fee < 100000) {
        fee = 100000;
    }
    const player = await readPlayer(userId);
    if (player.灵石 < fee) {
        void Send(Text(`就这点灵石还想上架，需要手续费 ${fee}`));
        return false;
    }
    await addCoin(userId, -fee);
    let exchange = [];
    try {
        const data = await readExchange();
        if (Array.isArray(data)) {
            exchange = data;
        }
    }
    catch {
        await writeExchange([]);
    }
    const nowTime = Date.now();
    let newRecord;
    if (itemClass === '装备' || itemClass === '仙宠') {
        if (!selected) {
            void Send(Text('内部错误：未选中上架对象'));
            return false;
        }
        const pinjiText = PINJI_TEXT[finalPinji ?? 0] ?? '劣';
        newRecord = {
            thing: {
                name: thingName,
                class: itemClass,
                pinji: pinjiText,
                pinji2: finalPinji,
                名号: thingName
            },
            price,
            amount,
            qq: userId,
            now_time: nowTime
        };
        await addNajieThing(userId, selected.name, itemClass, -amount, finalPinji);
    }
    else {
        newRecord = {
            thing: { name: thingName, class: itemClass },
            price,
            amount,
            qq: userId,
            now_time: nowTime
        };
        await addNajieThing(userId, thingName, itemClass, -amount);
    }
    exchange.push(newRecord);
    await writeExchange(exchange);
    void Send(Text('上架成功！'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
