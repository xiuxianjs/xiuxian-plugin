import * as _ from 'lodash-es';
import { redis, pushInfo } from './api.js';
import { readPlayer } from './xiuxiandata.js';
import { KEY_WORLD_BOOS_STATUS_INIT, KEY_WORLD_BOOS_STATUS, KEY_RECORD, keysByPath, __PATH, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_TWO, KEY_WORLD_BOOS_STATUS_INIT_TWO, keys } from './keys.js';
import './settions.js';
import { getAuctionKeyManager } from './auction.js';
import dayjs from 'dayjs';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';
import { useSend, Text, Image } from 'alemonjs';
import { screenshot } from '../image/index.js';
import { getAvatar } from './utils/utilsx.js';
import { zdBattle } from './battle.js';
import { addHP, addCoin } from './economy.js';
import { getConfig } from './Config.js';

const bossKeys = {
    1: {
        init: KEY_WORLD_BOOS_STATUS_INIT,
        status: KEY_WORLD_BOOS_STATUS,
        record: KEY_RECORD
    },
    2: {
        init: KEY_WORLD_BOOS_STATUS_INIT_TWO,
        status: KEY_WORLD_BOOS_STATUS_TWO,
        record: KEY_RECORD_TWO
    }
};
const isBossWord = async () => {
    const now = dayjs();
    const cfg = await getConfig('xiuxian', 'xiuxian');
    const time = cfg.bossTime[1];
    const wordStartTime = dayjs().hour(time.start.hour).minute(time.start.minute).second(0).millisecond(0);
    const wordEndTime = dayjs().hour(time.end.hour).minute(time.end.minute).second(0).millisecond(0);
    return now.isAfter(wordStartTime) && now.isBefore(wordEndTime);
};
const isBossWord2 = async () => {
    const now = dayjs();
    const cfg = await getConfig('xiuxian', 'xiuxian');
    const time = cfg.bossTime[2];
    const wordStartTime = dayjs().hour(time.start.hour).minute(time.start.minute).second(0).millisecond(0);
    const wordEndTime = dayjs().hour(time.end.hour).minute(time.end.minute).second(0).millisecond(0);
    return now.isAfter(wordStartTime) && now.isBefore(wordEndTime);
};
const WorldBossBattleInfo = {
    CD: {},
    setCD(userId, time) {
        this.CD[userId] = time;
    }
};
async function InitWorldBoss() {
    const k = bossKeys[1];
    await redis.set(k.init, '1', 'EX', 3600);
    const averageDamageStruct = await GetAverageDamage();
    let playerQuantity = Math.floor(averageDamageStruct.player_quantity);
    let averageDamage = Math.floor(averageDamageStruct.AverageDamage);
    let reward = 12000000;
    if (playerQuantity < 5) {
        playerQuantity = 10;
        averageDamage = 6000000;
        reward = 6000000;
    }
    const x = averageDamage * 0.01;
    const health = Math.trunc(x * 150 * playerQuantity * 2);
    await redis.set(k.status, JSON.stringify({
        Health: health,
        Healthmax: health,
        KilledTime: -1,
        Reward: reward
    }));
    await redis.set(k.record, '0');
    const msg = '【全服公告】妖王已经苏醒,击杀者额外获得100w灵石';
    const auctionKeyManager = getAuctionKeyManager();
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
    const groupList = await redis.smembers(groupListKey);
    for (const group of groupList) {
        pushInfo(group, true, msg);
    }
    return false;
}
const bossStatus = async (key) => {
    const initStatus = await getDataJSONParseByKey(bossKeys[key].init);
    if (!initStatus) {
        if (key === '1') {
            void InitWorldBoss();
        }
        else {
            void InitWorldBoss2();
        }
        return false;
    }
    return true;
};
async function InitWorldBoss2() {
    const k = bossKeys[2];
    await redis.set(k.init, '1', 'EX', 3600);
    const averageDamageStruct = await GetAverageDamage();
    let playerQuantity = Math.floor(averageDamageStruct.player_quantity);
    let averageDamage = Math.floor(averageDamageStruct.AverageDamage);
    let reward = 12000000;
    if (playerQuantity < 5) {
        playerQuantity = 10;
        averageDamage = 6000000;
        reward = 6000000;
    }
    const x = averageDamage * 0.01;
    const health = Math.trunc(x * 150 * playerQuantity * 2);
    await redis.set(k.status, JSON.stringify({
        Health: health,
        Healthmax: health,
        KilledTime: -1,
        Reward: reward
    }));
    await redis.set(k.record, '0');
    const msg = '【全服公告】金角大王已经苏醒,击杀者额外获得50w灵石';
    const auctionKeyManager = getAuctionKeyManager();
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
    const groupList = await redis.smembers(groupListKey);
    for (const groupId of groupList) {
        pushInfo(groupId, true, msg);
    }
    return false;
}
async function GetAverageDamage() {
    const playerList = await keysByPath(__PATH.player_path);
    const temp = [];
    let totalPlayer = 0;
    await Promise.all(playerList.map(async (p) => {
        const player = await readPlayer(p);
        if (!player) {
            return;
        }
        if (player.level_id > 21 && player.level_id < 42 && player.lunhui === 0) {
            temp[totalPlayer] = parseInt(String(player.攻击));
            totalPlayer++;
        }
    }));
    temp.sort(function (a, b) {
        return b - a;
    });
    let averageDamage = 0;
    if (totalPlayer > 15) {
        for (let i = 2; i < temp.length - 4; i++) {
            averageDamage += temp[i];
        }
    }
    else {
        for (let i = 0; i < temp.length; i++) {
            averageDamage += temp[i];
        }
    }
    averageDamage = totalPlayer > 15 ? averageDamage / (temp.length - 6) : temp.length === 0 ? 0 : averageDamage / temp.length;
    return { player_quantity: totalPlayer, AverageDamage: averageDamage };
}
function SortPlayer(playerRecordJSON) {
    if (playerRecordJSON) {
        const temp0 = _.cloneDeep(playerRecordJSON);
        const temp = temp0.TotalDamage;
        const sortResult = [];
        temp.sort(function (a, b) {
            return b - a;
        });
        for (let i = 0; i < playerRecordJSON.TotalDamage.length; i++) {
            for (let s = 0; s < playerRecordJSON.TotalDamage.length; s++) {
                if (temp[i] === playerRecordJSON.TotalDamage[s]) {
                    sortResult[i] = s;
                    break;
                }
            }
        }
        return sortResult;
    }
}
const WorldBossBattle = async (e, userId, player, boss, key = '1') => {
    const Send = useSend(e);
    const statusStr = await getDataJSONParseByKey(bossKeys[key].status);
    if (!statusStr) {
        void Send(Text('状态数据缺失, 请联系管理员重新开启!'));
        return false;
    }
    const recordStr = await getDataJSONParseByKey(bossKeys[key].record);
    let playerRecordJson = null;
    let userIdx = 0;
    if (!recordStr || +recordStr === 0) {
        playerRecordJson = { QQ: [userId], TotalDamage: [0], Name: [player.名号] };
    }
    else {
        playerRecordJson = recordStr;
        userIdx = playerRecordJson.QQ.indexOf(userId);
        if (userIdx === -1) {
            playerRecordJson.QQ.push(userId);
            playerRecordJson.Name.push(player.名号);
            playerRecordJson.TotalDamage.push(0);
            userIdx = playerRecordJson.QQ.length - 1;
        }
    }
    player.法球倍率 = player.灵根?.法球倍率;
    const dataBattle = await zdBattle(player, boss);
    const msg = dataBattle.msg;
    const winA = `${player.名号}击败了${boss.名号}`;
    const winB = `${boss.名号}击败了${player.名号}`;
    let dealt = 0;
    const playerWin = msg.includes(winA);
    const bossWin = msg.includes(winB);
    const img = await screenshot('CombatResult', userId, {
        msg: msg,
        playerA: {
            id: userId,
            name: player.名号,
            avatar: getAvatar(userId),
            power: player?.战力,
            hp: player.当前血量,
            maxHp: player.血量上限
        },
        playerB: {
            id: '1715713638',
            name: boss.名号,
            avatar: getAvatar('1715713638'),
            power: boss.战力,
            hp: boss.当前血量,
            maxHp: boss.血量上限
        },
        result: msg.includes(winA) ? 'A' : msg.includes(winB) ? 'B' : 'draw'
    });
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
    if (playerWin) {
        dealt = Math.trunc(statusStr.Healthmax * 0.06 + Harm(player.攻击 * 0.85, boss.防御) * 10);
        statusStr.Health -= dealt;
        void Send(Text(`${player.名号}击败了[${boss.名号}],重创[${boss.名号}],造成伤害${dealt}`));
    }
    else if (bossWin) {
        dealt = Math.trunc(statusStr.Healthmax * 0.04 + Harm(player.攻击 * 0.85, boss.防御) * 6);
        statusStr.Health -= dealt;
        void Send(Text(`${player.名号}被[${boss.名号}]击败了,只对[${boss.名号}]造成了${dealt}伤害`));
    }
    const random = Math.random();
    if (random < 0.05 && playerWin) {
        void Send(Text(`这场战斗重创了[${boss.名号}]，${boss.名号}使用了古典秘籍,血量回复了10%`));
        statusStr.Health += Math.trunc(statusStr.Healthmax * 0.1);
        await addHP(userId, dataBattle.A_xue);
    }
    else if (random > 0.95 && bossWin) {
        const extra = Math.trunc(statusStr.Health * 0.15);
        dealt += extra;
        statusStr.Health -= extra;
        void Send(Text(`危及时刻,万先盟-韩立前来助阵,对[${boss.名号}]造成${extra}伤害,并治愈了你的伤势`));
        await addHP(userId, player.血量上限);
    }
    else {
        await addHP(userId, dataBattle.A_xue);
    }
    playerRecordJson.TotalDamage[userIdx] += dealt;
    await setDataJSONStringifyByKey(bossKeys[key].record, playerRecordJson);
    if (statusStr.Health <= 0) {
        const lingshi = 500000;
        await addCoin(userId, lingshi);
        const killMsg = `【全服公告】${player.名号}亲手结果了${boss.名号}的性命,为民除害,额外获得${lingshi}灵石奖励！`;
        const auctionKeyManager = getAuctionKeyManager();
        const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
        const groups = await redis.smembers(groupListKey);
        if (Array.isArray(groups)) {
            for (const g of groups) {
                pushInfo(g, true, killMsg);
            }
        }
        statusStr.KilledTime = Date.now();
        await setDataJSONStringifyByKey(bossKeys[key].status, statusStr);
        const playerList = SortPlayer(playerRecordJson);
        const showMax = Math.min(playerList.length, 20);
        let topSum = 0;
        for (let i = 0; i < showMax; i++) {
            topSum += playerRecordJson.TotalDamage[playerList[i]];
        }
        if (topSum <= 0) {
            topSum = showMax;
        }
        const rewardMsg = [`****${boss.名号}贡献排行榜****`];
        for (let i = 0; i < playerList.length; i++) {
            const idx = playerList[i];
            const qq = playerRecordJson.QQ[idx];
            const cur = await getDataJSONParseByKey(keys.player(qq));
            if (!cur) {
                continue;
            }
            const lingshi = 200000;
            if (i < showMax) {
                let reward = Math.trunc((playerRecordJson.TotalDamage[idx] / topSum) * statusStr.Reward);
                if (!Number.isFinite(reward) || reward < lingshi) {
                    reward = lingshi;
                }
                rewardMsg.push(`第${i + 1}名:\n名号:${cur.名号}\n伤害:${playerRecordJson.TotalDamage[idx]}\n获得灵石奖励${reward}`);
                cur.灵石 += reward;
                await setDataJSONStringifyByKey(keys.player(qq), cur);
            }
            else {
                cur.灵石 += lingshi;
                await setDataJSONStringifyByKey(keys.player(qq), cur);
                if (i === playerList.length - 1) {
                    rewardMsg.push(`其余参与的修仙者均获得${lingshi}灵石奖励！`);
                }
            }
        }
        void Send(Text(rewardMsg.join('\n')));
    }
};

export { GetAverageDamage, InitWorldBoss, InitWorldBoss2, SortPlayer, WorldBossBattle, WorldBossBattleInfo, bossStatus, isBossWord, isBossWord2 };
