import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import 'yaml';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player, sortBy } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?至尊榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let msg = ['___[至尊榜]___'];
    let playerList = [];
    let temp = [];
    let files = fs
        .readdirSync(__PATH.player_path)
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    let i = 0;
    for (let player_id of playerList) {
        let player = await Read_player(player_id);
        let power = (player.攻击 + player.防御 * 0.8 + player.血量上限 * 0.6) *
            (player.暴击率 + 1);
        if (player.level_id >= 42) {
            continue;
        }
        power = Math.trunc(power);
        temp[i] = {
            power: power,
            qq: player_id,
            name: player.名号,
            level_id: player.level_id
        };
        i++;
    }
    temp.sort(sortBy('power'));
    logger.info(temp);
    let length;
    if (temp.length > 10) {
        length = 10;
    }
    else {
        length = temp.length;
    }
    let j;
    for (j = 0; j < length; j++) {
        msg.push('第' +
            (j + 1) +
            '名' +
            '\n道号：' +
            temp[j].name +
            '\n战力：' +
            temp[j].power +
            '\nQQ:' +
            temp[j].qq);
    }
    Send(Text(msg.join('\n')));
});

export { res as default, regular };
