import { pushInfo } from '../model/api.js';
import { getDataList } from '../model/DataList.js';
import { notUndAndNull } from '../model/common.js';
import { keysByPath, __PATH, keysAction } from '../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../model/DataControl.js';
import '@alemonjs/db';
import { getConfig } from '../model/Config.js';
import { zdBattle } from '../model/battle.js';
import 'lodash-es';
import { readPlayer, writePlayer } from '../model/xiuxiandata.js';
import { NAJIE_CATEGORIES } from '../model/settions.js';
import 'dayjs';
import { Mention } from 'alemonjs';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import 'classnames';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import { addExp2, addExp, addHP } from '../model/economy.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../model/najie.js';
import '../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../model/message.js';

function isNajieCategory(v) {
    return typeof v === 'string' && NAJIE_CATEGORIES.includes(v);
}
const BASE_REWARDS = {
    XIUWEI_BASE: 2000,
    QIXUE_BASE: 2000,
    LEVEL_MULTIPLIER: 100,
    PHYSIQUE_MULTIPLIER: 100,
    DEFEAT_XIUWEI: 800
};
const SPECIAL_PLACES = {
    DAQIAN_SHIJIE: '大千世界',
    XIANJIE_KUANGCHANG: '仙界矿场',
    TAIJI_YANG: '太极之阳',
    TAIJI_YIN: '太极之阴',
    ZHUSHEN_HUANGHUN: '诸神黄昏·旧神界'
};
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
const getPlaceBuff = (placeName) => {
    if (placeName === SPECIAL_PLACES.DAQIAN_SHIJIE || placeName === SPECIAL_PLACES.XIANJIE_KUANGCHANG) {
        return 0.6;
    }
    return 1;
};
const getRandomMonster = (monsterList) => {
    if (monsterList.length === 0) {
        return null;
    }
    const monsterIndex = Math.trunc(Math.random() * monsterList.length);
    return monsterList[monsterIndex];
};
const createMonsterBattleData = (monster, player, buff) => {
    return {
        名号: monster.名号,
        攻击: Math.floor(Number(monster.攻击 ?? 0) * player.攻击 * buff),
        防御: Math.floor(Number(monster.防御 ?? 0) * player.防御 * buff),
        当前血量: Math.floor(Number(monster.当前血量 ?? 0) * player.血量上限 * buff),
        暴击率: Number(monster.暴击率 ?? 0) * buff,
        法球倍率: 0.1,
        灵根: { name: '野怪', type: '普通', 法球倍率: 0.1 }
    };
};
const getRandomItem = (weizhi, config) => {
    const random1 = Math.random();
    const random2 = Math.random();
    const random3 = Math.random();
    if (random1 <= config.SecretPlace.one) {
        if (random2 <= config.SecretPlace.two) {
            if (random3 <= config.SecretPlace.three && weizhi.three.length > 0) {
                const random4 = Math.floor(Math.random() * weizhi.three.length);
                const item = weizhi.three[random4];
                return {
                    item: {
                        name: item.name,
                        class: isNajieCategory(item.class) ? item.class : '道具'
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
                        class: isNajieCategory(item.class) ? item.class : '道具'
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
                    class: isNajieCategory(item.class) ? item.class : '道具'
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
    if (random < player.幸运) {
        let message = '';
        if (random < player.addluckyNo) {
            message = '福源丹生效，所以在';
        }
        else if (player.仙宠?.type === '幸运') {
            message = '仙宠使你在探索中欧气满满，所以在';
        }
        message += '本次探索中获得赐福加成\n';
        return {
            message,
            quantity: 2
        };
    }
    return {
        message: '',
        quantity: 1
    };
};
const handleLuckyPill = async (playerId, player, placeName) => {
    if (placeName === SPECIAL_PLACES.ZHUSHEN_HUANGHUN || (player.islucky || 0) <= 0) {
        return;
    }
    player.islucky--;
    if (player.islucky === 0) {
        player.幸运 -= player.addluckyNo;
        player.addluckyNo = 0;
    }
    await writePlayer(playerId, player);
};
const calculateRewards = (player, t1, t2, isVictory) => {
    if (!isVictory) {
        return {
            xiuwei: BASE_REWARDS.DEFEAT_XIUWEI,
            qixue: 0
        };
    }
    const levelId = player.level_id ?? 0;
    const physiqueId = player.Physique_id ?? 0;
    const xiuwei = Math.trunc(BASE_REWARDS.XIUWEI_BASE + (BASE_REWARDS.LEVEL_MULTIPLIER * levelId * levelId * t1 * 0.1) / 5);
    const qixue = Math.trunc(BASE_REWARDS.QIXUE_BASE + BASE_REWARDS.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * 0.1);
    return { xiuwei, qixue };
};
const handleSpecialDrops = async (playerId, random) => {
    let message = '';
    if (random > 0.995) {
        const xianchonkouliangList = await getDataList('Xianchonkouliang');
        if (xianchonkouliangList.length > 0) {
            const index = Math.trunc(Math.random() * xianchonkouliangList.length);
            const kouliang = xianchonkouliangList[index];
            message += '\n七彩流光的神奇仙谷[' + kouliang.name + ']深埋在土壤中，是仙兽们的最爱。';
            await addNajieThing(playerId, kouliang.name, '仙宠口粮', 1);
        }
    }
    if (random > 0.1 && random < 0.1002) {
        message += '\n倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。';
        await addNajieThing(playerId, '长相奇怪的小石头', '道具', 1);
    }
    return message;
};
const processPlayerExploration = async (playerId, action, monsterList, config) => {
    try {
        let pushAddress;
        let isGroup = false;
        if ('group_id' in action && notUndAndNull(action.group_id)) {
            isGroup = true;
            pushAddress = action.group_id;
        }
        let endTime = action.end_time;
        const nowTime = Date.now();
        const player = await readPlayer(playerId);
        if (!player) {
            return false;
        }
        if (action.Place_action === '0') {
            endTime = endTime - 60000 * 2;
            if (nowTime > endTime) {
                const weizhi = action.Place_address;
                if (!weizhi) {
                    return false;
                }
                const playerA = createBattlePlayer(player);
                const buff = getPlaceBuff(weizhi.name);
                const monster = getRandomMonster(monsterList);
                if (!monster) {
                    return false;
                }
                const playerB = createMonsterBattleData(monster, player, buff);
                const dataBattle = await zdBattle(playerA, playerB);
                const msgg = dataBattle.msg;
                const winA = `${playerA.名号}击败了${playerB.名号}`;
                const isVictory = msgg.find(item => item === winA) !== undefined;
                const { item, message, t1, t2, quantity: baseQuantity } = getRandomItem(weizhi, config);
                const luckyBonus = checkLuckyBonus(player, weizhi.name);
                const finalQuantity = baseQuantity * luckyBonus.quantity;
                await handleLuckyPill(playerId, player, weizhi.name);
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
                    lastMessage += `${finalMessage}不巧撞见[${playerB.名号}],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${playerA.当前血量 + dataBattle.A_xue}`;
                    const random = Math.random();
                    const specialDropsMessage = await handleSpecialDrops(playerId, random);
                    lastMessage += specialDropsMessage;
                }
                else {
                    lastMessage = `不巧撞见[${playerB.名号}],经过一番战斗,败下阵来,还好跑得快,只获得了修为${xiuwei}]`;
                }
                const msg = [Mention(playerId)];
                msg.push('\n' + player.名号 + lastMessage);
                const arr = action;
                arr.shutup = 1;
                arr.working = 1;
                arr.power_up = 1;
                arr.Place_action = 1;
                arr.Place_actionplus = 1;
                arr.end_time = Date.now();
                delete arr.group_id;
                await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
                await addExp2(playerId, qixue);
                await addExp(playerId, xiuwei);
                await addHP(playerId, dataBattle.A_xue);
                if (isGroup && pushAddress) {
                    pushInfo(pushAddress, isGroup, msg);
                }
                else {
                    pushInfo(playerId, isGroup, msg);
                }
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
const SecretPlaceTask = async () => {
    try {
        const playerList = await keysByPath(__PATH.player_path);
        if (!playerList || playerList.length === 0) {
            return;
        }
        const monsterList = await getDataList('Monster');
        if (!monsterList || monsterList.length === 0) {
            return;
        }
        const config = await getConfig('xiuxian', 'xiuxian');
        if (!config) {
            return;
        }
        for (const playerId of playerList) {
            try {
                const action = await getDataJSONParseByKey(keysAction.action(playerId));
                if (!action) {
                    continue;
                }
                await processPlayerExploration(playerId, action, monsterList, config);
            }
            catch (error) {
                logger.error(error);
            }
        }
    }
    catch (error) {
        logger.error(error);
    }
};

export { SecretPlaceTask };
