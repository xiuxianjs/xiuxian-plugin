import { useSend, Text, Image } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?悬赏目标$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await readPlayer(usr_qq);
    if (player.occupation != '侠客') {
        Send(Text('只有专业的侠客才能获取悬赏'));
        return false;
    }
    let msg = [];
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':shangjing');
    action = await JSON.parse(action);
    const type = 0;
    if (action != null) {
        if (action.end_time > Date.now()) {
            msg = action.arm;
            const msg_data = { msg, type };
            const img = await screenshot('msg', e.UserId, msg_data);
            Send(Image(img));
            return false;
        }
    }
    const mubiao = [];
    let i = 0;
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (const this_qq of playerList) {
        const players = await readPlayer(this_qq);
        if (players.魔道值 > 999 && this_qq != usr_qq) {
            mubiao[i] = {
                名号: players.名号,
                赏金: Math.trunc((1000000 *
                    (1.2 + 0.05 * player.occupation_level) *
                    player.level_id *
                    player.Physique_id) /
                    42 /
                    42 /
                    4),
                QQ: this_qq
            };
            i++;
        }
    }
    while (i < 4) {
        mubiao[i] = {
            名号: 'DD大妖王',
            赏金: Math.trunc((1000000 *
                (1.2 + 0.05 * player.occupation_level) *
                player.level_id *
                player.Physique_id) /
                42 /
                42 /
                4),
            QQ: 1
        };
        i++;
    }
    for (let k = 0; k < 3; k++) {
        msg.push(mubiao[Math.trunc(Math.random() * i)]);
    }
    const arr = {
        arm: msg,
        end_time: Date.now() + 60000 * 60 * 20
    };
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':shangjing', JSON.stringify(arr));
    const msg_data = { msg, type };
    const img = await screenshot('msg', e.UserId, msg_data);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
