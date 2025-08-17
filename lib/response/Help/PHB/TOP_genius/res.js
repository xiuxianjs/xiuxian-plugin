import { useSend, Image, Text } from 'alemonjs';
import { __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import { sortBy } from '../../../../model/cultivation.js';
import { redis } from '../../../../model/api.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?强化榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    const temp = [];
    let i = 0;
    for (const player_id of playerList) {
        const player = await readPlayer(player_id);
        let power = player.攻击加成 + player.防御加成 + player.生命加成;
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
    const top = temp.slice(0, 10);
    const image = await screenshot('immortal_genius', usr_qq, {
        allplayer: top,
        title: '强化榜',
        label: '强化'
    });
    if (Buffer.isBuffer(image)) {
        Send(Image(image));
        return;
    }
    Send(Text('图片生产失败'));
    return;
});

export { res as default, regular };
