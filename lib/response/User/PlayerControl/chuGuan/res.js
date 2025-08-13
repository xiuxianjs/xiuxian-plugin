import { pushInfo } from '../../../../model/api.js';
import { getJSON, userKey } from '../../../../model/utils/redisHelper.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { playerEfficiency } from '../../../../model/efficiency.js';
import '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import { addExp, addExp2 } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import { readDanyao } from '../../../../model/danyao.js';
import '../../../../model/temp.js';
import { setFileValue } from '../../../../model/cultivation.js';
import 'dayjs';
import { Mention } from 'alemonjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import 'fs';
import 'crypto';
import { setDataByUserId } from '../../../../model/Redis.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?出关$/;
var res = onResponse(selects, async (e) => {
    const action = await getPlayerAction(e.UserId);
    if (!action)
        return;
    if (action.shutup == 1)
        return;
    const end_time = action.end_time;
    const start_time = action.end_time - Number(action.time);
    const now_time = Date.now();
    let time;
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const y = cf.biguan.time;
    const x = cf.biguan.cycle;
    if (end_time > now_time) {
        time = Math.floor((Date.now() - start_time) / 1000 / 60);
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
        time = Math.floor(Number(action.time) / 1000 / 60);
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
    const arr = action;
    arr.shutup = 1;
    arr.working = 1;
    arr.power_up = 1;
    arr.Place_action = 1;
    arr.end_time = Date.now();
    delete arr.group_id;
    await setDataByUserId(e.UserId, 'action', JSON.stringify(arr));
    await setDataByUserId(e.UserId, 'game_action', 0);
});
async function getPlayerAction(usr_qq) {
    const raw = await getJSON(userKey(usr_qq, 'action'));
    if (!raw)
        return false;
    return raw;
}
async function biguan_jiesuan(user_id, time, is_random, group_id) {
    const usr_qq = user_id;
    await playerEfficiency(usr_qq);
    const player = await data.getData('player', usr_qq);
    if (!notUndAndNull(player.level_id)) {
        return false;
    }
    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const size = cf.biguan.size;
    const xiuwei = Math.floor(size * now_level_id * (player.修炼效率提升 + 1));
    const blood = Math.floor(player.血量上限 * 0.02);
    let other_xiuwei = 0;
    const msg = [Mention(usr_qq)];
    let transformation = '修为';
    const dy = await readDanyao(usr_qq);
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
        await addExp(usr_qq, other_x);
    }
    if ((await existNajieThing(usr_qq, '神界秘宝', '道具')) &&
        player.魔道值 < 1 &&
        (player.灵根.type == '转生' || player.level_id > 41)) {
        qixue = Math.trunc(xiuwei * 0.1 * time);
        await addNajieThing(usr_qq, '神界秘宝', '道具', -1);
        msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气');
        await addExp2(usr_qq, qixue);
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
        await pushInfo(group_id, true, msg);
    }
    else {
        await pushInfo(usr_qq, false, msg);
    }
    if (dy.lianti <= 0) {
        dy.lianti = 0;
        dy.beiyong4 = 0;
    }
    return false;
}

export { res as default, regular };
