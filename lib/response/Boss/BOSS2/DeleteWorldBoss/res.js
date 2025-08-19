import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { BossIsAlive } from '../../boss.js';
import { selects } from '../../../mw.js';
import { KEY_RECORD_TWO } from '../../../../model/constants.js';

const regular = /^(#|＃|\/)?关闭金角大王$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (e.IsMaster) {
        if (await BossIsAlive()) {
            await redis.del('Xiuxian:WorldBossStatus2');
            await redis.del(KEY_RECORD_TWO);
            Send(Text('金角大王挑战关闭！'));
        }
        else {
            Send(Text('金角大王未开启'));
        }
    }
});

export { res as default, regular };
