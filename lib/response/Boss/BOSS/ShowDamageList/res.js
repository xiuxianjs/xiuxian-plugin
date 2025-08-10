import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { sleep } from '../../../../model/xiuxian.js';
import 'dayjs';
import { BossIsAlive, SortPlayer } from '../../boss.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?妖王贡献榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (await BossIsAlive()) {
        let PlayerRecord = await redis.get('xiuxian@1.3.0Record');
        let WorldBossStatusStr = await redis.get('Xiuxian:WorldBossStatus');
        WorldBossStatusStr = JSON.parse(WorldBossStatusStr);
        PlayerRecord = JSON.parse(PlayerRecord);
        let PlayerList = await SortPlayer(PlayerRecord);
        if (!PlayerRecord?.Name) {
            Send(Text('还没人挑战过妖王'));
            return false;
        }
        let CurrentQQ;
        let TotalDamage = 0;
        for (let i = 0; i < (PlayerList.length <= 20 ? PlayerList.length : 20); i++)
            TotalDamage += PlayerRecord.TotalDamage[PlayerList[i]];
        let msg = ['****妖王周本贡献排行榜****'];
        for (let i = 0; i < PlayerList.length; i++) {
            if (i < 20) {
                let Reward = Math.trunc((PlayerRecord.TotalDamage[PlayerList[i]] / TotalDamage) *
                    WorldBossStatusStr.Reward);
                Reward = Reward < 200000 ? 200000 : Reward;
                msg.push('第' +
                    `${i + 1}` +
                    '名:\n' +
                    `名号:${PlayerRecord.Name[PlayerList[i]]}` +
                    '\n' +
                    `总伤害:${PlayerRecord.TotalDamage[PlayerList[i]]}` +
                    `\n${WorldBossStatusStr.Health == 0 ? `已得到灵石` : `预计得到灵石`}:${Reward}`);
            }
            if (PlayerRecord.QQ[PlayerList[i]] == e.UserId)
                CurrentQQ = i + 1;
        }
        Send(Text(msg.join('\n')));
        await sleep(1000);
        if (CurrentQQ)
            Send(Text(`你在妖王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${PlayerRecord.TotalDamage[PlayerList[CurrentQQ - 1]]}，再接再厉！`));
    }
    else
        Send(Text('妖王未开启！'));
});

export { res as default, regular, selects };
