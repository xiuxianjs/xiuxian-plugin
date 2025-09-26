import { notUndAndNull } from '../common.js';
import '../api.js';
import { keysAction } from '../keys.js';
import { delDataByKey, setDataJSONStringifyByKey } from '../DataControl.js';
import '@alemonjs/db';
import { Text } from 'alemonjs';
import { zdBattle } from '../battle.js';
import { readPlayer, writePlayer } from '../xiuxiandata.js';
import '../settions.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
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
import { addExp2, addExp } from '../economy.js';
import 'svg-captcha';
import 'sharp';
import { getDataList } from '../DataList.js';
import { addNajieThing, existNajieThing } from '../najie.js';
import '../currency.js';
import { readDanyao, writeDanyao } from '../danyao.js';
import 'crypto';
import 'posthog-node';
import '../message.js';
import { pushMessage } from '../MessageSystem.js';

const BASE_REWARDS = {
    XIUWEI_BASE: 2000,
    QIXUE_BASE: 2000,
    LEVEL_MULTIPLIER: 100,
    PHYSIQUE_MULTIPLIER: 100,
    DEFEAT_XIUWEI: 800
};
const SPECIAL_PLACES = {
    TAIJI_YANG: '太极之阳',
    TAIJI_YIN: '太极之阴',
    ZHUSHEN_HUANGHUN: '诸神黄昏·旧神界'
};
const HEALTH_THRESHOLD = 0.3;
const createBattlePlayer = (player) => {
    return {
        名号: player.名号,
        攻击: player.攻击,
        防御: player.防御,
        当前血量: player.当前血量,
        暴击率: player.暴击率,
        法球倍率: Number(player.灵根?.法球倍率) || 1,
        灵根: {
            name: player.灵根?.name || '未知',
            type: player.灵根?.type || '普通',
            法球倍率: Number(player.灵根?.法球倍率) || 1
        },
        仙宠: player.仙宠 || { name: '无', type: 'none', 加成: 0 }
    };
};
const getRandomMonster = (monsterList) => {
    if (monsterList.length === 0) {
        return null;
    }
    const monsterIndex = Math.trunc(Math.random() * monsterList.length);
    return monsterList[monsterIndex];
};
const createMonsterBattleData = (monster, player) => {
    return {
        名号: monster.名号,
        攻击: Math.floor(Number(monster.攻击 || 0) * player.攻击),
        防御: Math.floor(Number(monster.防御 || 0) * player.防御),
        当前血量: Math.floor(Number(monster.当前血量 || 0) * player.血量上限),
        暴击率: monster.暴击率 || 0,
        法球倍率: 0.1,
        灵根: { name: '野怪', type: '普通', 法球倍率: 0.1 }
    };
};
const handlePlayerHealth = async (playerId, player) => {
    if (player.当前血量 < HEALTH_THRESHOLD * player.血量上限) {
        if (await existNajieThing(playerId, '起死回生丹', '丹药')) {
            player.当前血量 = player.血量上限;
            await addNajieThing(playerId, '起死回生丹', '丹药', -1);
            await writePlayer(playerId, player);
        }
    }
};
const getRandomItem = (weizhi, config) => {
    const random1 = Math.random();
    const random2 = Math.random();
    const random3 = Math.random();
    const x = Number(config.SecretPlace.one) || 0;
    const y = Number(config.SecretPlace.two) || 0;
    const z = Number(config.SecretPlace.three) || 0;
    if (random1 <= x) {
        if (random2 <= y) {
            if (random3 <= z && weizhi.three.length > 0) {
                const random4 = Math.floor(Math.random() * weizhi.three.length);
                const item = weizhi.three[random4];
                return {
                    item: {
                        name: item.name,
                        class: item.class || '道具'
                    },
                    message: `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是：[${item.name}`,
                    t1: 2 + Math.random(),
                    t2: 2 + Math.random(),
                    quantity: 1
                };
            }
            else if (weizhi.two.length > 0) {
                const random4 = Math.floor(Math.random() * weizhi.two.length);
                const item = weizhi.two[random4];
                let quantity = 1;
                let message = `在洞穴中拿到[${item.name}`;
                if (weizhi.name === SPECIAL_PLACES.TAIJI_YANG || weizhi.name === SPECIAL_PLACES.TAIJI_YIN) {
                    quantity = 5;
                    message = '捡到了[' + item.name;
                }
                return {
                    item: {
                        name: item.name,
                        class: item.class || '道具'
                    },
                    message,
                    t1: 1 + Math.random(),
                    t2: 1 + Math.random(),
                    quantity
                };
            }
        }
        else if (weizhi.one.length > 0) {
            const random4 = Math.floor(Math.random() * weizhi.one.length);
            const item = weizhi.one[random4];
            let quantity = 1;
            let message = `捡到了[${item.name}`;
            if (weizhi.name === SPECIAL_PLACES.ZHUSHEN_HUANGHUN) {
                quantity = item.name === '洗根水' ? 130 : 100;
                message = '捡到了[' + item.name;
            }
            else if (weizhi.name === SPECIAL_PLACES.TAIJI_YANG || weizhi.name === SPECIAL_PLACES.TAIJI_YIN) {
                quantity = 5;
                message = '捡到了[' + item.name;
            }
            return {
                item: {
                    name: item.name,
                    class: item.class || '道具'
                },
                message,
                t1: 0.5 + Math.random() * 0.5,
                t2: 0.5 + Math.random() * 0.5,
                quantity
            };
        }
    }
    return {
        message: '走在路上看见了一只蚂蚁！蚂蚁大仙送了你[起死回生丹',
        t1: 0.5 + Math.random() * 0.5,
        t2: 0.5 + Math.random() * 0.5,
        quantity: 1
    };
};
const checkLuckyBonus = (player, placeName) => {
    if (placeName === SPECIAL_PLACES.ZHUSHEN_HUANGHUN) {
        return { message: '', quantity: 1 };
    }
    const random = Math.random();
    if (random < (Number(player.幸运) || 0)) {
        if (random < (Number(player.addluckyNo) || 0)) ;
        else if (player.仙宠?.type === '幸运') ;
        return {
            message: '',
            quantity: 2
        };
    }
    return {
        message: '',
        quantity: 1
    };
};
const handleLuckyPill = async (playerId, player, placeName) => {
    if (placeName === SPECIAL_PLACES.ZHUSHEN_HUANGHUN || (player.islucky ?? 0) <= 0) {
        return '';
    }
    player.islucky--;
    let message = '';
    if (player.islucky !== 0) {
        message = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
    }
    else {
        message = '  \n本次探索后，福源丹已失效\n';
        player.幸运 = Number(player.幸运 ?? 0) - Number(player.addluckyNo ?? 0);
        player.addluckyNo = 0;
    }
    await writePlayer(playerId, JSON.parse(JSON.stringify(player)));
    return message;
};
const calculateRewards = (player, t1, t2, isVictory) => {
    if (!isVictory) {
        return {
            xiuwei: BASE_REWARDS.DEFEAT_XIUWEI,
            qixue: 0
        };
    }
    const levelId = player.level_id || 0;
    const physiqueId = player.Physique_id || 0;
    const xiuwei = Math.trunc(BASE_REWARDS.XIUWEI_BASE + (BASE_REWARDS.LEVEL_MULTIPLIER * levelId * levelId * t1 * 0.1) / 5);
    const qixue = Math.trunc(BASE_REWARDS.QIXUE_BASE + BASE_REWARDS.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * 0.1);
    return { xiuwei, qixue };
};
const handleSpecialDrops = async (playerId, random, monsterName, threshold = 0.995) => {
    let message = '';
    if (random > threshold) {
        const xianchonkouliang = await getDataList('Xianchonkouliang');
        if (xianchonkouliang.length > 0) {
            const index = Math.trunc(Math.random() * xianchonkouliang.length);
            const kouliang = xianchonkouliang[index];
            message += `\n七彩流光的神奇仙谷[${kouliang.name}]深埋在土壤中，是仙兽们的最爱。`;
            await addNajieThing(playerId, kouliang.name, '仙宠口粮', 1);
        }
    }
    if (random > 0.1 && random < 0.1002) {
        message += `\n${monsterName}倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。`;
        await addNajieThing(playerId, '长相奇怪的小石头', '道具', 1);
    }
    return message;
};
const handleDanyaoEffect = async (playerId) => {
    const dy = await readDanyao(playerId);
    let newRandom = 0.995;
    newRandom -= Number(dy.beiyong1 || 0);
    if (dy.ped > 0) {
        dy.ped--;
    }
    else {
        dy.beiyong1 = 0;
        dy.ped = 0;
    }
    await writeDanyao(playerId, dy);
    return newRandom;
};
const handleExplorationComplete = async (playerId, player, action, result, luckyMessage, fydMessage, pushAddress, isGroup, remainingCount) => {
    const msg = [];
    const lastMessage = `${result.message},获得修为${result.xiuwei},气血${result.qixue},剩余次数${remainingCount}`;
    msg.push('\n' + player.名号 + luckyMessage + lastMessage + fydMessage);
    const arr = action;
    if (arr.cishu === 1) {
        void delDataByKey(keysAction.action(playerId));
        await addExp2(playerId, result.qixue);
        await addExp(playerId, result.xiuwei);
        void pushMessage({
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : ''
        }, [Text(msg.join(''))]);
    }
    else {
        arr.cishu = (arr.cishu || 0) - 1;
        await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
        await addExp2(playerId, result.qixue);
        await addExp(playerId, result.xiuwei);
        void pushMessage({
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : ''
        }, [Text(msg.join(''))]);
    }
};
const processPlayerExploration = async (playerId, action, monsterList, config) => {
    try {
        let pushAddress;
        let isGroup = false;
        if ('group_id' in action && notUndAndNull(action.group_id)) {
            isGroup = true;
            pushAddress = String(action.group_id);
        }
        let endTime = Number(action.end_time) || 0;
        const nowTime = Date.now();
        const player = await readPlayer(playerId);
        if (!player) {
            return false;
        }
        if (String(action.Place_actionplus) === '0') {
            const rawTime = action.time;
            const duration = typeof rawTime === 'string' ? parseInt(rawTime) : Number(rawTime);
            const safeDuration = Number.isFinite(duration) ? duration : 0;
            endTime = endTime - safeDuration;
            if (nowTime > endTime) {
                const weizhi = action.Place_address;
                if (!weizhi) {
                    return false;
                }
                await handlePlayerHealth(playerId, player);
                const playerA = createBattlePlayer(player);
                const monster = getRandomMonster(monsterList);
                if (!monster) {
                    return false;
                }
                const playerB = createMonsterBattleData(monster, player);
                const dataBattle = await zdBattle(playerA, playerB);
                const msgg = dataBattle.msg || [];
                const winA = `${playerA.名号}击败了${playerB.名号}`;
                const isVictory = msgg.includes(winA);
                const { item, message, t1, t2, quantity: baseQuantity } = getRandomItem(weizhi, config);
                const luckyBonus = checkLuckyBonus(player, weizhi.name);
                const finalQuantity = baseQuantity * luckyBonus.quantity;
                const fydMessage = await handleLuckyPill(playerId, player, weizhi.name);
                const { xiuwei, qixue } = calculateRewards(player, t1, t2, isVictory);
                if (item) {
                    await addNajieThing(playerId, item.name, item.class, finalQuantity);
                }
                else if (message.includes('起死回生丹')) {
                    await addNajieThing(playerId, '起死回生丹', '丹药', 1);
                }
                let lastMessage = luckyBonus.message;
                const finalMessage = message + `]×${finalQuantity}个。`;
                if (isVictory) {
                    lastMessage += `${finalMessage}不巧撞见[${playerB.名号}],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${playerA.当前血量 + dataBattle.A_xue},剩余次数${(action.cishu || 0) - 1}`;
                    const random = Math.random();
                    const adjustedThreshold = await handleDanyaoEffect(playerId);
                    const specialDropsMessage = await handleSpecialDrops(playerId, random, playerB.名号, adjustedThreshold);
                    lastMessage += specialDropsMessage;
                }
                else {
                    lastMessage = `不巧撞见[${playerB.名号}],经过一番战斗,败下阵来,还好跑得快,只获得了修为${xiuwei},剩余血量${playerA.当前血量}`;
                }
                const result = {
                    message: lastMessage,
                    thingName: item?.name,
                    thingClass: item?.class,
                    quantity: finalQuantity,
                    xiuwei,
                    qixue,
                    isVictory
                };
                await handleExplorationComplete(playerId, player, action, result, luckyBonus.message, fydMessage, pushAddress, isGroup, (action.cishu || 0) - 1);
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
const handelAction = async (playerId, action, { monsterList, config }) => {
    try {
        if (!monsterList || monsterList.length === 0) {
            return;
        }
        if (!config) {
            return;
        }
        await processPlayerExploration(playerId, action, monsterList, config);
    }
    catch (error) {
        logger.error(error);
    }
};

export { handelAction };
