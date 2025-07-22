import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { Read_player } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)允许双修$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let player = await Read_player(usr_qq);
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':couple', 0);
    Send(Text(player.名号 + '开启了允许模式'));
});

export { res as default, name, regular, selects };
