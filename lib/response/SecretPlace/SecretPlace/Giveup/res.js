import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?逃离/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        Send(Text('没存档你逃个锤子!'));
        return false;
    }
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 1) {
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

export { res as default, regular };
