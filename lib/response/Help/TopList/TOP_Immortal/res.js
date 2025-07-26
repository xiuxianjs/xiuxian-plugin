import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import '../../../../model/Config.js';
import 'path';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, readPlayer, sortBy } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?封神榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let msg = ['___[封神榜]___'];
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
        let player = await readPlayer(player_id);
        let power = player.攻击 * 0.9 +
            player.防御 * 1.1 +
            player.血量上限 * 0.6 +
            player.暴击率 * player.攻击 * 0.5;
        if (player.level_id < 42) {
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
