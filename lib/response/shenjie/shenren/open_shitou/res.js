import { useSend, Text } from 'alemonjs';
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
import { existplayer, exist_najie_thing, Add_najie_thing } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)敲开闪闪发光的石头$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let x = await exist_najie_thing(usr_qq, '闪闪发光的石头', '道具');
    if (!x) {
        Send(Text('你没有闪闪发光的石头'));
        return false;
    }
    await Add_najie_thing(usr_qq, '闪闪发光的石头', '道具', -1);
    let random = Math.random();
    let thing;
    if (random < 0.5) {
        thing = '神石';
    }
    else {
        thing = '魔石';
    }
    Send(Text('你打开了石头,获得了' + thing + 'x2'));
    await Add_najie_thing(usr_qq, thing, '道具', 2);
});

export { res as default, regular, selects };
