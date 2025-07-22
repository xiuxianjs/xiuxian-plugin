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
import { existplayer } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)逃离/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        Send(Text('没存档你逃个锤子!'));
        return false;
    }
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (+game_action == 0) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        if (action.Place_action == '0' ||
            action.Place_actionplus == '0' ||
            action.mojie == '0') {
            let arr = action;
            arr.is_jiesuan = 1;
            arr.shutup = 1;
            arr.working = 1;
            arr.power_up = 1;
            arr.Place_action = 1;
            arr.Place_actionplus = 1;
            arr.mojie = 1;
            arr.end_time = new Date().getTime();
            delete arr.group_id;
            await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
            Send(Text('你已逃离！'));
            return false;
        }
    }
});

export { res as default, name, regular, selects };
