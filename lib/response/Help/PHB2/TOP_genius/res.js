import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { redis } from '../../../../api/api.js';
import { existplayer, readPlayer, sortBy } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?神魄榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let msg = ['___[神魄榜]___'];
    let temp = [];
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    let i = 0;
    for (let player_id of playerList) {
        let player = await readPlayer(player_id);
        let power = player.神魄段数;
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
            '\n神魄段数：' +
            temp[j].power +
            '\nQQ:' +
            temp[j].qq);
    }
    Send(Text(msg.join('\n')));
});

export { res as default, regular };
