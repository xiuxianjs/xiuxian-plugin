import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import { selects } from '../../../index.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import 'lodash-es';
import '@alemonjs/db';
import 'dayjs';

const regular = /^(#|＃|\/)?修仙世界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    let num = [0, 0, 0, 0];
    for (let player_id of playerList) {
        let usr_qq = player_id;
        let player = await await data.getData('player', usr_qq);
        if (player.魔道值 > 999)
            num[3]++;
        else if ((player.lunhui > 0 || player.level_id > 41) && player.魔道值 < 1)
            num[0]++;
        else if (player.lunhui > 0 || player.level_id > 41)
            num[1]++;
        else
            num[2]++;
    }
    const n = num[0] + num[1] + num[2];
    let msg = '___[修仙世界]___' +
        '\n人数：' +
        n +
        '\n神人：' +
        num[0] +
        '\n仙人：' +
        num[1] +
        '\n凡人：' +
        num[2] +
        '\n魔头：' +
        num[3];
    Send(Text(msg));
});

export { res as default, regular };
