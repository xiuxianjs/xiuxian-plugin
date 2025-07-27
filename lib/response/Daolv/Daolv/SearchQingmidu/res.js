import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { redis } from '../../../../api/api.js';
import { findQinmidu, sleep } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?查询亲密度$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let A = e.UserId;
    let flag = 0;
    let msg = [];
    msg.push(`\n-----qq----- -亲密度-`);
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (let i = 0; i < playerList.length; i++) {
        let B = playerList[i];
        if (A == B) {
            continue;
        }
        let pd = await findQinmidu(A, B);
        if (pd == false) {
            continue;
        }
        flag++;
        msg.push(`\n${B}\t ${pd}`);
    }
    if (flag == 0) {
        Send(Text(`其实一个人也不错的`));
    }
    else {
        for (let i = 0; i < msg.length; i += 8) {
            Send(Text(msg.slice(i, i + 8).join('')));
            await sleep(500);
        }
    }
});

export { res as default, regular };
