import { useSend, Text } from 'alemonjs';
import * as _ from 'lodash-es';
import { redis, pushInfo } from '../../api/api.js';
import '../../model/Config.js';
import { __PATH } from '../../model/paths.js';
import data from '../../model/XiuxianData.js';
import '@alemonjs/db';
import { zdBattle, sleep, Harm, addHP, addCoin } from '../../model/xiuxian.js';
import 'dayjs';

const WorldBossBattleInfo = {
    CD: {},
    Lock: 0,
    UnLockTimer: 0,
    setCD(usr_qq, time) {
        this.CD[usr_qq] = time;
    },
    setLock(lock) {
        this.Lock = lock;
    },
    setUnLockTimer(timer) {
        this.UnLockTimer = timer;
    }
};
async function InitWorldBoss() {
    let AverageDamageStruct = await GetAverageDamage();
    let player_quantity = Math.floor(AverageDamageStruct.player_quantity);
    let AverageDamage = Math.floor(AverageDamageStruct.AverageDamage);
    let Reward = 12000000;
    WorldBossBattleInfo.setLock(0);
    if (player_quantity == 0) {
        return -1;
    }
    if (player_quantity < 5)
        Reward = 6000000;
    let X = AverageDamage * 0.01;
    logger.info(`[妖王] 化神玩家总数：${player_quantity}`);
    logger.info(`[妖王] 生成基数:${X}`);
    let Health = Math.trunc(X * 150 * player_quantity * 2);
    let WorldBossStatus = {
        Health: Health,
        Healthmax: Health,
        KilledTime: -1,
        Reward: Reward
    };
    let PlayerRecord = 0;
    await redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus));
    await redis.set('xiuxian@1.3.0Record', JSON.stringify(PlayerRecord));
    let msg = '【全服公告】妖王已经苏醒,击杀者额外获得100w灵石';
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const groupList = await redis.smembers(redisGlKey);
    for (const group of groupList) {
        await pushInfo(group, true, msg);
    }
    return false;
}
async function InitWorldBoss2() {
    let AverageDamageStruct = await GetAverageDamage();
    let player_quantity = Math.floor(AverageDamageStruct.player_quantity);
    let AverageDamage = Math.floor(AverageDamageStruct.AverageDamage);
    let Reward = 6000000;
    WorldBossBattleInfo.setLock(0);
    if (player_quantity == 0) {
        return -1;
    }
    if (player_quantity < 5)
        Reward = 3000000;
    let X = AverageDamage * 0.01;
    logger.mark(`[金角大王] 化神玩家总数：${player_quantity}`);
    logger.mark(`[金角大王] 生成基数:${X}`);
    let Health = Math.trunc(X * 150 * player_quantity * 2);
    let WorldBossStatus = {
        Health: Health,
        Healthmax: Health,
        KilledTime: -1,
        Reward: Reward
    };
    let PlayerRecord = 0;
    await redis.set('Xiuxian:WorldBossStatus2', JSON.stringify(WorldBossStatus));
    await redis.set('xiuxian@1.3.0Record2', JSON.stringify(PlayerRecord));
    let msg = '【全服公告】金角大王已经苏醒,击杀者额外获得50w灵石';
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const groupList = await redis.smembers(redisGlKey);
    for (const group_id of groupList) {
        await pushInfo(group_id, true, msg);
    }
    return false;
}
async function GetAverageDamage() {
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    let temp = [];
    let TotalPlayer = 0;
    for (const player_id of playerList) {
        const player = await data.getData('player', player_id);
        if (player.level_id > 21 && player.level_id < 42 && player.lunhui == 0) {
            temp[TotalPlayer] = parseInt(player.攻击);
            logger.info(`[金角大王] ${player_id}玩家攻击:${temp[TotalPlayer]}`);
            TotalPlayer++;
        }
    }
    temp.sort(function (a, b) {
        return b - a;
    });
    let AverageDamage = 0;
    if (TotalPlayer > 15)
        for (let i = 2; i < temp.length - 4; i++)
            AverageDamage += temp[i];
    else
        for (let i = 0; i < temp.length; i++)
            AverageDamage += temp[i];
    AverageDamage =
        TotalPlayer > 15
            ? AverageDamage / (temp.length - 6)
            : temp.length == 0
                ? 0
                : AverageDamage / temp.length;
    let res = {
        AverageDamage: AverageDamage,
        player_quantity: TotalPlayer
    };
    return res;
}
async function BossIsAlive() {
    return ((await redis.get('Xiuxian:WorldBossStatus')) &&
        (await redis.get('xiuxian@1.3.0Record')));
}
async function Boss2IsAlive() {
    return ((await redis.get('Xiuxian:WorldBossStatus2')) &&
        (await redis.get('xiuxian@1.3.0Record2')));
}
async function LookUpWorldBossStatus(e) {
    const send = useSend(e);
    if (await BossIsAlive()) {
        let WorldBossStatusStr = await redis.get('Xiuxian:WorldBossStatus2');
        if (WorldBossStatusStr) {
            WorldBossStatusStr = JSON.parse(WorldBossStatusStr);
            if (new Date().getTime() - WorldBossStatusStr.KilledTime < 86400000) {
                send(Text(`金角大王正在刷新,20点开启`));
                return false;
            }
            else if (WorldBossStatusStr.KilledTime != -1) {
                return false;
            }
            let ReplyMsg = [
                `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${WorldBossStatusStr.Health}\n奖励:${WorldBossStatusStr.Reward}`
            ];
            send(Text(ReplyMsg.join('\n')));
        }
    }
    else
        send(Text('金角大王未开启！'));
    return false;
}
async function SortPlayer(PlayerRecordJSON) {
    if (PlayerRecordJSON) {
        let Temp0 = _.cloneDeep(PlayerRecordJSON);
        let Temp = Temp0.TotalDamage;
        let SortResult = [];
        Temp.sort(function (a, b) {
            return b - a;
        });
        for (let i = 0; i < PlayerRecordJSON.TotalDamage.length; i++) {
            for (let s = 0; s < PlayerRecordJSON.TotalDamage.length; s++) {
                if (Temp[i] == PlayerRecordJSON.TotalDamage[s]) {
                    SortResult[i] = s;
                    break;
                }
            }
        }
        return SortResult;
    }
}
async function WorldBossBattle(e) {
    const send = useSend(e);
    const WorldBOSSBattleCD = WorldBossBattleInfo.CD;
    if (!(await BossIsAlive())) {
        send(Text('妖王未开启！'));
        return false;
    }
    let usr_qq = e.UserId;
    let Time = 5;
    let now_Time = new Date().getTime();
    Time = Math.floor(60000 * Time);
    let last_time = await redis.get('xiuxian@1.3.0:' + usr_qq + 'BOSSCD');
    last_time = parseInt(last_time);
    if (now_Time < last_time + Time) {
        let Couple_m = Math.trunc((last_time + Time - now_Time) / 60 / 1000);
        let Couple_s = Math.trunc(((last_time + Time - now_Time) % 60000) / 1000);
        send(Text('正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    if (await data.existData('player', usr_qq)) {
        let player = await data.getData('player', usr_qq);
        if (player.level_id < 42 && player.lunhui == 0) {
            send(Text('你在仙界吗'));
            return false;
        }
        let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
        action = JSON.parse(action);
        if (action != null) {
            let action_end_time = action.end_time;
            let now_time = new Date().getTime();
            if (now_time <= action_end_time) {
                let m = Math.floor((action_end_time - now_time) / 1000 / 60);
                let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
                send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
                return false;
            }
        }
        if (player.当前血量 <= player.血量上限 * 0.1) {
            send(Text('还是先疗伤吧，别急着参战了'));
            return false;
        }
        if (WorldBOSSBattleCD[usr_qq]) {
            let Seconds = Math.trunc((300000 - (new Date().getTime() - WorldBOSSBattleCD[usr_qq])) / 1000);
            if (Seconds <= 300 && Seconds >= 0) {
                send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${Seconds}秒)`));
                return false;
            }
        }
        let WorldBossStatusStr = await redis.get('Xiuxian:WorldBossStatus');
        let PlayerRecord = await redis.get('xiuxian@1.3.0Record');
        let WorldBossStatus = JSON.parse(WorldBossStatusStr);
        if (new Date().getTime() - WorldBossStatus.KilledTime < 86400000) {
            send(Text(`妖王正在刷新,21点开启`));
            return false;
        }
        else if (WorldBossStatus.KilledTime != -1) {
            if ((await InitWorldBoss()) == false)
                await WorldBossBattle(e);
            return false;
        }
        let PlayerRecordJSON, Userid;
        if (+PlayerRecord == 0) {
            let QQGroup = [], DamageGroup = [], Name = [];
            QQGroup[0] = usr_qq;
            DamageGroup[0] = 0;
            Name[0] = player.名号;
            PlayerRecordJSON = {
                QQ: QQGroup,
                TotalDamage: DamageGroup,
                Name: Name
            };
            Userid = 0;
        }
        else {
            PlayerRecordJSON = JSON.parse(PlayerRecord);
            let i;
            for (i = 0; i < PlayerRecordJSON.QQ.length; i++) {
                if (PlayerRecordJSON.QQ[i] == usr_qq) {
                    Userid = i;
                    break;
                }
            }
            if (!Userid && Userid != 0) {
                PlayerRecordJSON.QQ[i] = usr_qq;
                PlayerRecordJSON.Name[i] = player.名号;
                PlayerRecordJSON.TotalDamage[i] = 0;
                Userid = i;
            }
        }
        let TotalDamage = 0;
        let Boss = {
            名号: '妖王幻影',
            攻击: Math.floor(player.攻击 * (0.8 + 0.6 * Math.random())),
            防御: Math.floor(player.防御 * (0.8 + 0.6 * Math.random())),
            当前血量: Math.floor(player.血量上限 * (0.8 + 0.6 * Math.random())),
            暴击率: player.暴击率,
            灵根: player.灵根,
            法球倍率: player.灵根.法球倍率
        };
        player.法球倍率 = player.灵根.法球倍率;
        if (WorldBossBattleInfo.UnLockTimer) {
            clearTimeout(WorldBossBattleInfo.UnLockTimer);
            WorldBossBattleInfo.setUnLockTimer(null);
        }
        SetWorldBOSSBattleUnLockTimer(e);
        if (WorldBossBattleInfo.Lock != 0) {
            send(Text('好像有人正在和妖王激战，现在去怕是有未知的凶险，还是等等吧！'));
            return false;
        }
        WorldBossBattleInfo.Lock = 1;
        let Data_battle = await zdBattle(player, Boss);
        let msg = Data_battle.msg;
        let A_win = `${player.名号}击败了${Boss.名号}`;
        let B_win = `${Boss.名号}击败了${player.名号}`;
        if (msg.length <= 60)
            await send(Text(msg.join('\n')));
        else {
            let msgg = _.cloneDeep(msg);
            msgg.length = 60;
            await send(Text(msgg.join('\n')));
            send(Text('战斗过长，仅展示部分内容'));
        }
        await sleep(1000);
        if (!WorldBossStatus.Healthmax) {
            send(Text('请联系管理员重新开启!'));
            return false;
        }
        if (msg.find(item => item == A_win)) {
            TotalDamage = Math.trunc(WorldBossStatus.Healthmax * 0.05 +
                Harm(player.攻击 * 0.85, Boss.防御) * 6);
            WorldBossStatus.Health -= TotalDamage;
            send(Text(`${player.名号}击败了[${Boss.名号}],重创[妖王],造成伤害${TotalDamage}`));
        }
        else if (msg.find(item => item == B_win)) {
            TotalDamage = Math.trunc(WorldBossStatus.Healthmax * 0.03 +
                Harm(player.攻击 * 0.85, Boss.防御) * 4);
            WorldBossStatus.Health -= TotalDamage;
            send(Text(`${player.名号}被[${Boss.名号}]击败了,只对[妖王]造成了${TotalDamage}伤害`));
        }
        await addHP(usr_qq, Data_battle.A_xue);
        await sleep(1000);
        let random = Math.random();
        if (random < 0.05 && msg.find(item => item == A_win)) {
            send(Text('这场战斗重创了[妖王]，妖王使用了古典秘籍,血量回复了20%'));
            WorldBossStatus.Health += Math.trunc(WorldBossStatus.Healthmax * 0.2);
        }
        else if (random > 0.95 && msg.find(item => item == B_win)) {
            TotalDamage += Math.trunc(WorldBossStatus.Health * 0.15);
            WorldBossStatus.Health -= Math.trunc(WorldBossStatus.Health * 0.15);
            send(Text(`危及时刻,万先盟-韩立前来助阵,对[妖王]造成${Math.trunc(WorldBossStatus.Health * 0.15)}伤害,并治愈了你的伤势`));
            await addHP(usr_qq, player.血量上限);
        }
        await sleep(1000);
        PlayerRecordJSON.TotalDamage[Userid] += TotalDamage;
        redis.set('xiuxian@1.3.0Record', JSON.stringify(PlayerRecordJSON));
        redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus));
        if (WorldBossStatus.Health <= 0) {
            send(Text('妖王被击杀！玩家们可以根据贡献获得奖励！'));
            await sleep(1000);
            let msg2 = '【全服公告】' +
                player.名号 +
                '亲手结果了妖王的性命,为民除害,额外获得1000000灵石奖励！';
            const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
            const groupList = await redis.smembers(redisGlKey);
            for (const group of groupList) {
                await pushInfo(group, true, msg2);
            }
            await addCoin(usr_qq, 1000000);
            logger.info(`[妖王] 结算:${usr_qq}增加奖励1000000`);
            WorldBossStatus.KilledTime = new Date().getTime();
            redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus));
            let PlayerList = await SortPlayer(PlayerRecordJSON);
            send(Text('正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'));
            for (let i = 0; i < PlayerList.length; i++)
                await data.getData('player', PlayerRecordJSON.QQ[PlayerList[i]]);
            let Show_MAX;
            let Rewardmsg = ['****妖王周本贡献排行榜****'];
            if (PlayerList.length > 20)
                Show_MAX = 20;
            else
                Show_MAX = PlayerList.length;
            let TotalDamage = 0;
            for (let i = 0; i < (PlayerList.length <= 20 ? PlayerList.length : 20); i++)
                TotalDamage += PlayerRecordJSON.TotalDamage[PlayerList[i]];
            for (let i = 0; i < PlayerList.length; i++) {
                let CurrentPlayer = await data.getData('player', PlayerRecordJSON.QQ[PlayerList[i]]);
                if (i < Show_MAX) {
                    let Reward = Math.trunc((PlayerRecordJSON.TotalDamage[PlayerList[i]] / TotalDamage) *
                        WorldBossStatus.Reward);
                    Reward = Reward < 200000 ? 200000 : Reward;
                    Rewardmsg.push('第' +
                        `${i + 1}` +
                        '名:\n' +
                        `名号:${CurrentPlayer.名号}` +
                        '\n' +
                        `伤害:${PlayerRecordJSON.TotalDamage[PlayerList[i]]}` +
                        '\n' +
                        `获得灵石奖励${Reward}`);
                    CurrentPlayer.灵石 += Reward;
                    data.setData('player', PlayerRecordJSON.QQ[PlayerList[i]], CurrentPlayer);
                    logger.info(`[妖王周本] 结算:${PlayerRecordJSON.QQ[PlayerList[i]]}增加奖励${Reward}`);
                    continue;
                }
                else {
                    CurrentPlayer.灵石 += 200000;
                    logger.info(`[妖王周本] 结算:${PlayerRecordJSON.QQ[PlayerList[i]]}增加奖励200000`);
                    data.setData('player', PlayerRecordJSON.QQ[PlayerList[i]], CurrentPlayer);
                }
                if (i == PlayerList.length - 1)
                    Rewardmsg.push('其余参与的修仙者均获得200000灵石奖励！');
            }
            send(Text(Rewardmsg.join('\n')));
        }
        WorldBOSSBattleCD[usr_qq] = new Date().getTime();
        WorldBossBattleInfo.setLock(0);
        return false;
    }
    else {
        send(Text('区区凡人，也想参与此等战斗中吗？'));
        return false;
    }
}
async function SetWorldBOSSBattleUnLockTimer(e) {
    const send = useSend(e);
    const timeout = setTimeout(() => {
        if (WorldBossBattleInfo.Lock == 1) {
            WorldBossBattleInfo.setLock(0);
            send(Text('检测到战斗锁卡死，已自动修复'));
            return false;
        }
    }, 30000);
    WorldBossBattleInfo.setUnLockTimer(timeout);
}

export { Boss2IsAlive, BossIsAlive, GetAverageDamage, InitWorldBoss, InitWorldBoss2, LookUpWorldBossStatus, SetWorldBOSSBattleUnLockTimer, SortPlayer, WorldBossBattle, WorldBossBattleInfo };
