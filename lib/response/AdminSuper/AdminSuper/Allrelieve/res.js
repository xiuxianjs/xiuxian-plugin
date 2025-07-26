import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import { selects } from '../../../index.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import '@alemonjs/db';
import 'dayjs';

const regular = /^(#|＃|\/)?解除所有$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return;
    Send(Text('开始行动！'));
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (const player_id of playerList) {
        await redis.del(`xiuxian@1.3.0:${player_id}:game_action`);
        const record = `xiuxian@1.3.0:${player_id}:action`;
        const action = await redis.get(record);
        if (action) {
            await redis.del(record);
            let arr = JSON.parse(action);
            arr.is_jiesuan = 1;
            arr.shutup = 1;
            arr.working = 1;
            arr.power_up = 1;
            arr.Place_action = 1;
            arr.Place_actionplus = 1;
            arr.end_time = new Date().getTime();
            delete arr.group_id;
            await redis.set(record, JSON.stringify(arr));
        }
    }
    Send(Text('行动结束！'));
});

export { res as default, regular };
