import { useMessage, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
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
import { existplayer, readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { game } from '../game.js';

const regular = /^(#|＃|\/)?((梭哈)|(投入\d+))$/;
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    let usr_qq = e.UserId;
    let now_time = new Date().getTime();
    let ifexistplay = await existplayer(usr_qq);
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (!ifexistplay || !game_action) {
        return false;
    }
    const num = e.MessageText.replace(/#|＃|\/|梭哈|投入/g, '');
    if (e.MessageText.includes('梭哈')) {
        let player = await readPlayer(usr_qq);
        game.yazhu[usr_qq] = player.灵石 - 1;
        game.game_key_user[usr_qq] = true;
        message.send(format(Text('媚娘：梭哈完成,发送[大|小|1-6]')));
        return false;
    }
    if (parseInt(num) <= 0 || isNaN(parseInt(num))) {
        message.send(format(Text('媚娘：请输入正确的投入金额')));
        return false;
    }
    let player = await readPlayer(usr_qq);
    if (player.灵石 >= parseInt(num)) {
        game.yazhu[usr_qq] = parseInt(num);
        let money = 10000;
        if (game.yazhu[usr_qq] >= money) {
            game.game_key_user[usr_qq] = true;
            message.send(format(Text('媚娘：投入完成,发送[大|小|1-6]')));
            return;
        }
        else {
            await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
            await redis.del('xiuxian@1.3.0:' + usr_qq + ':game_action');
            game.yazhu[usr_qq] = 0;
            clearTimeout(game.game_time[usr_qq]);
            message.send(format(Text('媚娘：钱不够也想玩？')));
            return;
        }
    }
});

export { res as default, regular };
