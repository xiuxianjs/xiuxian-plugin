import { useSend, Text } from 'alemonjs';
import { redis, pushInfo } from '../../../../model/api.js';
import { keysAction, keys, KEY_WORLD_BOOS_STATUS_TWO, KEY_RECORD_TWO } from '../../../../model/keys.js';
import { getDataByKey, getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import { getAuctionKeyManager } from '../../../../model/auction.js';
import { zdBattle, Harm } from '../../../../model/battle.js';
import { Boss2IsAlive, WorldBossBattleInfo, InitWorldBoss2, WorldBossBattle, SetWorldBOSSBattleUnLockTimer, SortPlayer } from '../../../../model/boss.js';
import '@alemonjs/db';
import 'svg-captcha';
import 'sharp';
import { sleep } from '../../../../model/common.js';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import * as _ from 'lodash-es';
import { addHP, addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import '../../../../model/currency.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw from '../../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?讨伐金角大王$/;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        void Send(Text('你还未开始修仙'));
        return false;
    }
    if (!(await Boss2IsAlive())) {
        void Send(Text('金角大王未开启！'));
        return false;
    }
    const now = Date.now();
    const fightCdMs = 5 * 60000;
    const lastTime = toInt(await getDataByKey(keysAction.bossCD(userId)));
    if (now < lastTime + fightCdMs) {
        const remain = lastTime + fightCdMs - now;
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        void Send(Text(`正在CD中，剩余cd:  ${m}分 ${s}秒`));
        return false;
    }
    const player = (await getDataJSONParseByKey(keys.player(userId)));
    if (!player) {
        void Send(Text('区区凡人，也想参与此等战斗中吗？'));
        return false;
    }
    if (player.level_id > 41 || player.lunhui > 0) {
        void Send(Text('仙人不得下凡'));
        return false;
    }
    if (player.level_id < 22) {
        void Send(Text('修为至少达到化神初期才能参与挑战'));
        return false;
    }
    const action = (await getDataJSONParseByKey(keysAction.action(userId)));
    if (action?.end_time && Date.now() <= action.end_time) {
        const remain = action.end_time - Date.now();
        const m = Math.floor(remain / 60000);
        const s = Math.floor((remain % 60000) / 1000);
        void Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`));
        return false;
    }
    if (player.当前血量 <= player.血量上限 * 0.1) {
        void Send(Text('还是先疗伤吧，别急着参战了'));
        return false;
    }
    if (WorldBossBattleInfo.CD[userId]) {
        const seconds = Math.trunc((300000 - (Date.now() - WorldBossBattleInfo.CD[userId])) / 1000);
        if (seconds <= 300 && seconds >= 0) {
            void Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${seconds}秒)`));
            return false;
        }
    }
    const statusStr = (await getDataJSONParseByKey(KEY_WORLD_BOOS_STATUS_TWO));
    const recordStr = (await getDataJSONParseByKey(KEY_RECORD_TWO));
    if (!statusStr) {
        void Send(Text('状态数据缺失, 请联系管理员重新开启!'));
        return false;
    }
    if (Date.now() - statusStr.KilledTime < 86400000) {
        void Send(Text('金角大王正在刷新,20点开启'));
        return false;
    }
    else if (statusStr.KilledTime !== -1) {
        if ((await InitWorldBoss2()) === false) {
            await WorldBossBattle(e);
        }
        return false;
    }
    let playerRecordJson;
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
    const bossName = '金角大王幻影';
    const boss = {
        名号: bossName,
        攻击: Math.floor(player.攻击 * (0.8 + 0.4 * Math.random())),
        防御: Math.floor(player.防御 * (0.8 + 0.4 * Math.random())),
        当前血量: Math.floor(player.血量上限 * (0.8 + 0.4 * Math.random())),
        暴击率: player.暴击率,
        灵根: player.灵根,
        法球倍率: player.灵根?.法球倍率
    };
    player.法球倍率 = player.灵根?.法球倍率;
    if (WorldBossBattleInfo.UnLockTimer) {
        clearTimeout(WorldBossBattleInfo.UnLockTimer);
        WorldBossBattleInfo.setUnLockTimer(null);
    }
    void SetWorldBOSSBattleUnLockTimer(e);
    if (WorldBossBattleInfo.Lock !== 0) {
        void Send(Text('好像有人正在和金角大王激战，现在去怕是有未知的凶险，还是等等吧！'));
        return false;
    }
    WorldBossBattleInfo.setLock(1);
    const dataBattle = await zdBattle(player, boss);
    const msg = dataBattle.msg;
    const winA = `${player.名号}击败了${boss.名号}`;
    const winB = `${boss.名号}击败了${player.名号}`;
    if (msg.length <= 60) {
        void Send(Text(msg.join('\n')));
    }
    else {
        const shortMsg = _.cloneDeep(msg);
        shortMsg.length = 60;
        void Send(Text(shortMsg.join('\n')));
        void Send(Text('战斗过长，仅展示部分内容'));
    }
    await sleep(1000);
    if (!statusStr.Healthmax) {
        void Send(Text('请联系管理员重新开启!'));
        WorldBossBattleInfo.setLock(0);
        return false;
    }
    let dealt = 0;
    const playerWin = msg.includes(winA);
    const bossWin = msg.includes(winB);
    if (playerWin) {
        dealt = Math.trunc(statusStr.Healthmax * 0.06 + Harm(player.攻击 * 0.85, boss.防御) * 10);
        statusStr.Health -= dealt;
        void Send(Text(`${player.名号}击败了[${boss.名号}],重创[金角大王],造成伤害${dealt}`));
    }
    else if (bossWin) {
        dealt = Math.trunc(statusStr.Healthmax * 0.04 + Harm(player.攻击 * 0.85, boss.防御) * 6);
        statusStr.Health -= dealt;
        void Send(Text(`${player.名号}被[${boss.名号}]击败了,只对[金角大王]造成了${dealt}伤害`));
    }
    await addHP(userId, dataBattle.A_xue);
    await sleep(1000);
    const random = Math.random();
    if (random < 0.05 && playerWin) {
        void Send(Text('这场战斗重创了[金角大王]，金角大王使用了古典秘籍,血量回复了10%'));
        statusStr.Health += Math.trunc(statusStr.Healthmax * 0.1);
    }
    else if (random > 0.95 && bossWin) {
        const extra = Math.trunc(statusStr.Health * 0.15);
        dealt += extra;
        statusStr.Health -= extra;
        void Send(Text(`危及时刻,万先盟-韩立前来助阵,对[金角大王]造成${extra}伤害,并治愈了你的伤势`));
        await addHP(userId, player.血量上限);
    }
    await sleep(1000);
    playerRecordJson.TotalDamage[userIdx] += dealt;
    await setDataJSONStringifyByKey(KEY_RECORD_TWO, playerRecordJson);
    await setDataJSONStringifyByKey(KEY_WORLD_BOOS_STATUS_TWO, statusStr);
    if (statusStr.Health <= 0) {
        void Send(Text('金角大王被击杀！玩家们可以根据贡献获得奖励！'));
        await sleep(1000);
        const killMsg = `【全服公告】${player.名号}亲手结果了金角大王的性命,为民除害,额外获得500000灵石奖励！`;
        const auctionKeyManager = getAuctionKeyManager();
        const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
        const groups = await redis.smembers(groupListKey);
        if (Array.isArray(groups)) {
            for (const g of groups) {
                pushInfo(g, true, killMsg);
            }
        }
        await addCoin(userId, 500000);
        statusStr.KilledTime = Date.now();
        await setDataJSONStringifyByKey(KEY_WORLD_BOOS_STATUS_TWO, statusStr);
        const playerList = SortPlayer(playerRecordJson);
        void Send(Text('正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'));
        const showMax = Math.min(playerList.length, 20);
        let topSum = 0;
        for (let i = 0; i < showMax; i++) {
            topSum += playerRecordJson.TotalDamage[playerList[i]];
        }
        if (topSum <= 0) {
            topSum = showMax;
        }
        const rewardMsg = ['****金角大王周本贡献排行榜****'];
        for (let i = 0; i < playerList.length; i++) {
            const idx = playerList[i];
            const qq = playerRecordJson.QQ[idx];
            const cur = await getDataJSONParseByKey(keys.player(qq));
            if (!cur) {
                continue;
            }
            if (i < showMax) {
                let reward = Math.trunc((playerRecordJson.TotalDamage[idx] / topSum) * statusStr.Reward);
                if (!Number.isFinite(reward) || reward < 200000) {
                    reward = 200000;
                }
                rewardMsg.push(`第${i + 1}名:\n名号:${cur.名号}\n伤害:${playerRecordJson.TotalDamage[idx]}\n获得灵石奖励${reward}`);
                cur.灵石 += reward;
                await setDataJSONStringifyByKey(keys.player(qq), cur);
            }
            else {
                cur.灵石 += 200000;
                await setDataJSONStringifyByKey(keys.player(qq), cur);
                if (i === playerList.length - 1) {
                    rewardMsg.push('其余参与的修仙者均获得200000灵石奖励！');
                }
            }
        }
        void Send(Text(rewardMsg.join('\n')));
    }
    WorldBossBattleInfo.setCD(userId, Date.now());
    WorldBossBattleInfo.setLock(0);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
