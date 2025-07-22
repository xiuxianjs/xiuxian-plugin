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
import '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, shijianc, Read_player } from '../../../../model/xiuxian.js';
import { Show_player } from '../user.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)(改名.*)|(设置道宣.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let reg = new RegExp(/改名|设置道宣/);
    let func = reg.exec(e.MessageText)[0];
    if (func == '改名') {
        let new_name = e.MessageText.replace(/(#|\/)改名/, '');
        new_name = new_name.replace(' ', '');
        new_name = new_name.replace('+', '');
        if (new_name.length == 0) {
            Send(Text('改名格式为:【#改名张三】请输入正确名字'));
            return false;
        }
        else if (new_name.length > 8) {
            Send(Text('玩家名字最多八字'));
            return false;
        }
        let player = {};
        let now = new Date();
        let nowTime = now.getTime();
        let Today = await shijianc(nowTime);
        let lastsetname_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_setname_time');
        lastsetname_time = parseInt(lastsetname_time);
        lastsetname_time = await shijianc(lastsetname_time);
        if (Today.Y == lastsetname_time.Y &&
            Today.M == lastsetname_time.M &&
            Today.D == lastsetname_time.D) {
            Send(Text('每日只能改名一次'));
            return false;
        }
        player = await Read_player(usr_qq);
        if (player.灵石 < 1000) {
            Send(Text('改名需要1000灵石'));
            return false;
        }
        player.名号 = new_name;
        redis.set('xiuxian@1.3.0:' + usr_qq + ':last_setname_time', nowTime);
        player.灵石 -= 1000;
        await Write_player(usr_qq, player);
        Show_player(e);
        return false;
    }
    else if (func == '设置道宣') {
        let new_msg = e.MessageText.replace(/(#|\/)设置道宣/, '');
        new_msg = new_msg.replace(' ', '');
        new_msg = new_msg.replace('+', '');
        if (new_msg.length == 0) {
            return false;
        }
        else if (new_msg.length > 50) {
            Send(Text('道宣最多50字符'));
            return false;
        }
        let player = {};
        let now = new Date();
        let nowTime = now.getTime();
        let Today = await shijianc(nowTime);
        let lastsetxuanyan_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_setxuanyan_time');
        lastsetxuanyan_time = parseInt(lastsetxuanyan_time);
        lastsetxuanyan_time = await shijianc(lastsetxuanyan_time);
        if (Today.Y == lastsetxuanyan_time.Y &&
            Today.M == lastsetxuanyan_time.M &&
            Today.D == lastsetxuanyan_time.D) {
            Send(Text('每日仅可更改一次'));
            return false;
        }
        player = await Read_player(usr_qq);
        player.宣言 = new_msg;
        redis.set('xiuxian@1.3.0:' + usr_qq + ':last_setxuanyan_time', nowTime);
        await Write_player(usr_qq, player);
        Show_player(e);
        return false;
    }
});

export { res as default, regular, selects };
