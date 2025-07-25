import { useSend, Text, Image } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import puppeteer from '../../../../image/index.js';

const regular = /^(#|＃|\/)?赏金榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let action = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing');
    action = await JSON.parse(action);
    if (action == null) {
        Send(Text('悬赏已经被抢空了'));
        return false;
    }
    for (let i = 0; i < action.length - 1; i++) {
        let count = 0;
        for (let j = 0; j < action.length - i - 1; j++) {
            if (action[j].赏金 < action[j + 1].赏金) {
                let t;
                t = action[j];
                action[j] = action[j + 1];
                action[j + 1] = t;
                count = 1;
            }
        }
        if (count == 0)
            break;
    }
    await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action));
    let type = 1;
    let msg_data = { msg: action, type };
    let img = await puppeteer.screenshot('msg', e.UserId, msg_data);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
