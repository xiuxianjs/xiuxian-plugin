import { useSend, Image, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import { sortBy } from '../../../../model/cultivation.js';
import 'dayjs';
import { redis } from '../../../../model/api.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?至尊榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const temp = [];
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (const file of playerList) {
        const player = await readPlayer(file);
        if (player.level_id >= 42) {
            continue;
        }
        const power = Math.trunc((player.攻击 + player.防御 * 0.8 + player.血量上限 * 0.6) *
            (player.暴击率 + 1));
        temp.push({
            power: power,
            qq: file,
            name: player.名号,
            level_id: player.level_id,
            灵石: player.灵石
        });
    }
    temp.sort(sortBy('power'));
    const top = temp.slice(0, 10);
    const image = await screenshot('immortal_genius', usr_qq, {
        allplayer: top,
        title: '至尊榜'
    });
    if (Buffer.isBuffer(image)) {
        Send(Image(image));
        return;
    }
    Send(Text('图片生产失败'));
});

export { res as default, regular };
