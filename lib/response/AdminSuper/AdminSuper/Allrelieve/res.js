import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import fs from 'fs';
import { createEventName } from '../../../util.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)解除所有$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        Send(Text('开始行动！'));
        let playerList = [];
        let files = fs
            .readdirSync('./resources/data/xiuxian_player')
            .filter(file => file.endsWith('.json'));
        for (let file of files) {
            file = file.replace('.json', '');
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await redis.set('xiuxian@1.3.0:' + player_id + ':game_action', 1);
            let action = await redis.get('xiuxian@1.3.0:' + player_id + ':action');
            if (action) {
                await redis.del('xiuxian@1.3.0:' + player_id + ':action');
                let arr = JSON.parse(action);
                arr.is_jiesuan = 1;
                arr.shutup = 1;
                arr.working = 1;
                arr.power_up = 1;
                arr.Place_action = 1;
                arr.Place_actionplus = 1;
                arr.end_time = new Date().getTime();
                delete arr.group_id;
                await redis.set('xiuxian@1.3.0:' + player_id + ':action', JSON.stringify(arr));
            }
        }
        Send(Text('行动结束！'));
    }
});

export { res as default, name, regular, selects };
