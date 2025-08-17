import { useSend, Text, Image } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '@alemonjs/db';
import { getRedisKey } from '../../../../model/key.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import '../../../../model/settions.js';
import 'dayjs';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?赏金榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let action = await redis.get(getRedisKey('1', 'shangjing'));
    action = await JSON.parse(action);
    if (action == null) {
        Send(Text('悬赏已经被抢空了'));
        return false;
    }
    for (let i = 0; i < action.length - 1; i++) {
        let count = 0;
        for (let j = 0; j < action.length - i - 1; j++) {
            if (action[j].赏金 < action[j + 1].赏金) {
                const t = action[j];
                action[j] = action[j + 1];
                action[j + 1] = t;
                count = 1;
            }
        }
        if (count == 0)
            break;
    }
    await redis.set(getRedisKey('1', 'shangjing'), JSON.stringify(action));
    const type = 1;
    const msg_data = { msg: action, type };
    const img = await screenshot('msg', e.UserId, msg_data);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
