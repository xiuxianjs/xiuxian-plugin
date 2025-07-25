import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { Go, existplayer, Read_player } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?转换副职$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    let action = await redis.get('xiuxian:player:' + usr_qq + ':fuzhi');
    action = await JSON.parse(action);
    if (action == null) {
        action = [];
        Send(Text(`您还没有副职哦`));
        return false;
    }
    let a, b, c;
    a = action.职业名;
    b = action.职业经验;
    c = action.职业等级;
    action.职业名 = player.occupation;
    action.职业经验 = player.occupation_exp;
    action.职业等级 = player.occupation_level;
    player.occupation = a;
    player.occupation_exp = b;
    player.occupation_level = c;
    await redis.set('xiuxian:player:' + usr_qq + ':fuzhi', JSON.stringify(action));
    await Write_player(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`));
});

export { res as default, regular };
