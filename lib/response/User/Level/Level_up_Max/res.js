import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { playerEfficiency } from '../../../../model/efficiency.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { notUndAndNull, getRandomFromARR } from '../../../../model/common.js';
import { addHP } from '../../../../model/economy.js';
import 'lodash-es';
import { readEquipment, writeEquipment } from '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
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
import { selects } from '../../../index.js';
import { getDataByUserId } from '../../../../model/Redis.js';

const regular = /^(#|＃|\/)?登仙$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const game_action_raw = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    const game_action = game_action_raw == null ? 0 : Number(game_action_raw);
    if (game_action == 1) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    const now_level = data.Level_list.find(item => item.level_id == player.level_id).level;
    if (now_level != '渡劫期') {
        Send(Text(`你非渡劫期修士！`));
        return false;
    }
    const actionRaw = await getDataByUserId(usr_qq, 'action');
    let action = null;
    try {
        action = actionRaw ? JSON.parse(actionRaw) : null;
    }
    catch {
        action = null;
    }
    if (action != null) {
        const action_end_time = action.end_time;
        const now_time = Date.now();
        if (now_time <= action_end_time) {
            const m = Math.floor((action_end_time - now_time) / 1000 / 60);
            const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    if (player.power_place != 0) {
        Send(Text('请先渡劫！'));
        return false;
    }
    let now_level_id;
    if (!notUndAndNull(player.level_id)) {
        Send(Text('请先#刷新信息'));
        return false;
    }
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    const now_exp = player.修为;
    const need_exp = data.Level_list.find(item => item.level_id == player.level_id).exp;
    if (now_exp < need_exp) {
        Send(Text(`修为不足,再积累${need_exp - now_exp}修为后方可成仙！`));
        return false;
    }
    if (player.power_place == 0) {
        Send(Text('天空一声巨响，一道虚影从眼中浮现，突然身体微微颤抖，似乎感受到了什么，' +
            player.名号 +
            '来不及思索，立即向前飞去！只见万物仰头相望，似乎感觉到了，也似乎没有感觉，殊不知......'));
        now_level_id = now_level_id + 1;
        player.level_id = now_level_id;
        player.修为 -= need_exp;
        await writePlayer(usr_qq, player);
        const equipment = await readEquipment(usr_qq);
        await writeEquipment(usr_qq, equipment);
        await addHP(usr_qq, 99999999);
        if (now_level_id >= 42) {
            const player = await data.getData('player', usr_qq);
            if (!notUndAndNull(player.宗门)) {
                return false;
            }
            if (player.宗门.职位 != '宗主') {
                const ass = await data.getAssociation(player.宗门.宗门名称);
                if (ass === 'error')
                    return false;
                const association = ass;
                const pos = player.宗门.职位;
                const curList = association[pos] || [];
                association[pos] = curList.filter(item => item != usr_qq);
                const allList = association['所有成员'] || [];
                association['所有成员'] = allList.filter(item => item != usr_qq);
                data.setAssociation(association.宗门名称, association);
                delete player.宗门;
                data.setData('player', usr_qq, player);
                await playerEfficiency(usr_qq);
                Send(Text('退出宗门成功'));
            }
            else {
                const ass = await data.getAssociation(player.宗门.宗门名称);
                if (ass === 'error')
                    return false;
                const association = ass;
                const allList = association.所有成员 || [];
                if (allList.length < 2) {
                    await redis.del(`${data.association}:${player.宗门.宗门名称}`);
                    delete player.宗门;
                    data.setData('player', usr_qq, player);
                    await playerEfficiency(usr_qq);
                    Send(Text('一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'));
                }
                else {
                    association['所有成员'] = allList.filter(item => item != usr_qq);
                    delete player.宗门;
                    data.setData('player', usr_qq, player);
                    await playerEfficiency(usr_qq);
                    let randmember_qq;
                    const list_v = association.副宗主 || [];
                    const list_l = association.长老 || [];
                    const list_n = association.内门弟子 || [];
                    if (list_v.length > 0) {
                        randmember_qq = await getRandomFromARR(list_v);
                    }
                    else if (list_l.length > 0) {
                        randmember_qq = await getRandomFromARR(list_l);
                    }
                    else if (list_n.length > 0) {
                        randmember_qq = await getRandomFromARR(list_n);
                    }
                    else {
                        randmember_qq = await getRandomFromARR(association.所有成员 || []);
                    }
                    const randmember = await await data.getData('player', randmember_qq);
                    const rPos = randmember.宗门.职位;
                    const rList = association[rPos] || [];
                    association[rPos] = rList.filter(item => item != randmember_qq);
                    association['宗主'] = randmember_qq;
                    randmember.宗门.职位 = '宗主';
                    data.setData('player', randmember_qq, randmember);
                    data.setData('player', usr_qq, player);
                    data.setAssociation(association.宗门名称, association);
                    Send(Text(`飞升前,遵循你的嘱托,${randmember.名号}将继承你的衣钵,成为新一任的宗主`));
                }
            }
        }
        return false;
    }
});

export { res as default, regular };
