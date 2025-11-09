import '../../../../model/api.js';
import { keysLock, keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import { getDataList } from '../../../../model/DataList.js';
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
import 'dayjs';
import 'buffer';
import '@alemonjs/db';
import { useMessage, Text } from 'alemonjs';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import { findUserRechargeInfo, consumeUserCurrency } from '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { withLock } from '../../../../model/locks.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?仙缘兑换/;
const resolveNajieCategoryByThingName = async (name) => {
    const [equip, danyao, newDanyao, daoju, gongfa, caoyao, duanzhaoCailiao, duanzhaoWuqi, duanzhaoHuju, duanzhaoBaowu, zalei, pets, petFood] = await Promise.all([
        getDataList('Equipment'),
        getDataList('Danyao'),
        getDataList('NewDanyao'),
        getDataList('Daoju'),
        getDataList('Gongfa'),
        getDataList('Caoyao'),
        getDataList('Duanzhaocailiao'),
        getDataList('Duanzhaowuqi'),
        getDataList('Duanzhaohuju'),
        getDataList('Duanzhaobaowu'),
        getDataList('Zalei'),
        getDataList('Xianchon'),
        getDataList('Xianchonkouliang')
    ]);
    if (equip.some(i => i.name === name)
        || duanzhaoWuqi.some(i => i.name === name)
        || duanzhaoHuju.some(i => i.name === name)
        || duanzhaoBaowu.some(i => i.name === name)) {
        return '装备';
    }
    if (danyao.some(i => i.name === name) || newDanyao.some(i => i.name === name)) {
        return '丹药';
    }
    if (daoju.some(i => i.name === name) || zalei.some(i => i.name === name)) {
        return '道具';
    }
    if (gongfa.some(i => i.name === name)) {
        return '功法';
    }
    if (caoyao.some(i => i.name === name)) {
        return '草药';
    }
    if (duanzhaoCailiao.some(i => i.name === name)) {
        return '材料';
    }
    if (pets.some(i => i.name === name)) {
        return '仙宠';
    }
    if (petFood.some(i => i.name === name)) {
        return '仙宠口粮';
    }
    return undefined;
};
const appendMonthMarketExchangeRecord = async (record) => {
    const key = keys.exchange('MonthMarket');
    const old = await getDataJSONParseByKey(key);
    const list = Array.isArray(old) ? old : [];
    list.push(record);
    await setDataJSONStringifyByKey(key, list);
};
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const [itemName, itemCount = 1] = e.MessageText.replace(/仙缘兑换/, '')
        .split(' ')
        .slice(1);
    if (!itemName) {
        void message.send(format(Text('用法：#仙缘兑换 物品名 数量')));
        return;
    }
    const countRaw = Number(itemCount);
    if (!Number.isFinite(countRaw) || !Number.isInteger(countRaw) || countRaw <= 0) {
        void message.send(format(Text('数量需为正整数')));
        return;
    }
    const count = countRaw;
    const lockKey = keysLock.task(`month_market_buy:${e.UserId}`);
    const lockResult = await withLock(lockKey, async () => {
        const monthMarketList = await getDataList('MonthMarket');
        const findItem = monthMarketList.find(item => item.name === itemName);
        if (!findItem) {
            void message.send(format(Text(`[${itemName}]不存在，请检查物品名称是否正确`)));
            return;
        }
        const unitPrice = Number(findItem.price) || 0;
        const totalPrice = unitPrice * count;
        const info = await findUserRechargeInfo(e.UserId);
        const balance = info?.currency ?? 0;
        const ok = await consumeUserCurrency(e.UserId, totalPrice);
        if (!ok) {
            void message.send(format(Text(`仙缘币不足，当前余额：${balance}，兑换所需：${totalPrice}`)));
            return;
        }
        const category = findItem?.class || (await resolveNajieCategoryByThingName(itemName));
        if (!category) {
            void message.send(format(Text(`物品[${itemName}]无法识别分类，请联系管理员处理`)));
            return;
        }
        const isEquipment = category === '装备' || findItem.atk !== undefined || findItem.def !== undefined || findItem.HP !== undefined || findItem.bao !== undefined;
        if (isEquipment) {
            const equipmentObj = {
                name: itemName,
                class: category,
                type: findItem.type,
                atk: findItem.atk,
                def: findItem.def,
                HP: findItem.HP,
                bao: findItem.bao,
                数量: 1,
                出售价: unitPrice
            };
            for (let i = 0; i < count; i++) {
                await addNajieThing(e.UserId, equipmentObj, '装备', 1);
            }
        }
        else if (category === '仙宠') {
            const isPetObject = findItem?.class === '仙宠';
            if (isPetObject) {
                const xianchonData = await getDataList('Xianchon');
                const baseDef = Array.isArray(xianchonData) ? xianchonData.find(i => i?.name === itemName) : undefined;
                const level = typeof baseDef?.等级 === 'number' ? Math.trunc(baseDef.等级) : 1;
                const per = typeof baseDef?.每级增加 === 'number' ? baseDef.每级增加 : typeof baseDef?.初始加成 === 'number' ? baseDef.初始加成 : 0;
                const bonus = level * (per || 0);
                const petObj = {
                    name: itemName,
                    class: '仙宠',
                    type: findItem.type ?? '孵化',
                    desc: findItem.desc ?? '',
                    等级: level,
                    每级增加: per,
                    加成: bonus,
                    出售价: unitPrice
                };
                await addNajieThing(e.UserId, petObj, '仙宠', count);
            }
            else {
                await addNajieThing(e.UserId, itemName, '仙宠', count);
            }
        }
        else {
            await addNajieThing(e.UserId, itemName, category, count);
        }
        const record = {
            thing: {
                name: itemName,
                class: category,
                数量: count,
                出售价: unitPrice
            },
            price: unitPrice,
            amount: count,
            qq: e.UserId,
            now_time: Date.now()
        };
        await appendMonthMarketExchangeRecord(record);
        const afterInfo = await findUserRechargeInfo(e.UserId);
        const afterBalance = afterInfo?.currency ?? Math.max(0, balance - totalPrice);
        void message.send(format(Text(`您兑换了${count}个[${itemName}]，共花费${totalPrice}仙缘币；当前余额：${afterBalance}`)));
    }, {
        timeout: 30000,
        retryDelay: 100,
        maxRetries: 5,
        enableRenewal: true,
        renewalInterval: 10000
    });
    if (!lockResult.success) {
        void message.send(format(Text('正在处理你的上一笔兑换，请稍后再试')));
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
