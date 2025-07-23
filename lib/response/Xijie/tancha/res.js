import { useSend, Text, Image } from 'alemonjs';
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
import { existplayer, Read_shop, Write_shop, Read_player, Add_灵石 as Add___, existshop } from '../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../index.js';
import puppeteer from '../../../image/index.js';

const regular = /^(#|＃|\/)?探查.*$/;
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
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = Math.floor((action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let didian = e.MessageText.replace(/^(#|＃|\/)?探查/, '');
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
    let player = await Read_player(usr_qq);
    let Price = shop[i].price * 0.3;
    if (player.灵石 < Price) {
        Send(Text('你需要更多的灵石去打探消息'));
        return false;
    }
    await Add___(usr_qq, -Price);
    let thing = await existshop(didian);
    let level = shop[i].Grade;
    let state = shop[i].state;
    switch (level) {
        case 1:
            level = '松懈';
            break;
        case 2:
            level = '戒备';
            break;
        case 3:
            level = '恐慌';
            break;
    }
    switch (state) {
        case 0:
            state = '营业';
            break;
        case 1:
            state = '打烊';
            break;
    }
    let didian_data = { name: shop[i].name, level, state, thing };
    let img = await puppeteer.screenshot('shop', e.UserId, didian_data);
    if (img)
        Send(Image(img));
    return false;
});

export { res as default, regular };
