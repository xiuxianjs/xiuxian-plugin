import { redis } from '../api.js';
import { notUndAndNull } from '../common.js';
import { zdBattle } from '../battle.js';
import { addNajieThing } from '../najie.js';
import { readShop, writeShop, existshop } from '../shop.js';
import { keysAction } from '../keys.js';
import { screenshot } from '../../image/index.js';
import { getAvatar } from '../utils/utilsx.js';
import { getAuctionKeyManager } from '../auction.js';
import { setDataJSONStringifyByKey } from '../DataControl.js';
import '../settions.js';
import 'dayjs';
import { Image, Mention, Text } from 'alemonjs';
import '@alemonjs/db';
import 'svg-captcha';
import 'sharp';
import '../DataList.js';
import '../currency.js';
import 'crypto';
import 'posthog-node';
import '../message.js';
import { setMessage } from '../MessageSystem.js';

const onXijie = async (playerId, action, npcList) => {
    let pushAddress;
    let isGroup = false;
    if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
        if (notUndAndNull(action.group_id)) {
            isGroup = true;
            pushAddress = action.group_id;
        }
    }
    const msg = [];
    let endTime = action.end_time;
    const nowTime = Date.now();
    const durRaw = typeof action.time === 'number' ? action.time : parseInt(String(action.time ?? 0), 10);
    const dur = isNaN(durRaw) ? 0 : durRaw;
    endTime = endTime - dur + 60000 * 10;
    if (typeof endTime === 'number' && nowTime >= endTime) {
        const weizhi = action.Place_address;
        if (!weizhi) {
            return;
        }
        let i;
        for (i = 0; i < npcList.length; i++) {
            if (npcList[i].name === weizhi.name) {
                break;
            }
        }
        const playerA = action.playerA;
        let monsterLength;
        let monsterIndex;
        let monster;
        if (weizhi.Grade === 1) {
            monsterLength = npcList[i].one.length;
            monsterIndex = Math.trunc(Math.random() * monsterLength);
            monster = npcList[i].one[monsterIndex];
        }
        else if (weizhi.Grade === 2) {
            monsterLength = npcList[i].two.length;
            monsterIndex = Math.trunc(Math.random() * monsterLength);
            monster = npcList[i].two[monsterIndex];
        }
        else {
            monsterLength = npcList[i].three.length;
            monsterIndex = Math.trunc(Math.random() * monsterLength);
            monster = npcList[i].three[monsterIndex];
        }
        const playerB = {
            名号: monster.name,
            攻击: Math.floor(monster.atk * playerA.攻击),
            防御: Math.floor((monster.def * playerA.防御) / (1 + weizhi.Grade * 0.05)),
            当前血量: Math.floor((monster.blood * playerA.当前血量) / (1 + weizhi.Grade * 0.05)),
            暴击率: monster.baoji,
            灵根: monster.灵根
        };
        let dataBattle;
        let lastMessage = '';
        const talent = playerA.灵根;
        const getTalentName = (t) => (typeof t === 'object' && t !== null && 'name' in t ? String(t.name) : '凡灵根');
        const getTalentType = (t) => (typeof t === 'object' && t !== null && 'type' in t ? String(t.type) : '普通');
        const getTalentRate = (t) => (typeof t === 'object' && t !== null && '法球倍率' in t ? Number(t.法球倍率) || 1 : 1);
        const dataBattleA = {
            名号: playerA.名号,
            攻击: playerA.攻击,
            防御: playerA.防御,
            当前血量: playerA.当前血量,
            暴击率: playerA.暴击率 ?? 0.05,
            灵根: {
                name: getTalentName(talent),
                type: getTalentType(talent),
                法球倍率: getTalentRate(talent)
            }
        };
        if ((playerA.魔值 ?? 0) === 0) {
            dataBattle = await zdBattle(dataBattleA, playerB);
            lastMessage += playerA.名号 + '悄悄靠近' + playerB.名号;
            playerA.当前血量 += dataBattle.A_xue;
        }
        else {
            dataBattle = await zdBattle(playerB, dataBattleA);
            lastMessage += playerA.名号 + '杀气过重,被' + playerB.名号 + '发现了';
            playerA.当前血量 += dataBattle.B_xue;
        }
        const msgg = dataBattle.msg;
        const winA = `${playerA.名号}击败了${playerB.名号}`;
        const winB = `${playerB.名号}击败了${playerA.名号}`;
        try {
            const playerAInfo = {
                id: playerId,
                name: dataBattleA?.名号,
                avatar: getAvatar(playerId),
                power: playerA.攻击 * playerA.防御,
                hp: dataBattleA?.当前血量 ?? 0,
                maxHp: playerA.血量上限 ?? playerA.当前血量
            };
            const playerBInfo = {
                id: '1715713638',
                name: playerB?.名号,
                avatar: getAvatar('1715713638'),
                power: playerB.攻击 * playerB.防御,
                hp: playerB?.当前血量 ?? 0,
                maxHp: playerB.当前血量
            };
            const img = await screenshot('CombatResult', playerId, {
                msg: msgg,
                playerA: playerAInfo,
                playerB: playerBInfo,
                result: msgg.includes(winA) ? 'A' : msgg.includes(winB) ? 'B' : 'draw'
            });
            if (Buffer.isBuffer(img)) {
                void setMessage({
                    id: '',
                    uid: playerId,
                    cid: isGroup && pushAddress ? pushAddress : '',
                    data: JSON.stringify(isGroup && pushAddress ? format(Image(img), Mention(playerId)) : format(Image(img)))
                });
            }
        }
        catch (error) {
            logger.error(error);
        }
        const arr = action;
        if (msgg.find(item => item === winA)) {
            const time = 10;
            const actionTime = 60000 * time;
            arr.playerA = playerA;
            arr.action = '搜刮';
            arr.end_time = Date.now() + actionTime;
            arr.time = actionTime;
            arr.xijie = '-1';
            lastMessage += ',经过一番战斗,击败对手,剩余' + playerA.当前血量 + '血量,开始搜刮物品';
        }
        else if (msgg.find(item => item === winB)) {
            const num = weizhi.Grade;
            lastMessage += ',经过一番战斗,败下阵来,被抓进了地牢\n在地牢中你找到了秘境之匙x' + num;
            await addNajieThing(playerId, '秘境之匙', '道具', num);
            delete arr.group_id;
            const shop = await readShop();
            for (i = 0; i < shop.length; i++) {
                if (shop[i].name === weizhi.name) {
                    shop[i].state = 0;
                    break;
                }
            }
            await writeShop(shop);
            const time = 60;
            const actionTime = 60000 * time;
            arr.action = '禁闭';
            arr.xijie = '1';
            arr.end_time = Date.now() + actionTime;
            const auctionKeyManager = getAuctionKeyManager();
            const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
            const groupList = await redis.smembers(groupListKey);
            const tip = `【全服公告】${playerA.名号}被${playerB.名号}抓进了地牢,希望大家遵纪守法,引以为戒`;
            for (const groupId of groupList) {
                void setMessage({
                    id: '',
                    uid: playerId,
                    cid: groupId,
                    data: JSON.stringify(isGroup && pushAddress ? format(Text(tip), Mention(playerId)) : format(Text(tip)))
                });
            }
        }
        await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
        msg.push('\n' + lastMessage);
        void setMessage({
            id: '',
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : '',
            data: JSON.stringify(isGroup && pushAddress ? format(Text(msg.join('')), Mention(playerId)) : format(Text(msg.join(''))))
        });
    }
};
const onXijieNext = async (playerId, action) => {
    let pushAddress;
    let isGroup = false;
    if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
        if (notUndAndNull(action.group_id)) {
            isGroup = true;
            pushAddress = action.group_id;
        }
    }
    const msg = [];
    let endTime = action.end_time;
    const nowTime = Date.now();
    const dur2Raw = typeof action.time === 'number' ? action.time : parseInt(String(action.time ?? 0), 10);
    const dur2 = isNaN(dur2Raw) ? 0 : dur2Raw;
    endTime = endTime - dur2 + 60000 * 5;
    if (typeof endTime === 'number' && nowTime >= endTime) {
        const weizhi = action.Place_address;
        if (!weizhi) {
            return;
        }
        let thing = await existshop(weizhi.name);
        const arr = action;
        let lastMessage = '';
        const thingName = [];
        let shop = await readShop();
        let i;
        for (i = 0; i < shop.length; i++) {
            if (shop[i].name === weizhi.name) {
                break;
            }
        }
        if (!thing) {
            lastMessage += '已经被搬空了';
        }
        else {
            const gradeNum = Number(shop[i].Grade ?? 0) || 0;
            let x = gradeNum * 2;
            while (x > 0 && thing !== false) {
                const t = (() => {
                    const thingIndex = Math.trunc(Math.random() * thing.length);
                    return thing[thingIndex];
                })();
                thingName.push(t);
                shop = await readShop();
                for (let j = 0; j < shop[i].one.length; j++) {
                    if (shop[i].one[j].name === t.name && shop[i].one[j].数量 > 0) {
                        shop[i].one[j].数量 = 0;
                        await writeShop(shop);
                        break;
                    }
                }
                thing = await existshop(weizhi.name);
                x--;
            }
            lastMessage += '经过一番搜寻' + arr.playerA.名号 + '找到了';
            for (let j = 0; j < thingName.length; j++) {
                lastMessage += '\n' + thingName[j].name + ' x ' + thingName[j].数量;
            }
            lastMessage += '\n刚出门就被万仙盟的人盯上了,他们仗着人多，你一人无法匹敌，于是撒腿就跑';
        }
        const handelTaopao = () => {
            arr.action = '逃跑';
            const time = 30;
            const actionTime = 60000 * time;
            arr.end_time = Date.now() + actionTime;
            arr.time = actionTime;
            arr.xijie = '-2';
            arr.thing = thingName;
            const gradeNumFinal = Number(action.Place_address?.Grade ?? 0) || 0;
            arr.cishu = gradeNumFinal + 1;
        };
        handelTaopao();
        await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
        msg.push('\n' + lastMessage);
        void setMessage({
            id: '',
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : '',
            data: JSON.stringify(isGroup && pushAddress ? format(Text(msg.join('')), Mention(playerId)) : format(Text(msg.join(''))))
        });
    }
};
const handelAction = (playerId, action, { npcList }) => {
    try {
        if (!npcList || npcList.length === 0) {
            return;
        }
        if (action.xijie === '0') {
            void onXijie(playerId, action, npcList);
        }
        else if (action.xijie === '-1') {
            void onXijieNext(playerId, action);
        }
    }
    catch (error) {
        logger.error(error);
    }
};

export { handelAction };
