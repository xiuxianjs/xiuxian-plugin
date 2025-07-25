import { useMessage, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import '../game.js';

const regular = /^(#|＃|\/)?(梭哈)|(投入.*)$/;
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    let usr_qq = e.UserId;
    let now_time = new Date().getTime();
    let ifexistplay = await existplayer(usr_qq);
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (!ifexistplay || game_action == 1) {
        return false;
    }
    const num = e.MessageText.replace(/#|＃|\/|梭哈|投入/g, '');
    if (e.MessageText.includes('梭哈')) {
        let player = await Read_player(usr_qq);
        global.yazhu[usr_qq] = player.灵石 - 1;
        global.gane_key_user[usr_qq] = true;
        message.send(format(Text('媚娘：梭哈完成,发送[大]或[小]')));
        return false;
    }
    if (parseInt(num) == parseInt(num)) {
        let player = await Read_player(usr_qq);
        if (player.灵石 >= parseInt(num)) {
            global.yazhu[usr_qq] = parseInt(num);
            let money = 10000;
            if (global.yazhu[usr_qq] >= money) {
                global.gane_key_user[usr_qq] = true;
                message.send(format(Text('媚娘：投入完成,发送[大]或[小]')));
                return;
            }
            else {
                await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
                await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1);
                global.yazhu[usr_qq] = 0;
                clearTimeout(global.gametime[usr_qq]);
                message.send(format(Text('媚娘：钱不够也想玩？')));
                return;
            }
        }
    }
});

export { res as default, regular };
