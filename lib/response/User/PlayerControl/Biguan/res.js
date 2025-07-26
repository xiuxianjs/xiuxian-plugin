import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { getDataByUserId, setDataByUserId } from '../../../../model/Redis.js';

const regular = /^(#|＃|\/)?(闭关$)|(闭关(.*)(分|分钟)$)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 0) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let time = e.MessageText.replace(/^(#|＃|\/)?/, '');
    time = time.replace('闭关', '');
    time = time.replace('分', '');
    time = time.replace('钟', '');
    if (parseInt(time) == parseInt(time)) {
        time = parseInt(time);
        let y = 30;
        let x = 240;
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
    let action = await getDataByUserId(usr_qq, 'action');
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
    let action_time = time * 60 * 1000;
    let arr = {
        action: '闭关',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        plant: '1',
        shutup: '0',
        working: '1',
        Place_action: '1',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        mine: '1'
    };
    await setDataByUserId(usr_qq, 'action', JSON.stringify(arr));
    Send(Text(`现在开始闭关${time}分钟,两耳不闻窗外事了`));
});

export { res as default, regular };
