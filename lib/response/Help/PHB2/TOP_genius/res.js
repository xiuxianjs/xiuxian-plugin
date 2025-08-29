import { useSend, Image, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { sortBy } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?神魄榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const temp = [];
    const playerList = await keysByPath(__PATH.player_path);
    let i = 0;
    for (const playerId of playerList) {
        const player = await readPlayer(playerId);
        let power = player.神魄段数;
        power = Math.trunc(power);
        temp[i] = {
            power: power,
            qq: playerId,
            name: player.名号,
            level_id: player.level_id
        };
        i++;
    }
    temp.sort(sortBy('power'));
    const top = temp.slice(0, 10);
    const image = await screenshot('immortal_genius', userId, {
        allplayer: top,
        title: '神魄榜',
        label: '神魄段数'
    });
    if (Buffer.isBuffer(image)) {
        void Send(Image(image));
        return;
    }
    void Send(Text('图片生产失败'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
