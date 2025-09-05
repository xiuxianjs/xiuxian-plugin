import { pushInfo } from '../../../../model/api.js';
import { getJSON, userKey } from '../../../../model/utils/redisHelper.js';
import { keysAction, keys } from '../../../../model/keys.js';
import { delDataByKey, getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { notUndAndNull } from '../../../../model/common.js';
import { addExp, addExp2 } from '../../../../model/economy.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
import { Mention } from 'alemonjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { setFileValue } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { readDanyao, writeDanyao } from '../../../../model/danyao.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import { setDataByUserId } from '../../../../model/Redis.js';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?出关$/;
const res = onResponse(selects, async (e) => {
    const action = await getPlayerAction(e.UserId);
    if (!action) {
        return;
    }
    if (action.shutup === 1) {
        return;
    }
    const end_time = action.end_time;
    const start_time = action.end_time - Number(action.time);
    const now_time = Date.now();
    let time;
    const cf = await config.getConfig('xiuxian', 'xiuxian');
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
        await biguanJiesuan(e.UserId, time, false, e.ChannelId);
    }
    else {
        await biguanJiesuan(e.UserId, time);
    }
    void delDataByKey(keysAction.action(e.UserId));
    await setDataByUserId(e.UserId, 'game_action', 0);
});
async function getPlayerAction(userId) {
    const raw = await getJSON(userKey(userId, 'action'));
    if (!raw) {
        return false;
    }
    return raw;
}
async function biguanJiesuan(userId, time, isRandom, group_id) {
    await playerEfficiency(userId);
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        return false;
    }
    const LevelList = await getDataList('Level1');
    const now_level_id = LevelList.find(item => item.level_id === player.level_id).level_id;
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const size = cf.biguan.size;
    const xiuwei = Math.floor(size * now_level_id * (player.修炼效率提升 + 1));
    const blood = Math.floor(player.血量上限 * 0.02);
    let otherEXP = 0;
    const msg = [Mention(userId)];
    let transformation = '修为';
    const dy = await readDanyao(userId);
    logger.info('dy', dy);
    if (dy.biguan > 0) {
        dy.biguan--;
        if (dy.biguan === 0) {
            dy.biguanxl = 0;
        }
    }
    if (dy.lianti > 0) {
        transformation = '血气';
        dy.lianti--;
    }
    let other_x = 0;
    let qixue = 0;
    if ((await existNajieThing(userId, '魔界秘宝', '道具')) && player.魔道值 > 999) {
        other_x = Math.trunc(xiuwei * 0.15 * time);
        await addNajieThing(userId, '魔界秘宝', '道具', -1);
        msg.push('\n消耗了道具[魔界秘宝],额外增加' + other_x + '修为');
        await addExp(userId, other_x);
    }
    if ((await existNajieThing(userId, '神界秘宝', '道具')) && player.魔道值 < 1 && (player.灵根.type === '转生' || player.level_id > 41)) {
        qixue = Math.trunc(xiuwei * 0.1 * time);
        await addNajieThing(userId, '神界秘宝', '道具', -1);
        msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气');
        await addExp2(userId, qixue);
    }
    await setFileValue(userId, blood * time, '当前血量');
    if (transformation === '血气') {
        await setFileValue(userId, (xiuwei * time + otherEXP) * dy.beiyong4, transformation);
        msg.push('\n受到炼神之力的影响,增加血气:' + xiuwei * time * dy.beiyong4, '  获得治疗,血量增加:' + blood * time);
    }
    else {
        await setFileValue(userId, xiuwei * time + otherEXP, transformation);
        {
            msg.push('\n增加修为:' + xiuwei * time, ',获得治疗,血量增加:' + blood * time);
        }
    }
    if (group_id) {
        pushInfo(group_id, true, msg);
    }
    else {
        pushInfo(userId, false, msg);
    }
    if (dy.lianti <= 0) {
        dy.lianti = 0;
        dy.beiyong4 = 0;
    }
    await writeDanyao(userId, dy);
    return false;
}
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
