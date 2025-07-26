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
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import { existplayer, readPlayer, isNotNull, readEquipment, writeEquipment, Add_HP, playerEfficiency, get_random_fromARR } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { getDataByUserId } from '../../../../model/Redis.js';

const regular = /^(#|＃|\/)?登仙$/;
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
    let player = await readPlayer(usr_qq);
    let now_level = data.Level_list.find(item => item.level_id == player.level_id).level;
    if (now_level != '渡劫期') {
        Send(Text(`你非渡劫期修士！`));
        return false;
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
    if (player.power_place != 0) {
        Send(Text('请先渡劫！'));
        return false;
    }
    let now_level_id;
    if (!isNotNull(player.level_id)) {
        Send(Text('请先#刷新信息'));
        return false;
    }
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    let now_exp = player.修为;
    let need_exp = data.Level_list.find(item => item.level_id == player.level_id).exp;
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
        let equipment = await readEquipment(usr_qq);
        await writeEquipment(usr_qq, equipment);
        await Add_HP(usr_qq, 99999999);
        if (now_level_id >= 42) {
            let player = await data.getData('player', usr_qq);
            if (!isNotNull(player.宗门)) {
                return false;
            }
            if (player.宗门.职位 != '宗主') {
                let ass = data.getAssociation(player.宗门.宗门名称);
                ass[player.宗门.职位] = ass[player.宗门.职位].filter(item => item != usr_qq);
                ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq);
                data.setAssociation(ass.宗门名称, ass);
                delete player.宗门;
                data.setData('player', usr_qq, player);
                await playerEfficiency(usr_qq);
                Send(Text('退出宗门成功'));
            }
            else {
                let ass = data.getAssociation(player.宗门.宗门名称);
                if (ass.所有成员.length < 2) {
                    await redis.del(`${data.association}:${player.宗门.宗门名称}`);
                    delete player.宗门;
                    data.setData('player', usr_qq, player);
                    await playerEfficiency(usr_qq);
                    Send(Text('一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'));
                }
                else {
                    ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq);
                    delete player.宗门;
                    data.setData('player', usr_qq, player);
                    await playerEfficiency(usr_qq);
                    let randmember_qq;
                    if (ass.副宗主.length > 0) {
                        randmember_qq = await get_random_fromARR(ass.副宗主);
                    }
                    else if (ass.长老.length > 0) {
                        randmember_qq = await get_random_fromARR(ass.长老);
                    }
                    else if (ass.内门弟子.length > 0) {
                        randmember_qq = await get_random_fromARR(ass.内门弟子);
                    }
                    else {
                        randmember_qq = await get_random_fromARR(ass.所有成员);
                    }
                    let randmember = await await data.getData('player', randmember_qq);
                    ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(item => item != randmember_qq);
                    ass['宗主'] = randmember_qq;
                    randmember.宗门.职位 = '宗主';
                    data.setData('player', randmember_qq, randmember);
                    data.setData('player', usr_qq, player);
                    data.setAssociation(ass.宗门名称, ass);
                    Send(Text(`飞升前,遵循你的嘱托,${randmember.名号}将继承你的衣钵,成为新一任的宗主`));
                }
            }
        }
        return false;
    }
});

export { res as default, regular };
