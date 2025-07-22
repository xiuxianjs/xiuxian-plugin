import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import { Go } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';
import '../game.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)金银坊$/;
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
    let player = data.getData('player', usr_qq);
    let now_time = new Date().getTime();
    let money = 10000;
    if (player.灵石 < money) {
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1);
        global.yazhu[usr_qq] = 0;
        clearTimeout(global.gametime[usr_qq]);
        Send(Text('媚娘：钱不够也想玩？'));
        return false;
    }
    let time = cf.CD.gambling;
    let last_game_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_game_time');
    last_game_time = parseInt(last_game_time);
    let transferTimeout = Math.floor(60000 * time);
    if (now_time < last_game_time + transferTimeout) {
        let game_m = Math.trunc((last_game_time + transferTimeout - now_time) / 60 / 1000);
        let game_s = Math.trunc(((last_game_time + transferTimeout - now_time) % 60000) / 1000);
        Send(Text(`每${transferTimeout / 1000 / 60}分钟游玩一次。` +
            `cd: ${game_m}分${game_s}秒`));
        return false;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time);
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 0) {
        Send(Text(`媚娘：猜大小正在进行哦!`));
        return false;
    }
    Send(Text(`媚娘：发送[#投入+数字]或[#梭哈]`));
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 0);
    return false;
});

export { res as default, name, regular, selects };
