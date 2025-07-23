import { useSend, useMention, Text } from 'alemonjs';
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

const regular = /^(#|＃|\/)?解封.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        const Mentions = (await useMention(e)[0].findOne()).data;
        if (!Mentions || Mentions.length === 0) {
            return;
        }
        const User = Mentions.find(item => !item.IsBot);
        if (!User) {
            return;
        }
        let qq = User.UserId;
        let ifexistplay = await existplayer(qq);
        if (!ifexistplay)
            return false;
        await redis.set('xiuxian@1.3.0:' + qq + ':game_action', 1);
        let action = await redis.get('xiuxian@1.3.0:' + qq + ':action');
        if (action) {
            let arr = JSON.parse(action);
            arr.is_jiesuan = 1;
            arr.shutup = 1;
            arr.working = 1;
            arr.power_up = 1;
            arr.Place_action = 1;
            arr.Place_actionplus = 1;
            arr.end_time = new Date().getTime();
            delete arr.group_id;
            await redis.set('xiuxian@1.3.0:' + qq + ':action', JSON.stringify(arr));
            Send(Text('已解除！'));
            return false;
        }
        Send(Text('不需要解除！'));
        return false;
    }
});

export { res as default, regular };
