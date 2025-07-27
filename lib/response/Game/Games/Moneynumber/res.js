import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { Go } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import '../game.js';

const regular = /^(#|＃|\/)?金银坊$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let gameswitch = cf.switch.Moneynumber;
    if (gameswitch != true)
        return false;
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag)
        return false;
    let player = await data.getData('player', usr_qq);
    let now_time = new Date().getTime();
    let money = 10000;
    if (player.灵石 < money) {
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
        await redis.del('xiuxian@1.3.0:' + usr_qq + ':game_action');
        global.yazhu[usr_qq] = 0;
        clearTimeout(global.gametime[usr_qq]);
        Send(Text('媚娘：钱不够也想玩？'));
        return false;
    }
    let last_game_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_game_time');
    last_game_time = parseInt(last_game_time);
    const transferTimeout = 30 * 1000;
    if (now_time < last_game_time + transferTimeout) {
        const left = last_game_time + transferTimeout - now_time;
        const game_s = Math.ceil(left / 1000);
        Send(Text(`每30秒游玩一次。\ncd: ${game_s}秒`));
        return false;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 1) {
        Send(Text(`媚娘：猜大小正在进行哦!`));
        return false;
    }
    Send(Text(`媚娘：发送[#投入+数字]或[#梭哈]`));
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1);
    return false;
});

export { res as default, regular };
