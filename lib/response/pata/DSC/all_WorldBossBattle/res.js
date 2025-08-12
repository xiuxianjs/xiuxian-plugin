import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
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
import '../../../../model/danyao.js';
import 'lodash-es';
import { Harm, ifbaoji } from '../../../../model/battle.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import '../../../../model/equipment.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import 'classnames';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键炼神魄$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    let xueqi = 0;
    let cengshu = 0;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await await data.getData('player', usr_qq);
    while (player.当前血量 > 0) {
        const 神魄段数 = player.神魄段数;
        const Health = 100000 * 神魄段数;
        const Attack = 250000 * 神魄段数;
        const Defence = 200000 * 神魄段数;
        let Reward = 1200 * 神魄段数;
        if (Reward > 400000)
            Reward = 400000;
        if (player.神魄段数 > 6000)
            Reward = 0;
        const bosszt = {
            Health: Health,
            Attack: Attack,
            Defence: Defence};
        let BattleFrame = 0;
        const msg = [];
        let BOSSCurrentAttack = bosszt.Attack;
        let BOSSCurrentDefence = bosszt.Defence;
        while (player.当前血量 > 0 && bosszt.Health > 0) {
            if (!(BattleFrame & 1)) {
                let Player_To_BOSS_Damage = Harm(player.攻击, BOSSCurrentDefence) +
                    Math.trunc(player.攻击 * player.灵根.法球倍率);
                const SuperAttack = 2 < player.暴击率 ? 1.5 : 1;
                msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
                if (BattleFrame == 0) {
                    msg.push('你进入锻神池，开始了！');
                    Player_To_BOSS_Damage = 0;
                }
                Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * SuperAttack);
                bosszt.Health -= Player_To_BOSS_Damage;
                if (bosszt.Health < 0) {
                    bosszt.Health = 0;
                }
                msg.push(`${player.名号}${ifbaoji(SuperAttack)}消耗了${Player_To_BOSS_Damage}，此段剩余${bosszt.Health}未炼化`);
            }
            else {
                const BOSS_To_Player_Damage = Harm(BOSSCurrentAttack, Math.trunc(player.防御 * 0.1));
                player.当前血量 -= BOSS_To_Player_Damage;
                if (BOSSCurrentAttack > bosszt.Attack)
                    BOSSCurrentAttack = bosszt.Attack;
                if (BOSSCurrentDefence < bosszt.Defence)
                    BOSSCurrentDefence = bosszt.Defence;
                if (player.当前血量 < 0) {
                    player.当前血量 = 0;
                }
                msg.push(`${player.名号}损失血量${BOSS_To_Player_Damage}，${player.名号}剩余血量${player.当前血量}`);
            }
            BattleFrame++;
        }
        if (bosszt.Health <= 0) {
            player.神魄段数 += 5;
            cengshu += 5;
            xueqi += Reward;
            player.当前血量 = player.血量上限;
        }
        else if (player.当前血量 <= 0) {
            player.当前血量 = 0;
            player.修为 -= Math.trunc(Reward * 2);
        }
    }
    player.血气 += xueqi;
    Send(Text([`\n恭喜你获得血气${xueqi},本次通过${cengshu}层,失去部分修为`].join('')));
    data.setData('player', usr_qq, player);
});

export { res as default, regular };
