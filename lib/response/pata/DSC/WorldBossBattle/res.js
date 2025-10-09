import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey, keys } from '../../../../model/keys.js';
import { setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
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
import 'dayjs';
import 'buffer';
import '@alemonjs/db';
import { Harm, ifbaoji } from '../../../../model/battle.js';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?炼神魄$/;
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
    const layer = Number(player.神魄段数) || 0;
    if (layer > 6000) {
        void Send(Text('已达到上限'));
        return false;
    }
    const Health = 100000 * layer;
    const Attack = 250000 * layer;
    const Defence = 200000 * layer;
    let Reward = 1200 * layer;
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
    const cdKey = getRedisKey(String(userId), 'dsc_cd');
    const lastRaw = await redis.get(cdKey);
    const lastNum = Number(lastRaw);
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
    while ((Number(player.当前血量) || 0) > 0 && bosszt.Health > 0) {
        const Random = Math.random();
        if (!(BattleFrame & 1)) {
            let damage = Harm(Number(player.攻击) || 0, BOSSCurrentDefence) + Math.trunc((Number(player.攻击) || 0) * (Number(player.灵根?.法球倍率) || 0));
            const isCrit = Math.random() < (Number(player.暴击率) || 0);
            const critMul = isCrit ? 1.5 : 1;
            msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
            if (BattleFrame === 0) {
                msg.push('你进入锻神池，开始了！');
                damage = 0;
            }
            damage = Math.trunc(damage * critMul);
            bosszt.Health -= damage;
            if (bosszt.Health < 0) {
                bosszt.Health = 0;
            }
            msg.push(`${player.名号}${ifbaoji(critMul)}消耗了${damage}，此段剩余${bosszt.Health}未炼化`);
        }
        else {
            let bossDamage = Harm(BOSSCurrentAttack, Math.trunc((Number(player.防御) || 0) * 0.1));
            if (Random > 0.94) {
                msg.push('你规避了部分反噬');
                bossDamage = Math.trunc(bossDamage * 0.6);
            }
            else if (Random > 0.9) {
                msg.push('你抵挡了一部分反噬');
                bossDamage = Math.trunc(bossDamage * 0.8);
            }
            else if (Random < 0.1) {
                msg.push('反噬更猛烈了一些');
                bossDamage = Math.trunc(bossDamage * 1.2);
            }
            player.当前血量 = (Number(player.当前血量) || 0) - bossDamage;
            if (player.当前血量 < 0) {
                player.当前血量 = 0;
            }
            msg.push(`${player.名号}损失血量${bossDamage}，剩余血量${player.当前血量}`);
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
        player.神魄段数 = layer + 5;
        player.血气 = (Number(player.血气) || 0) + Reward;
        player.当前血量 = Number(player.血量上限) || player.当前血量;
        void Send(Text(`\n你成功突破一段神魄，段数+5！血气+${Reward} 血量已回满`));
    }
    else if ((Number(player.当前血量) || 0) <= 0) {
        const lose = Math.trunc(Reward * 2);
        player.修为 = Math.max(0, (Number(player.修为) || 0) - lose);
        void Send(Text(`\n你未能通过此层锻神池！修为-${lose}`));
    }
    void setDataJSONStringifyByKey(keys.player(userId), player);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
