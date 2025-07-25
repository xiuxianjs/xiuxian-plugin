import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, Read_player } from '../../../../model/xiuxian.js';
import 'dayjs';
import { Read_tiandibang, Write_tiandibang } from '../tian.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?更新属性$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tiandibang;
    try {
        tiandibang = await Read_tiandibang();
    }
    catch {
        await Write_tiandibang([]);
        tiandibang = await Read_tiandibang();
    }
    let m = tiandibang.length;
    for (m = 0; m < tiandibang.length; m++) {
        if (tiandibang[m].qq == usr_qq) {
            break;
        }
    }
    if (m == tiandibang.length) {
        Send(Text('请先报名!'));
        return false;
    }
    let player = await Read_player(usr_qq);
    let level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    tiandibang[m].名号 = player.名号;
    tiandibang[m].境界 = level_id;
    tiandibang[m].攻击 = player.攻击;
    tiandibang[m].防御 = player.防御;
    tiandibang[m].当前血量 = player.血量上限;
    tiandibang[m].暴击率 = player.暴击率;
    tiandibang[m].学习的功法 = player.学习的功法;
    ((tiandibang[m].灵根 = player.灵根),
        (tiandibang[m].法球倍率 = player.灵根.法球倍率),
        Write_tiandibang(tiandibang));
    tiandibang = await Read_tiandibang();
    tiandibang[m].暴击率 = Math.trunc(tiandibang[m].暴击率 * 100);
    let msg = [];
    msg.push('名次：' +
        (m + 1) +
        '\n名号：' +
        tiandibang[m].名号 +
        '\n攻击：' +
        tiandibang[m].攻击 +
        '\n防御：' +
        tiandibang[m].防御 +
        '\n血量：' +
        tiandibang[m].当前血量 +
        '\n暴击：' +
        tiandibang[m].暴击率 +
        '%\n积分：' +
        tiandibang[m].积分);
    Send(Text(msg.join('')));
});

export { res as default, regular };
