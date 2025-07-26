import { redis, pushInfo } from '../../../../api/api.js';
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
import { playerEfficiency, isNotNull, Read_danyao, existNajieThing, addNajieThing, Add_修为 as Add___, Add_血气 as Add___$1, setFileValue, Write_danyao } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { Mention } from 'alemonjs';

const regular = /^(#|＃|\/)?出关$/;
var res = onResponse(selects, async (e) => {
    let action = await getPlayerAction(e.UserId);
    if (!action)
        return;
    if (action.shutup == 1)
        return;
    let end_time = action.end_time;
    let start_time = action.end_time - action.time;
    let now_time = new Date().getTime();
    let time;
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let y = cf.biguan.time;
    let x = cf.biguan.cycle;
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
        await biguan_jiesuan(e.UserId, time, false, e.ChannelId);
    }
    else {
        await biguan_jiesuan(e.UserId, time);
    }
    let arr = action;
    arr.shutup = 1;
    arr.working = 1;
    arr.power_up = 1;
    arr.Place_action = 1;
    arr.end_time = new Date().getTime();
    delete arr.group_id;
    await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr));
});
async function getPlayerAction(usr_qq) {
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    if (!action) {
        return false;
    }
    action = JSON.parse(action);
    return action;
}
async function biguan_jiesuan(user_id, time, is_random, group_id) {
    let usr_qq = user_id;
    await playerEfficiency(usr_qq);
    let player = await data.getData('player', usr_qq);
    let now_level_id;
    if (!isNotNull(player.level_id)) {
        return false;
    }
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let size = cf.biguan.size;
    let xiuwei = Math.floor(size * now_level_id * (player.修炼效率提升 + 1));
    let blood = Math.floor(player.血量上限 * 0.02);
    let other_xiuwei = 0;
    let msg = [Mention(usr_qq)];
    let transformation = '修为';
    let dy = await Read_danyao(usr_qq);
    if (dy.biguan > 0) {
        dy.biguan--;
        if (dy.biguan == 0) {
            dy.biguanxl = 0;
        }
    }
    if (dy.lianti > 0) {
        transformation = '血气';
        dy.lianti--;
    }
    let other_x = 0;
    let qixue = 0;
    if ((await existNajieThing(usr_qq, '魔界秘宝', '道具')) &&
        player.魔道值 > 999) {
        other_x = Math.trunc(xiuwei * 0.15 * time);
        await addNajieThing(usr_qq, '魔界秘宝', '道具', -1);
        msg.push('\n消耗了道具[魔界秘宝],额外增加' + other_x + '修为');
        await Add___(usr_qq, other_x);
    }
    if ((await existNajieThing(usr_qq, '神界秘宝', '道具')) &&
        player.魔道值 < 1 &&
        (player.灵根.type == '转生' || player.level_id > 41)) {
        qixue = Math.trunc(xiuwei * 0.1 * time);
        await addNajieThing(usr_qq, '神界秘宝', '道具', -1);
        msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气');
        await Add___$1(usr_qq, qixue);
    }
    await setFileValue(usr_qq, blood * time, '当前血量');
    if (transformation == '血气') {
        await setFileValue(usr_qq, (xiuwei * time + other_xiuwei) * dy.beiyong4, transformation);
        msg.push('\n受到炼神之力的影响,增加血气:' + xiuwei * time * dy.beiyong4, '  获得治疗,血量增加:' + blood * time);
    }
    else {
        await setFileValue(usr_qq, xiuwei * time + other_xiuwei, transformation);
        {
            msg.push('\n增加修为:' + xiuwei * time, ',获得治疗,血量增加:' + blood * time);
        }
    }
    if (group_id) {
        await pushInfo('', group_id, true, msg);
    }
    else {
        await pushInfo('', usr_qq, false, msg);
    }
    if (dy.lianti <= 0) {
        dy.lianti = 0;
        dy.beiyong4 = 0;
    }
    await Write_danyao(usr_qq, dy);
    return false;
}

export { res as default, regular };
