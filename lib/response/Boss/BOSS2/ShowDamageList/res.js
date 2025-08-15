import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { sleep } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'crypto';
import { BossIsAlive, SortPlayer } from '../../boss.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?金角大王贡献榜$/;
function parseJson(raw) {
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    if (!(await BossIsAlive())) {
        Send(Text('金角大王未开启！'));
        return false;
    }
    const PlayerRecord = parseJson(await redis.get('xiuxian@1.3.0Record2'));
    const WorldBossStatusStr = parseJson(await redis.get('Xiuxian:WorldBossStatus2'));
    if (!PlayerRecord || !Array.isArray(PlayerRecord.Name)) {
        Send(Text('还没人挑战过金角大王'));
        return false;
    }
    const PlayerList = await SortPlayer(PlayerRecord);
    if (!Array.isArray(PlayerList) || PlayerList.length === 0) {
        Send(Text('还没人挑战过金角大王'));
        return false;
    }
    let TotalDamage = 0;
    const limit = Math.min(PlayerList.length, 20);
    for (let i = 0; i < limit; i++) {
        const idx = PlayerList[i];
        TotalDamage += PlayerRecord.TotalDamage[idx] || 0;
    }
    if (TotalDamage <= 0)
        TotalDamage = 1;
    const rewardBase = WorldBossStatusStr?.Reward || 0;
    const bossDead = (WorldBossStatusStr?.Health || 0) === 0;
    const msg = ['****金角大王周本贡献排行榜****'];
    let CurrentQQ;
    for (let i = 0; i < PlayerList.length && i < 20; i++) {
        const idx = PlayerList[i];
        const dmg = PlayerRecord.TotalDamage[idx] || 0;
        let Reward = Math.trunc((dmg / TotalDamage) * rewardBase);
        if (Reward < 200000)
            Reward = 200000;
        msg.push(`第${i + 1}名:\n名号:${PlayerRecord.Name[idx]}\n总伤害:${dmg}\n${bossDead ? '已得到灵石' : '预计得到灵石'}:${Reward}`);
        if (PlayerRecord.QQ[idx] == e.UserId)
            CurrentQQ = i + 1;
    }
    Send(Text(msg.join('\n')));
    await sleep(1000);
    if (CurrentQQ) {
        const idx = PlayerList[CurrentQQ - 1];
        Send(Text(`你在金角大王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${PlayerRecord.TotalDamage[idx] || 0}，再接再厉！`));
    }
    return false;
});

export { res as default, regular };
