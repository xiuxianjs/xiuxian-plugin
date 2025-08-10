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
import '@alemonjs/db';
import { existplayer, readPlayer, addCoin } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(采矿$)|(采矿(.*)(分|分钟)$)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 1) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let player = await readPlayer(usr_qq);
    if (player.occupation != '采矿师') {
        Send(Text('你挖矿许可证呢？非法挖矿，罚款200灵石'));
        await addCoin(usr_qq, -200);
        return false;
    }
    let time = e.MessageText.replace(/^(#|＃|\/)?采矿/, '');
    time = time.replace('分钟', '');
    if (parseInt(time) == parseInt(time)) {
        time = parseInt(time);
        let y = 30;
        let x = 24;
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
        action: '采矿',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        plant: '1',
        mine: '0',
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1'
    };
    if (e.name === 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text(`现在开始采矿${time}分钟`));
});

export { res as default, regular };
