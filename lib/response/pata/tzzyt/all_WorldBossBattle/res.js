import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '../../../../model/api.js';
import '@alemonjs/db';
import { Harm, ifbaoji } from '../../../../model/battle.js';
import 'lodash-es';
import { existplayer } from '../../../../model/xiuxiandata.js';
import 'dayjs';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/DataList.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?一键挑战镇妖塔$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const equipment = await getDataJSONParseByKey(keys.equipment(userId));
    const type = ['武器', '护具', '法宝'];
    for (const j of type) {
        if (equipment[j].atk < 10 && equipment[j].def < 10 && equipment[j].HP < 10) {
            void Send(Text('请更换其他固定数值装备爬塔'));
            return false;
        }
    }
    let lingshi = 0;
    let cengshu = 0;
    while (player.当前血量 > 0) {
        const ZYTcs = player.镇妖塔层数;
        let Health = 0;
        let Attack = 0;
        let Defence = 0;
        let Reward = 0;
        Health = 50000 * ZYTcs + 10000;
        Attack = 22000 * ZYTcs + 10000;
        Defence = 36000 * ZYTcs + 10000;
        if (ZYTcs < 100) {
            Reward = 260 * ZYTcs + 100;
        }
        else if (ZYTcs >= 100 && ZYTcs < 200) {
            Reward = 360 * ZYTcs + 1000;
        }
        else if (ZYTcs >= 200) {
            Reward = 700 * ZYTcs + 1000;
        }
        if (Reward > 400000) {
            Reward = 400000;
        }
        if (player.镇妖塔层数 > 6000) {
            Reward = 0;
        }
        const bosszt = {
            Health: Health,
            Attack: Attack,
            Defence: Defence};
        let BattleFrame = 0;
        const msg = [];
        let BOSSCurrentAttack = bosszt.Attack;
        let BOSSCurrentDefence = bosszt.Defence;
        while (player.当前血量 > 0 && bosszt.Health > 0) {
            const Random = Math.random();
            if (!(BattleFrame & 1)) {
                let playerToBOSSDamage = Harm(player.攻击, BOSSCurrentDefence) + Math.trunc(player.攻击 * player.灵根.法球倍率);
                const SuperAttack = Math.random() < player.暴击率 ? 1.5 : 1;
                msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
                if (Random > 0.5 && BattleFrame === 0) {
                    msg.push('你的进攻被反手了！');
                    playerToBOSSDamage = Math.trunc(playerToBOSSDamage * 0.3);
                }
                else if (Random > 0.94) {
                    msg.push('你的攻击被破解了');
                    playerToBOSSDamage = Math.trunc(playerToBOSSDamage * 6);
                }
                else if (Random > 0.9) {
                    msg.push('你的攻击被挡了一部分');
                    playerToBOSSDamage = Math.trunc(playerToBOSSDamage * 0.8);
                }
                else if (Random < 0.1) {
                    msg.push('你抓到了未知妖物的破绽');
                    playerToBOSSDamage = Math.trunc(playerToBOSSDamage * 1.2);
                }
                playerToBOSSDamage = Math.trunc(playerToBOSSDamage * SuperAttack + Math.random() * 100);
                bosszt.Health -= playerToBOSSDamage;
                if (bosszt.Health < 0) {
                    bosszt.Health = 0;
                }
                msg.push(`${player.名号}${ifbaoji(SuperAttack)}造成伤害${playerToBOSSDamage}，未知妖物剩余血量${bosszt.Health}`);
            }
            else {
                let bOSSToPlayerDamage = Harm(BOSSCurrentAttack, Math.trunc(player.防御 * 0.1));
                if (Random > 0.94) {
                    msg.push('未知妖物的攻击被你破解了');
                    bOSSToPlayerDamage = Math.trunc(bOSSToPlayerDamage * 0.6);
                }
                else if (Random > 0.9) {
                    msg.push('未知妖物的攻击被你挡了一部分');
                    bOSSToPlayerDamage = Math.trunc(bOSSToPlayerDamage * 0.8);
                }
                else if (Random < 0.1) {
                    msg.push('未知妖物抓到了你的破绽');
                    bOSSToPlayerDamage = Math.trunc(bOSSToPlayerDamage * 1.2);
                }
                player.当前血量 -= bOSSToPlayerDamage;
                if (BOSSCurrentAttack > bosszt.Attack) {
                    BOSSCurrentAttack = bosszt.Attack;
                }
                if (BOSSCurrentDefence < bosszt.Defence) {
                    BOSSCurrentDefence = bosszt.Defence;
                }
                if (player.当前血量 < 0) {
                    player.当前血量 = 0;
                }
                msg.push(`未知妖物攻击了${player.名号}，造成伤害${bOSSToPlayerDamage}，${player.名号}剩余血量${player.当前血量}`);
            }
            BattleFrame++;
        }
        if (bosszt.Health <= 0) {
            player.镇妖塔层数 += 5;
            cengshu += 5;
            lingshi += Reward;
            if (Reward > 0) {
                player.灵石 -= 20000;
            }
            player.当前血量 = player.血量上限;
        }
        else if (player.当前血量 <= 0) {
            player.当前血量 = 0;
            player.灵石 -= Math.trunc(Reward * 2);
        }
    }
    player.灵石 += lingshi;
    void Send(Text(`\n恭喜你获得灵石${lingshi},本次通过${cengshu}层,失去部分灵石`));
    void setDataJSONStringifyByKey(keys.player(userId), player);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
