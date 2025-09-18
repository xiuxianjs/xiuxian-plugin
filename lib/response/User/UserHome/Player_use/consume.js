import { Text, useSubscribe, useMessage, Mention } from 'alemonjs';
import { addNajieThing, existNajieThing } from '../../../../model/najie.js';
import { readEquipment, writeEquipment } from '../../../../model/equipment.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { getDataList } from '../../../../model/DataList.js';
import { writePlayer } from '../../../../model/xiuxiandata.js';
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
import { getRandomTalent } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { selects } from '../../../mw-captcha.js';
import { thingType, toNumber } from './utils.js';

const handleLunhuiFlag = async (userId, player, message) => {
    player.lunhuiBH = 1;
    await writePlayer(userId, player);
    void message.send(format(Text('已得到"轮回阵旗"的辅助，下次轮回可抵御轮回之苦的十之八九')));
    await addNajieThing(userId, '轮回阵旗', '道具', -1);
};
const handleXianmengKey = async (userId, player, message) => {
    if (!player.仙宠) {
        void message.send(format(Text('你还没有出战仙宠')));
        return;
    }
    player.仙宠.灵魂绑定 = 0;
    await writePlayer(userId, player);
    await addNajieThing(userId, '仙梦之匙', '道具', -1);
    void message.send(format(Text('出战仙宠解绑成功!')));
};
const handleCanjuan = async (userId, message, e) => {
    const number = await existNajieThing(userId, '残卷', '道具');
    if (typeof number === 'number' && number > 9) {
        void message.send(format(Text('是否消耗十个卷轴兑换一个八品功法？回复:【兑换*功法名】或者【还是算了】进行选择')));
        const [subscribe] = useSubscribe(e, selects);
        const sub = subscribe.mount(async (event) => {
            const userId = event.UserId;
            const [message] = useMessage(event);
            const choice = event.MessageText;
            const code = choice.split('*');
            const les = code[0];
            const gonfa = code[1];
            clearTimeout(timeout);
            if (les === '还是算了') {
                void message.send(format(Text('取消兑换')));
            }
            else if (les === '兑换') {
                const bapin = await getDataList('Bapin');
                const ifexist2 = bapin.find((item) => item.name === gonfa);
                if (ifexist2) {
                    await addNajieThing(userId, '残卷', '道具', -10);
                    await addNajieThing(userId, gonfa, '功法', 1);
                    void message.send(format(Text(`兑换${gonfa}成功`)));
                }
                else {
                    void message.send(format(Text('残卷无法兑换该功法')));
                }
            }
        }, ['UserId']);
        const timeout = setTimeout(() => {
            try {
                subscribe.cancel(sub);
                void message.send(format(Text('已取消操作')));
            }
            catch (e) {
                logger.error('取消订阅失败', e);
            }
        }, 1000 * 60 * 1);
    }
    else {
        void message.send(format(Text('你没有足够的残卷')));
    }
};
const handleChongzhuStone = async (userId, message) => {
    const equipment = await readEquipment(userId);
    if (!equipment) {
        return;
    }
    const type = ['武器', '护具', '法宝'];
    const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5];
    for (const t of type) {
        const random = Math.trunc(Math.random() * 6);
        const cur = equipment[t];
        if (cur?.pinji === undefined || !z[cur.pinji]) {
            continue;
        }
        cur.atk = (cur.atk / z[cur.pinji]) * z[random];
        cur.def = (cur.def / z[cur.pinji]) * z[random];
        cur.HP = (cur.HP / z[cur.pinji]) * z[random];
        cur.pinji = random;
    }
    await writeEquipment(userId, equipment);
    await addNajieThing(userId, '重铸石', '道具', -1);
    void message.send(format(Text('使用成功,发送#我的装备查看属性')));
};
const handleXisui = async (userId, thingName, player, thingExist, message) => {
    const numberOwned = await existNajieThing(userId, thingName, '道具');
    if ((player.linggenshow ?? 0) !== 0) {
        void message.send(format(Text('你未开灵根，无法洗髓！')));
        return;
    }
    await addNajieThing(userId, thingName, '道具', -1);
    player.灵根 = await getRandomTalent();
    await writePlayer(userId, player);
    await playerEfficiency(userId);
    void message.send(format(Mention(userId), Text([
        `  服用成功,剩余 ${thingName}数量: ${(typeof numberOwned === 'number' ? numberOwned : 0) - 1}，新的灵根为 "${player.灵根.type}"：${player.灵根.name}`,
        '\n可以在【#我的练气】中查看'
    ].join(''))));
};
const handleDinglingZhu = async (userId, thingName, player, message) => {
    await addNajieThing(userId, thingName, '道具', -1);
    player.linggenshow = 0;
    await writePlayer(userId, player);
    void message.send(format(Text(`你眼前一亮，看到了自己的灵根,"${player.灵根.type}"：${player.灵根.name}`)));
};
const handleQianghua = async (userId, thingName, thingExist, player, quantity, message) => {
    const data = {
        qianghua: await getDataList('Qianghua')
    };
    const qh = data.qianghua.find((item) => item.name === thingExist.name);
    if (qh) {
        if (qh.class === '魔头' && (player.魔道值 ?? 0) < 1000) {
            void message.send(format(Text('你还是提升点魔道值再用吧!')));
            return;
        }
        else if (qh.class === '神人' && ((player.魔道值 ?? 0) > 0 || (player.灵根.type !== '转生' && player.level_id < 42))) {
            void message.send(format(Text('你尝试使用它,但是失败了')));
            return;
        }
        if (typeof player.攻击加成 !== 'number') {
            player.攻击加成 = Number(player.攻击加成) || 0;
        }
        if (typeof player.防御加成 !== 'number') {
            player.防御加成 = Number(player.防御加成) || 0;
        }
        if (typeof player.生命加成 !== 'number') {
            player.生命加成 = Number(player.生命加成) || 0;
        }
        player.攻击加成 += toNumber(qh.攻击) * quantity;
        player.防御加成 += toNumber(qh.防御) * quantity;
        player.生命加成 += toNumber(qh.血量) * quantity;
        await writePlayer(userId, player);
        await addNajieThing(userId, thingName, '道具', -quantity);
        void message.send(format(Text(`${qh.msg || '使用成功'}`)));
    }
};
const handleConsume = async (userId, thingName, thingExist, player, quantity, message, e) => {
    switch (thingName) {
        case '轮回阵旗':
            await handleLunhuiFlag(userId, player, message);
            return true;
        case '仙梦之匙':
            await handleXianmengKey(userId, player, message);
            return true;
        case '残卷':
            await handleCanjuan(userId, message, e);
            return true;
        case '重铸石':
            await handleChongzhuStone(userId, message);
            return true;
        case '隐身水':
        case '幸运草':
            void message.send(format(Text('该道具无法在纳戒中消耗')));
            return true;
        case '定灵珠':
            await handleDinglingZhu(userId, thingName, player, message);
            return true;
        case '道具盲盒':
            await handlePropBox(userId, message);
            return true;
    }
    if (thingExist && thingType(thingExist) === '洗髓') {
        await handleXisui(userId, thingName, player, thingExist, message);
        return true;
    }
    await handleQianghua(userId, thingName, thingExist, player, quantity, message);
    return true;
};
async function handlePropBox(userId, message) {
    await addNajieThing(userId, '道具盲盒', '道具', -1);
    const propBoxList = [
        { name: '修仙世界签证', price: 2333, rate: 0.131756 },
        { name: '神石', price: 288888, rate: 0.001064 },
        { name: '武神石', price: 288888, rate: 0.001064 },
        { name: '法神石', price: 288888, rate: 0.001064 },
        { name: '甲神石', price: 288888, rate: 0.001064 },
        { name: '仙府通行证', price: 288888, rate: 0.001064 },
        { name: '仙境优惠券', price: 288888, rate: 0.001064 },
        { name: '杀神崖通行证', price: 288888, rate: 0.001064 },
        { name: '神界秘宝', price: 288888, rate: 0.001064 },
        { name: '闪闪发光的石头', price: 288888, rate: 0.001064 },
        { name: '替身人偶', price: 288888, rate: 0.001064 },
        { name: '百合花篮', price: 288888, rate: 0.001064 },
        { name: '武魂石', price: 288888, rate: 0.001064 },
        { name: '法魂石', price: 288888, rate: 0.001064 },
        { name: '甲魂石', price: 288888, rate: 0.001064 },
        { name: '魔石', price: 288888, rate: 0.001064 },
        { name: '修魔丹', price: 288888, rate: 0.001064 },
        { name: '血魔丹', price: 288888, rate: 0.001064 },
        { name: '魔界秘宝', price: 288888, rate: 0.001064 },
        { name: '摘榜令', price: 288888, rate: 0.001064 },
        { name: '定情信物', price: 1314, rate: 0.233932 },
        { name: '重铸石', price: 288888, rate: 0.001064 },
        { name: '寻物纸', price: 10000, rate: 0.030739 },
        { name: '剑帝一剑', price: 28888, rate: 0.010641 },
        { name: '残卷', price: 1000000, rate: 0.000307 },
        { name: '隐身水', price: 288800, rate: 0.001064 },
        { name: '洗根水', price: 188800, rate: 0.001628 },
        { name: '定灵珠', price: 288800, rate: 0.001064 },
        { name: '矿渣', price: 70000, rate: 0.004391 },
        { name: '碎矿', price: 80000, rate: 0.003842 },
        { name: '小矿', price: 125000, rate: 0.002459 },
        { name: '金矿', price: 150000, rate: 0.002049 },
        { name: '1k', price: 1000, rate: 0.307387 },
        { name: '5k', price: 5000, rate: 0.061477 },
        { name: '1w', price: 10000, rate: 0.030739 },
        { name: '攻击强化', price: 600000, rate: 0.000512 },
        { name: '防御强化', price: 600000, rate: 0.000512 },
        { name: '生命强化', price: 600000, rate: 0.000512 },
        { name: '幸运草', price: 888888, rate: 0.000346 },
        { name: '采药师转职凭证', price: 18880, rate: 0.016281 },
        { name: '采矿师转职凭证', price: 18880, rate: 0.016281 },
        { name: '炼丹师转职凭证', price: 18880, rate: 0.016281 },
        { name: '侠客转职凭证', price: 18880, rate: 0.016281 },
        { name: '炼器师转职凭证', price: 18880, rate: 0.016281 },
        { name: '1级仙石', price: 1000000, rate: 0.000307 },
        { name: '2级仙石', price: 2000000, rate: 0.000154 },
        { name: '3级仙石', price: 3000000, rate: 0.000102 },
        { name: '4级仙石', price: 4000000, rate: 0.000077 },
        { name: '银丝仙网', price: 5000, rate: 0.061477 },
        { name: '金丝仙网', price: 100000, rate: 0.003074 },
        { name: '天罗地网', price: 500000, rate: 0.000615 },
        { name: '长相奇怪的小石头', price: 50000, rate: 0.006148 }
    ];
    const getRandomItem = items => {
        const random = Math.random();
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            sum += items[i].rate;
            if (random < sum) {
                return items[i];
            }
        }
        return items[items.length - 1];
    };
    const item = getRandomItem(propBoxList);
    await addNajieThing(userId, item.name, '道具', 1);
    void message.send(format(Text(`恭喜你，获得了${item.name}`)));
}

export { handleConsume };
