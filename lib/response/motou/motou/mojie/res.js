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
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, Read_player } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)堕入魔界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 0) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = Math.floor((action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let player = await Read_player(usr_qq);
    if (player.魔道值 < 1000) {
        Send(Text('你不是魔头'));
        return false;
    }
    if (player.修为 < 4000000) {
        Send(Text('修为不足'));
        return false;
    }
    player.魔道值 -= 100;
    player.修为 -= 4000000;
    await Write_player(usr_qq, player);
    let time = 60;
    let action_time = 60000 * time;
    let arr = {
        action: '魔界',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        shutup: '1',
        working: '1',
        Place_action: '1',
        mojie: '0',
        Place_actionplus: '1',
        power_up: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        cishu: '10'
    };
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始进入魔界,' + time + '分钟后归来!'));
});

export { res as default, name, regular, selects };
