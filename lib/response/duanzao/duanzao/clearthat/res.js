import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import { looktripod, readTripod, writeDuanlu } from '../../../../model/duanzaofu.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?清空锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A == 1) {
        let newtripod = await readTripod();
        for (let item of newtripod) {
            if (user_qq == item.qq) {
                item.材料 = [];
                item.数量 = [];
                item.TIME = 0;
                item.时长 = 30000;
                item.状态 = 0;
                item.预计时长 = 0;
                await writeDuanlu(newtripod);
                let action = null;
                await redis.set('xiuxian@1.3.0:' + user_qq + ':action10', JSON.stringify(action));
                Send(Text('材料成功清除'));
                return false;
            }
        }
    }
});

export { res as default, regular };
