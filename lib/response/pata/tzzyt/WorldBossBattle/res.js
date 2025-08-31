import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { keys, getRedisKey } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { Harm, ifbaoji } from '../../../../model/battle.js';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import '../../../../resources/html/monthCard.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?挑战镇妖塔$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据读取失败'));
        return false;
    }
    const currentLayer = Number(player.镇妖塔层数) || 0;
    if (currentLayer > 6000) {
        void Send(Text('已达到上限'));
        return false;
    }
    const equipmentRaw = await getDataJSONParseByKey(keys.equipment(userId));
    if (!equipmentRaw) {
        return false;
    }
    const equipNeed = ['武器', '护具', '法宝'];
    const safeNum = v => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };
    for (const k of equipNeed) {
        const eq = equipmentRaw?.[k];
        const atk = safeNum(eq?.atk);
        const def = safeNum(eq?.def);
        const hp = safeNum(eq?.HP);
        if (atk < 10 && def < 10 && hp < 10) {
            void Send(Text('请更换其他固定数值装备爬塔'));
            return false;
        }
    }
    const Health = 50000 * currentLayer + 10000;
    const Attack = 22000 * currentLayer + 10000;
    const Defence = 36000 * currentLayer + 10000;
    let Reward;
    if (currentLayer < 100) {
        Reward = 260 * currentLayer + 100;
    }
    else if (currentLayer < 200) {
        Reward = 360 * currentLayer + 1000;
    }
    else {
        Reward = 700 * currentLayer + 1000;
    }
    if (Reward > 400000) {
        Reward = 400000;
    }
    if (Reward < 0) {
        Reward = 0;
    }
    const bosszt = {
        Health,
        Attack,
        Defence};
    const CD_MIN = 2;
    const now = Date.now();
    const cdKey = getRedisKey(String(userId), 'zyt_cd');
    const last_time_raw = await redis.get(cdKey);
    const lastNum = Number(last_time_raw);
    const cdMs = CD_MIN * 60 * 1000;
    if (Number.isFinite(lastNum) && now < lastNum + cdMs) {
        const left = lastNum + cdMs - now;
        const m = Math.trunc(left / 60000);
        const s = Math.trunc((left % 60000) / 1000);
        void Send(Text(`正在CD中，剩余cd: ${m}分 ${s}秒`));
        return false;
    }
    let BattleFrame = 0;
    const msg = [];
    const BOSSCurrentAttack = bosszt.Attack;
    const BOSSCurrentDefence = bosszt.Defence;
    while (player.当前血量 > 0 && bosszt.Health > 0) {
        const Random = Math.random();
        if (!(BattleFrame & 1)) {
            let playerDamage = Harm(Number(player.攻击) || 0, BOSSCurrentDefence) + Math.trunc((Number(player.攻击) || 0) * (Number(player.灵根?.法球倍率) || 0));
            const critChance = Number(player.暴击率) || 0;
            const isCrit = Math.random() < critChance;
            const critMul = isCrit ? 1.5 : 1;
            msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
            if (Random > 0.5 && BattleFrame === 0) {
                msg.push('你的进攻被反手了！');
                playerDamage = Math.trunc(playerDamage * 0.3);
            }
            else if (Random > 0.94) {
                msg.push('你的攻击被破解了');
                playerDamage = Math.trunc(playerDamage * 6);
            }
            else if (Random > 0.9) {
                msg.push('你的攻击被挡了一部分');
                playerDamage = Math.trunc(playerDamage * 0.8);
            }
            else if (Random < 0.1) {
                msg.push('你抓到了未知妖物的破绽');
                playerDamage = Math.trunc(playerDamage * 1.2);
            }
            playerDamage = Math.trunc(playerDamage * critMul + Math.random() * 100);
            bosszt.Health -= playerDamage;
            if (bosszt.Health < 0) {
                bosszt.Health = 0;
            }
            msg.push(`${player.名号}${ifbaoji(critMul)}造成伤害${playerDamage}，未知妖物剩余血量${bosszt.Health}`);
        }
        else {
            let bossDamage = Harm(BOSSCurrentAttack, Math.trunc((Number(player.防御) || 0) * 0.1));
            if (Random > 0.94) {
                msg.push('未知妖物的攻击被你破解了');
                bossDamage = Math.trunc(bossDamage * 0.6);
            }
            else if (Random > 0.9) {
                msg.push('未知妖物的攻击被你挡了一部分');
                bossDamage = Math.trunc(bossDamage * 0.8);
            }
            else if (Random < 0.1) {
                msg.push('未知妖物抓到了你的破绽');
                bossDamage = Math.trunc(bossDamage * 1.2);
            }
            player.当前血量 = (Number(player.当前血量) || 0) - bossDamage;
            if (player.当前血量 < 0) {
                player.当前血量 = 0;
            }
            msg.push(`未知妖物攻击了${player.名号}，造成伤害${bossDamage}，${player.名号}剩余血量${player.当前血量}`);
        }
        BattleFrame++;
    }
    if (msg.length > 30) {
        msg.length = 30;
        void Send(Text(msg.join('\n')));
        void Send(Text('战斗过长，仅展示部分内容'));
    }
    else {
        void Send(Text(msg.join('\n')));
    }
    await redis.set(cdKey, now);
    if (bosszt.Health <= 0) {
        player.镇妖塔层数 = currentLayer + 5;
        player.灵石 = (Number(player.灵石) || 0) + Reward;
        player.当前血量 = (Number(player.当前血量) || 0) + Reward * 21;
        void Send(Text(`\n恭喜通过此层镇妖塔，层数+5！增加灵石${Reward} 回复血量${Reward * 21}`));
    }
    else if (player.当前血量 <= 0) {
        const lose = Math.trunc(Reward * 2);
        player.灵石 = Math.max(0, (Number(player.灵石) || 0) - lose);
        void Send(Text(`\n你未能通过此层镇妖塔！灵石-${lose}`));
    }
    void setDataJSONStringifyByKey(keys.player(userId), player);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
