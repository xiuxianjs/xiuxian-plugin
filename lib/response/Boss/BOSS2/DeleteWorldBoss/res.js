import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import { BossIsAlive } from '../../boss.js';
import { selects } from '../../../index.js';

const regular = /^(#|\/)关闭金角大王$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.IsMaster) {
        if (await BossIsAlive()) {
            await redis.del('Xiuxian:WorldBossStatus2');
            await redis.del('xiuxian@1.3.0Record2');
            Send(Text('金角大王挑战关闭！'));
        }
        else
            Send(Text('金角大王未开启'));
    }
});

export { res as default, regular };
