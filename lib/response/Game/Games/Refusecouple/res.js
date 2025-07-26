import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?拒绝双修$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let player = await readPlayer(usr_qq);
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':couple', 1);
    Send(Text(player.名号 + '开启了拒绝模式'));
});

export { res as default, regular };
