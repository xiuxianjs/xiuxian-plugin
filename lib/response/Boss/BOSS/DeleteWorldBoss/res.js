import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import { BossIsAlive } from '../../boss.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?关闭妖王$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.IsMaster) {
        if (await BossIsAlive()) {
            await redis.del('Xiuxian:WorldBossStatus');
            await redis.del('xiuxian@1.3.0Record');
            Send(Text('妖王挑战关闭！'));
        }
        else
            Send(Text('妖王未开启'));
    }
});

export { res as default, regular, selects };
