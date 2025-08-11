import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { sleep } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
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
import { BossIsAlive, SortPlayer } from '../../boss.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?妖王贡献榜$/;
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
        Send(Text('妖王未开启！'));
        return false;
    }
    const PlayerRecord = parseJson(await redis.get('xiuxian@1.3.0Record'));
    const WorldBossStatusStr = parseJson(await redis.get('Xiuxian:WorldBossStatus'));
    if (!PlayerRecord || !Array.isArray(PlayerRecord.Name)) {
        Send(Text('还没人挑战过妖王'));
        return false;
    }
    const PlayerList = await SortPlayer(PlayerRecord);
    if (!Array.isArray(PlayerList) || PlayerList.length === 0) {
        Send(Text('还没人挑战过妖王'));
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
    const msg = ['****妖王周本贡献排行榜****'];
    let CurrentQQ;
    for (let i = 0; i < PlayerList.length && i < 20; i++) {
        const idx = PlayerList[i];
        const dmg = PlayerRecord.TotalDamage[idx] || 0;
        let Reward = Math.trunc((dmg / TotalDamage) * rewardBase);
        if (Reward < 200000)
            Reward = 200000;
        msg.push(`第${i + 1}名:` +
            `\n名号:${PlayerRecord.Name[idx]}` +
            `\n总伤害:${dmg}` +
            `\n${bossDead ? '已得到灵石' : '预计得到灵石'}:${Reward}`);
        if (PlayerRecord.QQ[idx] == e.UserId)
            CurrentQQ = i + 1;
    }
    Send(Text(msg.join('\n')));
    await sleep(1000);
    if (CurrentQQ) {
        const idx = PlayerList[CurrentQQ - 1];
        Send(Text(`你在妖王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${PlayerRecord.TotalDamage[idx] || 0}，再接再厉！`));
    }
    return false;
});

export { res as default, regular, selects };
