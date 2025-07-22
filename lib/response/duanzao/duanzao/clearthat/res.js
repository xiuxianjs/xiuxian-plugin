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
import { looktripod, Read_tripod, Write_duanlu } from '../../../../model/duanzaofu.js';
import { existplayer } from '../../../../model/xiuxian.js';
import '../../../../model/paths.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)清空锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A == 1) {
        let newtripod = await Read_tripod();
        for (let item of newtripod) {
            if (user_qq == item.qq) {
                item.材料 = [];
                item.数量 = [];
                item.TIME = 0;
                item.时长 = 30000;
                item.状态 = 0;
                item.预计时长 = 0;
                await Write_duanlu(newtripod);
                let action = null;
                await redis.set('xiuxian@1.3.0:' + user_qq + ':action10', JSON.stringify(action));
                Send(Text('材料成功清除'));
                return false;
            }
        }
    }
});

export { res as default, regular, selects };
