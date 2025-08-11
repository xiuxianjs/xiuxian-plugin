import { useSend, Text } from 'alemonjs';
import * as _ from 'lodash-es';
import { redis, pushInfo } from '../../../../model/api.js';
import { zdBattle, Harm } from '../../../../model/battle.js';
import { sleep } from '../../../../model/common.js';
import { addHP, addCoin } from '../../../../model/economy.js';
import { BossIsAlive, WorldBossBattleInfo, InitWorldBoss, WorldBossBattle, SetWorldBOSSBattleUnLockTimer, SortPlayer } from '../../boss.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import '../../../../model/equipment.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?讨伐妖王$/;
function parseJson(raw, fallback) {
    if (typeof raw !== 'string' || raw === '')
        return fallback;
    try {
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    if (!(await BossIsAlive())) {
        Send(Text('妖王未开启！'));
        return false;
    }
    const usr_qq = e.UserId;
    const now_Time = Date.now();
    const cdMs = 5 * 60000;
    const last_time_raw = await redis.get(`xiuxian@1.3.0:${usr_qq}BOSSCD`);
    const last_time = toInt(last_time_raw);
    if (now_Time < last_time + cdMs) {
        const remain = last_time + cdMs - now_Time;
        const Couple_m = Math.trunc(remain / 60000);
        const Couple_s = Math.trunc((remain % 60000) / 1000);
        Send(Text(`正在CD中，剩余cd:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    if (!(await data.existData('player', usr_qq))) {
        Send(Text('区区凡人，也想参与此等战斗中吗？'));
        return false;
    }
    const player = await data.getData('player', usr_qq);
    if (player.level_id < 42 && player.lunhui == 0) {
        Send(Text('你在仙界吗'));
        return false;
    }
    const actionRaw = await redis.get(`xiuxian@1.3.0:${usr_qq}:action`);
    const action = parseJson(actionRaw, null);
    if (action && action.end_time && Date.now() <= action.end_time) {
        const remain = action.end_time - Date.now();
        const m = Math.floor(remain / 60000);
        const s = Math.floor((remain % 60000) / 1000);
        Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`));
        return false;
    }
    if (player.当前血量 <= player.血量上限 * 0.1) {
        Send(Text('还是先疗伤吧，别急着参战了'));
        return false;
    }
    if (WorldBossBattleInfo.CD[usr_qq]) {
        const Seconds = Math.trunc((300000 - (Date.now() - WorldBossBattleInfo.CD[usr_qq])) / 1000);
        if (Seconds <= 300 && Seconds >= 0) {
            Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${Seconds}秒)`));
            return false;
        }
    }
    const WorldBossStatusStr = await redis.get('Xiuxian:WorldBossStatus');
    const PlayerRecordStr = await redis.get('xiuxian@1.3.0Record');
    const WorldBossStatus = parseJson(WorldBossStatusStr, null);
    if (!WorldBossStatus) {
        Send(Text('状态数据缺失, 请联系管理员重新开启!'));
        return false;
    }
    if (Date.now() - WorldBossStatus.KilledTime < 86400000) {
        Send(Text('妖王正在刷新,21点开启'));
        return false;
    }
    else if (WorldBossStatus.KilledTime != -1) {
        if ((await InitWorldBoss()) == false)
            await WorldBossBattle(e);
        return false;
    }
    let PlayerRecordJSON;
    let Userid = 0;
    if (!PlayerRecordStr || PlayerRecordStr === '0') {
        PlayerRecordJSON = { QQ: [usr_qq], TotalDamage: [0], Name: [player.名号] };
        Userid = 0;
    }
    else {
        PlayerRecordJSON = parseJson(PlayerRecordStr, {
            QQ: [],
            TotalDamage: [],
            Name: []
        });
        Userid = PlayerRecordJSON.QQ.indexOf(usr_qq);
        if (Userid === -1) {
            PlayerRecordJSON.QQ.push(usr_qq);
            PlayerRecordJSON.Name.push(player.名号);
            PlayerRecordJSON.TotalDamage.push(0);
            Userid = PlayerRecordJSON.QQ.length - 1;
        }
    }
    const Boss = {
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
        Send(Text('好像有人正在和妖王激战，现在去怕是有未知的凶险，还是等等吧！'));
        return false;
    }
    WorldBossBattleInfo.setLock(1);
    const Data_battle = await zdBattle(player, Boss);
    const msg = Data_battle.msg;
    const A_win = `${player.名号}击败了${Boss.名号}`;
    const B_win = `${Boss.名号}击败了${player.名号}`;
    if (msg.length <= 60)
        await Send(Text(msg.join('\n')));
    else {
        const msgg = _.cloneDeep(msg);
        msgg.length = 60;
        Send(Text(msgg.join('\n')));
        Send(Text('战斗过长，仅展示部分内容'));
    }
    await sleep(1000);
    if (!WorldBossStatus.Healthmax) {
        Send(Text('请联系管理员重新开启!'));
        WorldBossBattleInfo.setLock(0);
        return false;
    }
    let TotalDamage = 0;
    const playerWin = msg.includes(A_win);
    const bossWin = msg.includes(B_win);
    if (playerWin) {
        TotalDamage = Math.trunc(WorldBossStatus.Healthmax * 0.05 + Harm(player.攻击 * 0.85, Boss.防御) * 6);
        WorldBossStatus.Health -= TotalDamage;
        Send(Text(`${player.名号}击败了[${Boss.名号}],重创[妖王],造成伤害${TotalDamage}`));
    }
    else if (bossWin) {
        TotalDamage = Math.trunc(WorldBossStatus.Healthmax * 0.03 + Harm(player.攻击 * 0.85, Boss.防御) * 4);
        WorldBossStatus.Health -= TotalDamage;
        Send(Text(`${player.名号}被[${Boss.名号}]击败了,只对[妖王]造成了${TotalDamage}伤害`));
    }
    await addHP(usr_qq, Data_battle.A_xue);
    await sleep(1000);
    const random = Math.random();
    if (random < 0.05 && playerWin) {
        Send(Text('这场战斗重创了[妖王]，妖王使用了古典秘籍,血量回复了20%'));
        WorldBossStatus.Health += Math.trunc(WorldBossStatus.Healthmax * 0.2);
    }
    else if (random > 0.95 && bossWin) {
        const extra = Math.trunc(WorldBossStatus.Health * 0.15);
        TotalDamage += extra;
        WorldBossStatus.Health -= extra;
        Send(Text(`危及时刻,万先盟-韩立前来助阵,对[妖王]造成${extra}伤害,并治愈了你的伤势`));
        await addHP(usr_qq, player.血量上限);
    }
    await sleep(1000);
    PlayerRecordJSON.TotalDamage[Userid] += TotalDamage;
    await redis.set('xiuxian@1.3.0Record', JSON.stringify(PlayerRecordJSON));
    await redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus));
    if (WorldBossStatus.Health <= 0) {
        Send(Text('妖王被击杀！玩家们可以根据贡献获得奖励！'));
        await sleep(1000);
        const msg2 = `【全服公告】${player.名号}亲手结果了妖王的性命,为民除害,额外获得1000000灵石奖励！`;
        const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
        const groupList = await redis.smembers(redisGlKey);
        for (const group of groupList) {
            await pushInfo(group, true, msg2);
        }
        await addCoin(usr_qq, 1000000);
        logger.info(`[妖王] 结算:${usr_qq}增加奖励1000000`);
        WorldBossStatus.KilledTime = Date.now();
        await redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus));
        const PlayerList = await SortPlayer(PlayerRecordJSON);
        Send(Text('正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'));
        for (const idx of PlayerList) {
            await data.getData('player', PlayerRecordJSON.QQ[idx]);
        }
        const Rewardmsg = ['****妖王周本贡献排行榜****'];
        const showMax = Math.min(PlayerList.length, 20);
        let topDamageSum = 0;
        for (let i = 0; i < showMax; i++)
            topDamageSum += PlayerRecordJSON.TotalDamage[PlayerList[i]];
        if (topDamageSum <= 0)
            topDamageSum = showMax;
        for (let i = 0; i < PlayerList.length; i++) {
            const idx = PlayerList[i];
            const qq = PlayerRecordJSON.QQ[idx];
            const CurrentPlayer = await data.getData('player', qq);
            if (i < showMax) {
                let reward = Math.trunc((PlayerRecordJSON.TotalDamage[idx] / topDamageSum) *
                    WorldBossStatus.Reward);
                if (!Number.isFinite(reward) || reward < 200000)
                    reward = 200000;
                Rewardmsg.push(`第${i + 1}名:\n名号:${CurrentPlayer.名号}\n伤害:${PlayerRecordJSON.TotalDamage[idx]}\n获得灵石奖励${reward}`);
                CurrentPlayer.灵石 += reward;
                data.setData('player', qq, CurrentPlayer);
                logger.info(`[妖王周本] 结算:${qq}增加奖励${reward}`);
            }
            else {
                CurrentPlayer.灵石 += 200000;
                data.setData('player', qq, CurrentPlayer);
                logger.info(`[妖王周本] 结算:${qq}增加奖励200000`);
                if (i === PlayerList.length - 1)
                    Rewardmsg.push('其余参与的修仙者均获得200000灵石奖励！');
            }
        }
        Send(Text(Rewardmsg.join('\n')));
    }
    WorldBossBattleInfo.setCD(usr_qq, Date.now());
    WorldBossBattleInfo.setLock(0);
    return false;
});

export { res as default, regular, selects };
