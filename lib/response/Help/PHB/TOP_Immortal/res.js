import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import '../../../../model/Config.js';
import 'path';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player, sortBy } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?魔道榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let msg = ['___[魔道榜]___'];
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
        let power = player.魔道值;
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
    if (temp.length > 20) {
        length = 20;
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
            '\n魔道值：' +
            temp[j].power +
            '\nQQ:' +
            temp[j].qq);
    }
    Send(Text(msg.join('\n')));
});

export { res as default, regular };
