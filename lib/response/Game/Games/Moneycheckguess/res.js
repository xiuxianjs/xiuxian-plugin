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
import { existplayer, readPlayer, isNotNull, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import '../game.js';

const regular = /^(#|＃|\/)?^(大|小)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let now_time = new Date().getTime();
    let ifexistplay = await existplayer(usr_qq);
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (!ifexistplay || +game_action == 1) {
        return false;
    }
    if (isNaN(global.yazhu[usr_qq])) {
        return false;
    }
    if (!global.gane_key_user[usr_qq]) {
        Send(Text('媚娘：公子，你还没投入呢'));
        return false;
    }
    let player = await readPlayer(usr_qq);
    let es = e.MessageText;
    let randtime = Math.trunc(Math.random() * 6) + 1;
    let touzi;
    let n;
    for (n = 1; n <= randtime; n++) {
        touzi = n;
    }
    Send(Text(touzi));
    const cf = config.getConfig('xiuxian', 'xiuxian');
    if ((es == '大' && touzi > 3) || (es == '小' && touzi < 4)) {
        let x = cf.percentage.Moneynumber;
        let y = 1;
        let z = cf.size.Money * 10000;
        if (global.yazhu[usr_qq] >= z) {
            x = cf.percentage.punishment;
            y = 0;
        }
        global.yazhu[usr_qq] = Math.trunc(global.yazhu[usr_qq] * x);
        if (isNotNull(player.金银坊胜场)) {
            player.金银坊胜场 = parseInt(player.金银坊胜场) + 1;
            player.金银坊收入 =
                parseInt(player.金银坊收入) + parseInt(global.yazhu[usr_qq]);
        }
        else {
            player.金银坊胜场 = 1;
            player.金银坊收入 = parseInt(global.yazhu[usr_qq]);
        }
        data.setData('player', usr_qq, player);
        Add___(usr_qq, global.yazhu[usr_qq]);
        if (y == 1) {
            Send(Text(`骰子最终为 ${touzi} 你猜对了！` +
                '\n' +
                `现在拥有灵石:${player.灵石 + global.yazhu[usr_qq]}`));
        }
        else {
            Send(Text([
                `骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。`,
                '\n',
                `现在拥有灵石:${player.灵石 + global.yazhu[usr_qq]}`
            ].join('')));
        }
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1);
        global.yazhu[usr_qq] = 0;
        clearTimeout(global.gametime[usr_qq]);
        return false;
    }
    else if ((es == '大' && touzi < 4) || (es == '小' && touzi > 3)) {
        if (isNotNull(player.金银坊败场)) {
            player.金银坊败场 = parseInt(player.金银坊败场) + 1;
            player.金银坊支出 =
                parseInt(player.金银坊支出) + parseInt(global.yazhu[usr_qq]);
        }
        else {
            player.金银坊败场 = 1;
            player.金银坊支出 = parseInt(global.yazhu[usr_qq]);
        }
        data.setData('player', usr_qq, player);
        Add___(usr_qq, -global.yazhu[usr_qq]);
        let msg = [
            `骰子最终为 ${touzi} 你猜错了！`,
            '\n',
            `现在拥有灵石:${player.灵石 - global.yazhu[usr_qq]}`
        ];
        let now_money = player.灵石 - global.yazhu[usr_qq];
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1);
        global.yazhu[usr_qq] = 0;
        clearTimeout(global.gametime[usr_qq]);
        if (now_money <= 0) {
            msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！');
        }
        Send(Text(msg.join('')));
        return false;
    }
});

export { res as default, regular };
