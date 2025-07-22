import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
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
import { existplayer } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';
import { redis } from '../../../../api/api.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)清空赏金榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let action = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing');
    action = await JSON.parse(action);
    action = null;
    Send(Text('清除完成'));
    await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action));
});

export { res as default, name, regular, selects };
