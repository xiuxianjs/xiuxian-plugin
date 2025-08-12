import { useSend, Text } from 'alemonjs';
import { redis, pushInfo } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { convert2integer } from '../../../../model/utils/number.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/valuables.scss.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?悬赏.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据读取失败'));
        return false;
    }
    const rest = e.MessageText.replace(/^(#|＃|\/)?悬赏/, '').trim();
    if (!rest) {
        Send(Text('格式: 悬赏qq号*金额 (例:#悬赏123456*300000)'));
        return false;
    }
    const code = rest.split('*');
    const targetQQ = code[0].trim();
    if (!/^\d{5,}$/.test(targetQQ)) {
        Send(Text('目标QQ格式不正确'));
        return false;
    }
    let money = await convert2integer(code[1]);
    if (!Number.isFinite(money))
        money = 0;
    const MIN_BOUNTY = 300000;
    if (money < MIN_BOUNTY)
        money = MIN_BOUNTY;
    if (money > 1000000000)
        money = 1000000000;
    if ((player.灵石 || 0) < money) {
        Send(Text('您手头这点灵石,似乎在说笑'));
        return false;
    }
    if (!(await existplayer(targetQQ))) {
        Send(Text('世间没有这人'));
        return false;
    }
    const player_B = await readPlayer(targetQQ);
    if (!player_B) {
        Send(Text('查询目标玩家数据失败'));
        return false;
    }
    const bountyRecord = { 名号: player_B.名号, QQ: targetQQ, 赏金: money };
    const actionKey = 'xiuxian@1.3.0:1:shangjing';
    const raw = await redis.get(actionKey);
    let list = [];
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed))
                list = parsed.filter(v => v && typeof v === 'object');
        }
        catch {
            list = [];
        }
    }
    list.push(bountyRecord);
    player.灵石 = (player.灵石 || 0) - money;
    await writePlayer(usr_qq, player);
    await redis.set(actionKey, JSON.stringify(list));
    Send(Text('悬赏成功!'));
    const msg = `【全服公告】${player_B.名号}被悬赏了${money}灵石`;
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const groupList = await redis.smembers(redisGlKey);
    for (const group of groupList) {
        pushInfo(group, true, msg);
    }
    return false;
});

export { res as default, regular };
