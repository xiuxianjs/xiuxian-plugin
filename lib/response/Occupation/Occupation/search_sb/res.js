import { useSend, Text, Image } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey, keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?悬赏目标$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (player.occupation != '侠客') {
        Send(Text('只有专业的侠客才能获取悬赏'));
        return false;
    }
    let msg = [];
    const db = await redis.get(getRedisKey(usr_qq, 'shangjing'));
    const action = await JSON.parse(db);
    const type = 0;
    if (action != null) {
        if (action.end_time > Date.now()) {
            msg = action.arm;
            const msg_data = { msg, type };
            const img = await screenshot('msg', e.UserId, msg_data);
            if (Buffer.isBuffer(img)) {
                Send(Image(img));
                return;
            }
            Send(Text('图片生产失败'));
            return false;
        }
    }
    const mubiao = [];
    let i = 0;
    const playerList = await keysByPath(__PATH.player_path);
    for (const this_qq of playerList) {
        const players = await readPlayer(this_qq);
        if (players.魔道值 > 999 && this_qq != usr_qq) {
            mubiao[i] = {
                名号: players.名号,
                赏金: Math.trunc((1000000
                    * (1.2 + 0.05 * player.occupation_level)
                    * player.level_id
                    * player.Physique_id)
                    / 42
                    / 42
                    / 4),
                QQ: this_qq
            };
            i++;
        }
    }
    while (i < 4) {
        mubiao[i] = {
            名号: 'DD大妖王',
            赏金: Math.trunc((1000000 * (1.2 + 0.05 * player.occupation_level) * player.level_id * player.Physique_id)
                / 42
                / 42
                / 4),
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
    await redis.set(getRedisKey(usr_qq, 'shangjing'), JSON.stringify(arr));
    const msg_data = { msg, type };
    const img = await screenshot('msg', e.UserId, msg_data);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
