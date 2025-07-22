import { useSend, Text } from 'alemonjs';
import config from '../../../../model/Config.js';
import fs from 'fs';
import 'path';
import { isNotNull, player_efficiency, get_random_fromARR } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)退出宗门$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门))
        return false;
    let now = new Date();
    let nowTime = now.getTime();
    let addTime;
    let time = config.getConfig('xiuxian', 'xiuxian').CD.joinassociation;
    if (typeof player.宗门.time == 'undefined') {
        addTime = player.宗门.加入时间[1] + 60000 * time;
    }
    else {
        addTime = player.宗门.time[1] + 60000 * time;
    }
    if (addTime > nowTime) {
        Send(Text('加入宗门不满' + `${time}分钟,无法退出`));
        return false;
    }
    if (player.宗门.职位 != '宗主') {
        let ass = data.getAssociation(player.宗门.宗门名称);
        ass[player.宗门.职位] = ass[player.宗门.职位].filter(item => item != usr_qq);
        ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq);
        data.setAssociation(ass.宗门名称, ass);
        delete player.宗门;
        data.setData('player', usr_qq, player);
        await player_efficiency(usr_qq);
        Send(Text('退出宗门成功'));
    }
    else {
        let ass = data.getAssociation(player.宗门.宗门名称);
        if (ass.所有成员.length < 2) {
            fs.rmSync(`${data.filePathMap.association}/${player.宗门.宗门名称}.json`);
            delete player.宗门;
            data.setData('player', usr_qq, player);
            await player_efficiency(usr_qq);
            Send(Text('退出宗门成功,退出后宗门空无一人。\n一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'));
        }
        else {
            ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq);
            delete player.宗门;
            data.setData('player', usr_qq, player);
            await player_efficiency(usr_qq);
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
            let randmember = await data.getData('player', randmember_qq);
            ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(item => item != randmember_qq);
            ass['宗主'] = randmember_qq;
            randmember.宗门.职位 = '宗主';
            data.setData('player', randmember_qq, randmember);
            data.setData('player', usr_qq, player);
            data.setAssociation(ass.宗门名称, ass);
            Send(Text(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`));
        }
    }
    player.favorability = 0;
    data.setData('player', usr_qq, player);
});

export { res as default, name, regular, selects };
