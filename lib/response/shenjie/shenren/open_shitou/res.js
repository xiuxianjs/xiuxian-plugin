import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, exist_najie_thing, Add_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?敲开闪闪发光的石头$/;
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

export { res as default, regular };
