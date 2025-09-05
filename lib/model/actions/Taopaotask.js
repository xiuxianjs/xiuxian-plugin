import { redis } from '../api.js';
import { notUndAndNull } from '../common.js';
import { Harm } from '../battle.js';
import { readShop, writeShop } from '../shop.js';
import { addNajieThing } from '../najie.js';
import { keysAction } from '../keys.js';
import { Text } from 'alemonjs';
import { NAJIE_CATEGORIES } from '../settions.js';
import { getAuctionKeyManager } from '../auction.js';
import { setDataJSONStringifyByKey } from '../DataControl.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import 'classnames';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import '@alemonjs/db';
import 'svg-captcha';
import 'sharp';
import '../DataList.js';
import '../currency.js';
import 'crypto';
import 'posthog-node';
import '../message.js';
import { pushMessage } from '../MessageSystem.js';

function isNajieCategory(v) {
    return typeof v === 'string' && NAJIE_CATEGORIES.includes(v);
}
const getWanxianmengIndex = (npcList) => {
    return npcList.findIndex(npc => npc.name === '万仙盟');
};
const getRandomMonster = (npcList, wanxianmengIndex, grade) => {
    const npc = npcList[wanxianmengIndex];
    let monsterList;
    if (grade === 1) {
        monsterList = npc.one || [];
    }
    else if (grade === 2) {
        monsterList = npc.two || [];
    }
    else {
        monsterList = npc.three || [];
    }
    const monsterIndex = Math.trunc(Math.random() * monsterList.length);
    return monsterList[monsterIndex] || monsterList[0];
};
const createMonsterData = (monster, player, grade) => {
    return {
        名号: monster.name,
        攻击: Math.floor(Number(monster.atk || 0) * Number(player.攻击 || 0)),
        防御: Math.floor((Number(monster.def || 0) * Number(player.防御 || 0)) / (1 + Number(grade) * 0.05)),
        当前血量: Math.floor((Number(monster.blood || 0) * Number(player.当前血量 || 0)) / (1 + Number(grade) * 0.05)),
        暴击率: Number(monster.baoji || 0),
        灵根: monster.灵根 ?? { name: '野怪', type: '普通', 法球倍率: 0.1 },
        法球倍率: Number(monster.灵根?.法球倍率 ?? 0.1)
    };
};
const calculateNpcDamage = (monster, player) => {
    return Math.trunc(Harm(monster.攻击 * 0.85, Number(player.防御 || 0)) + Math.trunc(monster.攻击 * monster.法球倍率) + monster.防御 * 0.1);
};
const generateEscapeResult = (random, npcDamage, monster, player) => {
    let damage;
    let message;
    if (random < 0.1) {
        damage = npcDamage;
        message = `${monster.名号}似乎不屑追你,只是随手丢出神通,剩余血量`;
    }
    else if (random < 0.25) {
        damage = Math.trunc(npcDamage * 0.3);
        message = `你引起了${monster.名号}的兴趣,${monster.名号}决定试探你,只用了三分力,剩余血量`;
    }
    else if (random < 0.5) {
        damage = Math.trunc(npcDamage * 1.5);
        message = `你的逃跑让${monster.名号}愤怒,${monster.名号}使用了更加强大的一次攻击,剩余血量`;
    }
    else if (random < 0.7) {
        damage = Math.trunc(npcDamage * 1.3);
        message = `你成功的吸引了所有的仇恨,${monster.名号}已经快要抓到你了,强大的攻击已经到了你的面前,剩余血量`;
    }
    else if (random < 0.9) {
        damage = Math.trunc(npcDamage * 1.8);
        message = `你们近乎贴脸飞行,${monster.名号}的攻势愈加猛烈,已经快招架不住了,剩余血量`;
    }
    else {
        damage = Math.trunc(npcDamage * 0.5);
        message = '身体快到极限了嘛,你暗暗问道,脚下逃跑的步伐更加迅速,剩余血量';
    }
    const remainingHp = Math.max(0, Number(player.当前血量 || 0) - damage);
    return { message, remainingHp };
};
const handlePlayerCaught = async (playerId, player, monster, grade, action, shop, slot) => {
    const num = Number(grade) + 1;
    const message = `\n在躲避追杀中,没能躲过此劫,被抓进了天牢\n在天牢中你找到了秘境之匙x${num}`;
    await addNajieThing(playerId, '秘境之匙', '道具', num);
    delete action.group_id;
    if (slot) {
        slot.state = 0;
    }
    await writeShop(shop);
    const time = 60;
    const actionTime = 60000 * time;
    action.action = '天牢';
    action.xijie = 1;
    action.end_time = Date.now() + actionTime;
    const auctionKeyManager = getAuctionKeyManager();
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
    const groupList = await redis.smembers(groupListKey);
    const notice = `【全服公告】${player.名号}被${monster.名号}抓进了地牢,希望大家遵纪守法,引以为戒`;
    for (const gid of groupList) {
        const pushAddress = gid;
        const msg = [notice];
        void pushMessage({
            uid: playerId,
            cid: pushAddress ? pushAddress : ''
        }, [Text(msg.join(''))]);
    }
    return message;
};
const handlePlayerEscaped = async (playerId, action, shop, slot) => {
    const message = '\n你成功躲过了万仙盟的追杀,躲进了宗门';
    action.xijie = 1;
    action.end_time = Date.now();
    delete action.group_id;
    if (Array.isArray(action.thing)) {
        for (const t of action.thing) {
            if (!t) {
                continue;
            }
            const tn = t.name;
            const tc = isNajieCategory(t.class) ? t.class : '道具';
            const count = t.数量 ?? 0;
            if (tn && count > 0) {
                await addNajieThing(playerId, tn, tc, count);
            }
        }
    }
    if (slot) {
        if (typeof slot.Grade === 'number') {
            slot.Grade = Math.min(3, (slot.Grade || 0) + 1);
        }
        slot.state = 0;
        await writeShop(shop);
    }
    return message;
};
const processPlayerEscape = async (playerId, action, npcList) => {
    try {
        let pushAddress;
        let isGroup = false;
        if ('group_id' in action && notUndAndNull(action.group_id)) {
            isGroup = true;
            pushAddress = action.group_id;
        }
        const msg = [];
        let endTime = action.end_time;
        const nowTime = Date.now();
        if (action.xijie === '-2') {
            const actTime = typeof action.time === 'string' ? parseInt(action.time) : Number(action.time);
            endTime = endTime - (isNaN(actTime) ? 0 : actTime) + 60000 * 5;
            if (nowTime >= endTime) {
                const weizhi = action.Place_address;
                if (!weizhi) {
                    return false;
                }
                const wanxianmengIndex = getWanxianmengIndex(npcList);
                if (wanxianmengIndex === -1) {
                    return false;
                }
                const playerA = action.playerA;
                if (!playerA) {
                    return false;
                }
                const monster = getRandomMonster(npcList, wanxianmengIndex, weizhi.Grade);
                const monsterData = createMonsterData(monster, playerA, weizhi.Grade);
                const npcDamage = calculateNpcDamage(monsterData, playerA);
                const random = Math.random();
                const { message, remainingHp } = generateEscapeResult(random, npcDamage, monsterData, playerA);
                playerA.当前血量 = remainingHp;
                let lastMessage = message + remainingHp;
                const arr = action;
                const shop = await readShop();
                const slot = shop.find(s => s.name === weizhi.name);
                if (slot) {
                    slot.state = 0;
                }
                if (playerA.当前血量 > 0) {
                    arr.playerA = playerA;
                    if (typeof arr.cishu === 'number') {
                        arr.cishu -= 1;
                    }
                }
                else {
                    lastMessage += await handlePlayerCaught(playerId, playerA, monsterData, weizhi.Grade, arr, shop, slot);
                }
                if ((arr.cishu ?? 0) === 0) {
                    lastMessage += await handlePlayerEscaped(playerId, arr, shop, slot);
                }
                await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
                msg.push('\n' + lastMessage);
                void pushMessage({
                    uid: playerId,
                    cid: isGroup && pushAddress ? pushAddress : ''
                }, [Text(msg.join(''))]);
                return true;
            }
        }
        return false;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const handelAction = async (playerId, action, { npcList }) => {
    try {
        if (!npcList || npcList.length === 0) {
            return;
        }
        await processPlayerEscape(playerId, action, npcList);
    }
    catch (error) {
        logger.error(error);
    }
};

export { handelAction };
