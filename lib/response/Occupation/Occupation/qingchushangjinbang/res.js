import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { redis } from '../../../../api/api.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?清空赏金榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let action = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing');
    action = await JSON.parse(action);
    action = null;
    Send(Text('清除完成'));
    await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action));
});

export { res as default, regular };
