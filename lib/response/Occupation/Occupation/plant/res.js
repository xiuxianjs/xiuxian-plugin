import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(采药$)|(采药(.*)(分|分钟)$)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (+game_action == 0) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let player = await Read_player(usr_qq);
    if (player.occupation != '采药师') {
        Send(Text('您采药，您配吗?'));
        return false;
    }
    let time = e.MessageText.replace(/^(#|＃|\/)?采药/, '');
    time = time.replace('分钟', '');
    if (parseInt(time) == parseInt(time)) {
        time = parseInt(time);
        let y = 15;
        let x = 48;
        for (let i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < 30) {
            time = 30;
        }
    }
    else {
        time = 30;
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = Math.floor((action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中，剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let action_time = time * 60 * 1000;
    let arr = {
        action: '采药',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        plant: '0',
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        mine: '1'
    };
    if (e.name === 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text(`现在开始采药${time}分钟`));
});

export { res as default, regular };
