import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
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
import { looktripod, Read_tripod, Write_duanlu } from '../../../../model/duanzaofu.js';
import { existplayer, Read_danyao, Write_danyao } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)开始炼制/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A != 1) {
        Send(Text(`请先去#炼器师能力评测,再来锻造吧`));
        return false;
    }
    let newtripod;
    try {
        newtripod = await Read_tripod();
    }
    catch {
        await Write_duanlu([]);
        newtripod = await Read_tripod();
    }
    for (let item of newtripod) {
        if (user_qq == item.qq) {
            if (item.材料.length == 0) {
                Send(Text(`炉子为空,无法炼制`));
                return false;
            }
            let action_res = await redis.get('xiuxian@1.3.0:' + user_qq + ':action10');
            const action = JSON.parse(action_res);
            if (action != null) {
                let action_end_time = action.end_time;
                let now_time = new Date().getTime();
                if (now_time <= action_end_time) {
                    let m = Math.floor((action_end_time - now_time) / 1000 / 60);
                    let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
                    Send(Text('正在' + action.action + '中，剩余时间:' + m + '分' + s + '秒'));
                    return false;
                }
            }
            item.状态 = 1;
            item.TIME = Date.now();
            await Write_duanlu(newtripod);
            let action_time = 180 * 60 * 1000;
            let arr = {
                action: '锻造',
                end_time: new Date().getTime() + action_time,
                time: action_time
            };
            let dy = await Read_danyao(user_qq);
            if (dy.xingyun >= 1) {
                dy.xingyun--;
                if (dy.xingyun == 0) {
                    dy.beiyong5 = 0;
                }
            }
            await Write_danyao(user_qq, dy);
            await redis.set('xiuxian@1.3.0:' + user_qq + ':action10', JSON.stringify(arr));
            Send(Text(`现在开始锻造武器,最少需锻造30分钟,高级装备需要更多温养时间`));
            return false;
        }
    }
});

export { res as default, name, regular, selects };
