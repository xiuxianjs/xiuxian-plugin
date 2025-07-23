import { useSend, Text, Image } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
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
