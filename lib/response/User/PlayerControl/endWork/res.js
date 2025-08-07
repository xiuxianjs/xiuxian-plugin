import { pushInfo } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { getPlayerAction, isNotNull, setFileValue } from '../../../../model/xiuxian.js';
import 'dayjs';
import { setDataByUserId } from '../../../../model/Redis.js';
import { selects } from '../../../index.js';
import { Mention } from 'alemonjs';

const regular = /^(#|＃|\/)?降妖归来$/;
var res = onResponse(selects, async (e) => {
    let action = await getPlayerAction(e.UserId);
    if (action.action == '空闲')
        return;
    if (action.working == 1)
        return false;
    let end_time = action.end_time;
    let start_time = action.end_time - action.time;
    let now_time = new Date().getTime();
    let time;
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let y = cf.work.time;
    let x = cf.work.cycle;
    if (end_time > now_time) {
        time = Math.floor((new Date().getTime() - start_time) / 1000 / 60);
        for (let i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < y) {
            time = 0;
        }
    }
    else {
        time = Math.floor(action.time / 1000 / 60);
        for (let i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < y) {
            time = 0;
        }
    }
    if (e.name === 'message.create' || e.name === 'interaction.create') {
        await dagong_jiesuan(e.UserId, time, false, e.ChannelId);
    }
    else {
        await dagong_jiesuan(e.UserId, time);
    }
    let arr = action;
    arr.is_jiesuan = 1;
    arr.shutup = 1;
    arr.working = 1;
    arr.power_up = 1;
    arr.Place_action = 1;
    arr.end_time = new Date().getTime();
    delete arr.group_id;
    await setDataByUserId(e.UserId, 'action', JSON.stringify(arr));
    await setDataByUserId(e.UserId, 'game_action', 0);
});
async function dagong_jiesuan(user_id, time, is_random, group_id) {
    let usr_qq = user_id;
    let player = await data.getData('player', usr_qq);
    let now_level_id;
    if (!isNotNull(player.level_id)) {
        return false;
    }
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let size = cf.work.size;
    let lingshi = Math.floor(size * now_level_id * (1 + player.修炼效率提升) * 0.5);
    let other_lingshi = 0;
    let msg = [Mention(usr_qq)];
    let get_lingshi = Math.trunc(lingshi * time + other_lingshi * 1.5);
    await setFileValue(usr_qq, get_lingshi, '灵石');
    {
        msg.push('\n增加灵石' + get_lingshi);
    }
    if (group_id) {
        await pushInfo(group_id, true, msg);
    }
    else {
        await pushInfo(usr_qq, false, msg);
    }
    return false;
}

export { res as default, regular };
