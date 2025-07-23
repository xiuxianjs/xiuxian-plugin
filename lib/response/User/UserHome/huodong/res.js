import { useSend, Text } from 'alemonjs';
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
import data from '../../../../model/XiuxianData.js';
import { existplayer, Add_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?活动兑换.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let name = e.MessageText.replace(/^(#|＃|\/)?活动兑换/, '');
    name = name.trim();
    let i;
    for (i = 0; i < data.duihuan.length; i++) {
        if (data.duihuan[i].name == name) {
            break;
        }
    }
    if (i == data.duihuan.length) {
        Send(Text('兑换码不存在!'));
        return false;
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':duihuan');
    action = await JSON.parse(action);
    if (action == null) {
        action = [];
    }
    for (let k = 0; k < action.length; k++) {
        if (action[k] == name) {
            Send(Text('你已经兑换过该兑换码了'));
            return false;
        }
    }
    action.push(name);
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':duihuan', JSON.stringify(action));
    let msg = [];
    for (let k = 0; k < data.duihuan[i].thing.length; k++) {
        await Add_najie_thing(usr_qq, data.duihuan[i].thing[k].name, data.duihuan[i].thing[k].class, data.duihuan[i].thing[k].数量);
        msg.push('\n' + data.duihuan[i].thing[k].name + 'x' + data.duihuan[i].thing[k].数量);
    }
    Send(Text('恭喜获得:' + msg));
});

export { res as default, regular };
