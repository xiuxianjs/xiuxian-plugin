import { useSend, Text } from 'alemonjs';
import { redis } from '../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/namelist.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/version.yaml.js';
import '../../../config/xiuxian.yaml.js';
import 'path';
import '../../../model/paths.js';
import data from '../../../model/XiuxianData.js';
import { Write_player } from '../../../model/pub.js';
import { existplayer, shijianc, Read_shop, Write_shop, Read_player } from '../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)洗劫.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 0) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    let now_time = new Date().getTime();
    if (action != null) {
        let action_end_time = action.end_time;
        if (now_time <= action_end_time) {
            let m = Math.floor((action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let lastxijie_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastxijie_time');
    lastxijie_time = parseInt(lastxijie_time);
    if (now_time < lastxijie_time + 7200000) {
        let lastxijie_m = Math.trunc((lastxijie_time + 7200000 - now_time) / 60 / 1000);
        let lastxijie_s = Math.trunc(((lastxijie_time + 7200000 - now_time) % 60000) / 1000);
        Send(Text(`每120分钟洗劫一次，正在CD中，` +
            `剩余cd: ${lastxijie_m}分${lastxijie_s}秒`));
        return false;
    }
    let Today = await shijianc(now_time);
    if (Today.h > 19 && Today.h < 21) {
        Send(Text(`每日20-21点商店修整中,请过会再来`));
        return false;
    }
    let didian = e.MessageText.replace('#洗劫', '');
    didian = didian.trim();
    let shop;
    try {
        shop = await Read_shop();
    }
    catch {
        await Write_shop(data.shop_list);
        shop = await Read_shop();
    }
    let i;
    for (i = 0; i < shop.length; i++) {
        if (shop[i].name == didian) {
            break;
        }
    }
    if (i == shop.length) {
        return false;
    }
    if (shop[i].state == 1) {
        Send(Text(didian + '已经戒备森严了,还是不要硬闯好了'));
        return false;
    }
    let msg = '';
    let player = await Read_player(usr_qq);
    let Price = shop[i].price * shop[i].Grade;
    let buff = shop[i].Grade + 1;
    if (player.灵石 < Price) {
        Send(Text('灵石不足,无法进行强化'));
        return false;
    }
    else {
        player.灵石 -= Price;
        msg +=
            '你消费了' +
                Price +
                '灵石,防御力和生命值提高了' +
                Math.trunc((buff - buff / (1 + shop[i].Grade * 0.05)) * 100) +
                '%';
    }
    player.魔道值 += 25 * shop[i].Grade;
    await Write_player(usr_qq, player);
    shop[i].state = 1;
    await Write_shop(shop);
    if (player.灵根 == null || player.灵根 == undefined) {
        player.修炼效率提升 += 0;
    }
    let A_player = {
        名号: player.名号,
        攻击: parseInt(player.攻击),
        防御: Math.floor(player.防御 * buff),
        当前血量: Math.floor(player.血量上限 * buff),
        暴击率: player.暴击率,
        灵根: player.灵根,
        法球倍率: player.灵根.法球倍率,
        魔值: 0
    };
    if (player.魔道值 > 999) {
        A_player.魔值 = 1;
    }
    let time = 15;
    let action_time = 60000 * time;
    let arr = {
        action: '洗劫',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        shutup: '1',
        working: '1',
        Place_action: '1',
        mojie: '1',
        Place_actionplus: '1',
        power_up: '1',
        xijie: '0',
        plant: '1',
        mine: '1',
        Place_address: shop[i],
        A_player: A_player
    };
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastxijie_time', now_time);
    msg += '\n开始前往' + didian + ',祝你好运!';
    Send(Text(msg));
});

export { res as default, regular, selects };
