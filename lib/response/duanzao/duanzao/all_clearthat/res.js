import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import { writeDuanlu } from '../../../../model/duanzaofu.js';
import '../../../../model/xiuxian.js';
import { __PATH } from '../../../../model/paths.js';
import '@alemonjs/db';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?全体清空锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    await writeDuanlu([]);
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (let player_id of playerList) {
        let action = null;
        await redis.set('xiuxian@1.3.0:' + player_id + ':action10', JSON.stringify(action));
    }
    Send(Text('清除完成'));
});

export { res as default, regular };
