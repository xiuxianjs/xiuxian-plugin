import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import { Write_duanlu } from '../../../../model/duanzaofu.js';
import '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)全体清空锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    await Write_duanlu([]);
    let playerList = [];
    let files = fs
        .readdirSync('./resources/data/xiuxian_player')
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    for (let player_id of playerList) {
        let action = null;
        await redis.set('xiuxian@1.3.0:' + player_id + ':action10', JSON.stringify(action));
    }
    Send(Text('清除完成'));
});

export { res as default, name, regular, selects };
