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
import { existplayer, Read_player } from '../../../../model/xiuxian.js';
import '../game.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)(梭哈)|(投入.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let now_time = new Date().getTime();
    let ifexistplay = await existplayer(usr_qq);
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (!ifexistplay || +game_action == 1) {
        return false;
    }
    let es = e.MessageText.replace('#投入', '').trim();
    if (es == '#梭哈') {
        let player = await Read_player(usr_qq);
        global.yazhu[usr_qq] = player.灵石 - 1;
        Send(Text('媚娘：梭哈完成,发送[大]或[小]'));
        return false;
    }
    if (parseInt(es) == parseInt(es)) {
        let player = await Read_player(usr_qq);
        if (player.灵石 >= parseInt(es)) {
            global.yazhu[usr_qq] = parseInt(es);
            let money = 10000;
            if (global.yazhu[usr_qq] >= money) {
                global.gane_key_user[usr_qq];
                Send(Text('媚娘：投入完成,发送[大]或[小]'));
                return false;
            }
            else {
                await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
                await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1);
                global.yazhu[usr_qq] = 0;
                clearTimeout(global.gametime[usr_qq]);
                Send(Text('媚娘：钱不够也想玩？'));
                return false;
            }
        }
    }
});

export { res as default, regular, selects };
