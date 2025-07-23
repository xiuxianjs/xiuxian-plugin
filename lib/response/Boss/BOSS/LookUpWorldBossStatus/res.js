import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import { BossIsAlive, InitWorldBoss, LookUpWorldBossStatus } from '../../boss.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?妖王状态$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (await BossIsAlive()) {
        let WorldBossStatusStr = await redis.get('Xiuxian:WorldBossStatus');
        if (WorldBossStatusStr) {
            const WorldBossStatus = JSON.parse(WorldBossStatusStr);
            if (new Date().getTime() - WorldBossStatus.KilledTime < 86400000) {
                Send(Text(`妖王正在刷新,21点开启`));
                return false;
            }
            else if (WorldBossStatus.KilledTime != -1) {
                if ((await InitWorldBoss()) == false)
                    await LookUpWorldBossStatus(e);
                return false;
            }
            let ReplyMsg = [
                `----妖王状态----\n攻击:????????????\n防御:????????????\n血量:${WorldBossStatus.Health}\n奖励:${WorldBossStatus.Reward}`
            ];
            Send(Text(ReplyMsg.join('\n')));
        }
    }
    else
        Send(Text('妖王未开启！'));
});

export { res as default, regular, selects };
