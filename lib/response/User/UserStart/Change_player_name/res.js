import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import { existplayer, shijianc, readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { Show_player } from '../user.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(改名|设置道宣).*$/;
const regularCut = /^(#|＃|\/)?(改名|设置道宣)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return;
    if (/改名/.test(e.MessageText)) {
        let new_name = e.MessageText.replace(regularCut, '');
        new_name = new_name.replace(' ', '');
        new_name = new_name.replace('+', '');
        if (new_name.length == 0) {
            Send(Text('改名格式为:【#改名张三】请输入正确名字'));
            return;
        }
        else if (new_name.length > 8) {
            Send(Text('玩家名字最多八字'));
            return;
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
            return;
        }
        player = await readPlayer(usr_qq);
        if (player.灵石 < 1000) {
            Send(Text('改名需要1000灵石'));
            return;
        }
        player.名号 = new_name;
        redis.set('xiuxian@1.3.0:' + usr_qq + ':last_setname_time', nowTime);
        player.灵石 -= 1000;
        await writePlayer(usr_qq, player);
        Show_player(e);
        return;
    }
    else {
        let new_msg = e.MessageText.replace(regularCut, '');
        new_msg = new_msg.replace(' ', '');
        new_msg = new_msg.replace('+', '');
        if (new_msg.length == 0) {
            return;
        }
        else if (new_msg.length > 50) {
            Send(Text('道宣最多50字符'));
            return;
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
            return;
        }
        player = await readPlayer(usr_qq);
        player.宣言 = new_msg;
        redis.set('xiuxian@1.3.0:' + usr_qq + ':last_setxuanyan_time', nowTime);
        await writePlayer(usr_qq, player);
        Show_player(e);
        return;
    }
});

export { res as default, regular };
