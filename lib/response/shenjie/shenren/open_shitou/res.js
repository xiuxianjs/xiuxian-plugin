import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
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
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, exist_najie_thing, Add_najie_thing } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
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

export { res as default, name, regular, selects };
