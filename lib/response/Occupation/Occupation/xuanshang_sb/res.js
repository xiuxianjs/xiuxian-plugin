import { useSend, Text } from 'alemonjs';
import { redis, pushInfo } from '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { existplayer, readPlayer, convert2integer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?悬赏.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await readPlayer(usr_qq);
    let qq = e.MessageText.replace(/^(#|＃|\/)?悬赏/, '');
    let code = qq.split('*');
    qq = code[0];
    let money = await convert2integer(code[1]);
    if (money < 300000) {
        money = 300000;
    }
    if (player.灵石 < money) {
        Send(Text('您手头这点灵石,似乎在说笑'));
        return false;
    }
    let player_B;
    try {
        player_B = await readPlayer(qq);
    }
    catch {
        Send(Text('世间没有这人'));
        return false;
    }
    let arr = { 名号: player_B.名号, QQ: qq, 赏金: money };
    let action = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing');
    action = await JSON.parse(action);
    if (action != null) {
        action.push(arr);
    }
    else {
        action = [];
        action.push(arr);
    }
    player.灵石 -= money;
    await writePlayer(usr_qq, player);
    Send(Text('悬赏成功!'));
    let msg = '';
    msg += '【全服公告】' + player_B.名号 + '被悬赏了' + money + '灵石';
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const groupList = await redis.smembers(redisGlKey);
    for (const group of groupList) {
        pushInfo(group, true, msg);
    }
    await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action));
});

export { res as default, regular };
