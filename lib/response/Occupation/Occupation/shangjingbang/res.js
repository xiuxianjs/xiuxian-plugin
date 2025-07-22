import { useSend, Text, Image } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import Game from '../../../../model/show.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian.js';
import puppeteer from '../../../../image/index.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)赏金榜$/;
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
    const data1 = await new Game().get_msg(msg_data);
    let img = await puppeteer.screenshot('msg', e.UserId, { ...data1 });
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
