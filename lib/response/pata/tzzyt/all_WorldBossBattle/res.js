import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'dayjs';
import 'lodash-es';
import { Harm, ifbaoji } from '../../../../model/battle.js';
import '../../../../model/settions.js';
import '../../../../model/api.js';
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
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?一键挑战镇妖塔$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(usr_qq));
    if (!player) {
        return;
    }
    const equipment = await getDataJSONParseByKey(keys.equipment(usr_qq));
    const type = ['武器', '护具', '法宝'];
    for (const j of type) {
        if (equipment[j].atk < 10 && equipment[j].def < 10 && equipment[j].HP < 10) {
            Send(Text('请更换其他固定数值装备爬塔'));
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
                let Player_To_BOSS_Damage = Harm(player.攻击, BOSSCurrentDefence) + Math.trunc(player.攻击 * player.灵根.法球倍率);
                const SuperAttack = Math.random() < player.暴击率 ? 1.5 : 1;
                msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
                if (Random > 0.5 && BattleFrame == 0) {
                    msg.push('你的进攻被反手了！');
                    Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.3);
                }
                else if (Random > 0.94) {
                    msg.push('你的攻击被破解了');
                    Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 6);
                }
                else if (Random > 0.9) {
                    msg.push('你的攻击被挡了一部分');
                    Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.8);
                }
                else if (Random < 0.1) {
                    msg.push('你抓到了未知妖物的破绽');
                    Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 1.2);
                }
                Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * SuperAttack + Math.random() * 100);
                bosszt.Health -= Player_To_BOSS_Damage;
                if (bosszt.Health < 0) {
                    bosszt.Health = 0;
                }
                msg.push(`${player.名号}${ifbaoji(SuperAttack)}造成伤害${Player_To_BOSS_Damage}，未知妖物剩余血量${bosszt.Health}`);
            }
            else {
                let BOSS_To_Player_Damage = Harm(BOSSCurrentAttack, Math.trunc(player.防御 * 0.1));
                if (Random > 0.94) {
                    msg.push('未知妖物的攻击被你破解了');
                    BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.6);
                }
                else if (Random > 0.9) {
                    msg.push('未知妖物的攻击被你挡了一部分');
                    BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.8);
                }
                else if (Random < 0.1) {
                    msg.push('未知妖物抓到了你的破绽');
                    BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 1.2);
                }
                player.当前血量 -= BOSS_To_Player_Damage;
                if (BOSSCurrentAttack > bosszt.Attack) {
                    BOSSCurrentAttack = bosszt.Attack;
                }
                if (BOSSCurrentDefence < bosszt.Defence) {
                    BOSSCurrentDefence = bosszt.Defence;
                }
                if (player.当前血量 < 0) {
                    player.当前血量 = 0;
                }
                msg.push(`未知妖物攻击了${player.名号}，造成伤害${BOSS_To_Player_Damage}，${player.名号}剩余血量${player.当前血量}`);
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
    Send(Text(`\n恭喜你获得灵石${lingshi},本次通过${cengshu}层,失去部分灵石`));
    void setDataJSONStringifyByKey(keys.player(usr_qq), player);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
