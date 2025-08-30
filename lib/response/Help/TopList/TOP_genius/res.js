import { useSend, Image, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import { screenshot } from '../../../../image/index.js';
import 'svg-captcha';
import 'sharp';
import { sortBy } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import 'crypto';
import 'lodash-es';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?至尊榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const temp = [];
    const playerList = await keysByPath(__PATH.player_path);
    for (const file of playerList) {
        const player = await readPlayer(file);
        if (player.level_id >= 42) {
            continue;
        }
        const power = Math.trunc((player.攻击 + player.防御 * 0.8 + player.血量上限 * 0.6) * (player.暴击率 + 1));
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
    const image = await screenshot('immortal_genius', userId, {
        allplayer: top,
        title: '至尊榜',
        label: '战力'
    });
    if (Buffer.isBuffer(image)) {
        void Send(Image(image));
        return;
    }
    void Send(Text('图片生产失败'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
