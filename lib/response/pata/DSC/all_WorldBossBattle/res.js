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

const regular = /^(#|＃|\/)?一键炼神魄$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    let xueqi = 0;
    let cengshu = 0;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    while (player.当前血量 > 0) {
        const 神魄段数 = player.神魄段数;
        const Health = 100000 * 神魄段数;
        const Attack = 250000 * 神魄段数;
        const Defence = 200000 * 神魄段数;
        let Reward = 1200 * 神魄段数;
        if (Reward > 400000) {
            Reward = 400000;
        }
        if (player.神魄段数 > 6000) {
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
            if (!(BattleFrame & 1)) {
                let playerToBOSSDamage = Harm(player.攻击, BOSSCurrentDefence) + Math.trunc(player.攻击 * player.灵根.法球倍率);
                const SuperAttack = player.暴击率 > 2 ? 1.5 : 1;
                msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
                if (BattleFrame === 0) {
                    msg.push('你进入锻神池，开始了！');
                    playerToBOSSDamage = 0;
                }
                playerToBOSSDamage = Math.trunc(playerToBOSSDamage * SuperAttack);
                bosszt.Health -= playerToBOSSDamage;
                if (bosszt.Health < 0) {
                    bosszt.Health = 0;
                }
                msg.push(`${player.名号}${ifbaoji(SuperAttack)}消耗了${playerToBOSSDamage}，此段剩余${bosszt.Health}未炼化`);
            }
            else {
                const bOSSToPlayerDamage = Harm(BOSSCurrentAttack, Math.trunc(player.防御 * 0.1));
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
                msg.push(`${player.名号}损失血量${bOSSToPlayerDamage}，${player.名号}剩余血量${player.当前血量}`);
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
    void Send(Text([`\n恭喜你获得血气${xueqi},本次通过${cengshu}层,失去部分修为`].join('')));
    void setDataJSONStringifyByKey(keys.player(userId), player);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
