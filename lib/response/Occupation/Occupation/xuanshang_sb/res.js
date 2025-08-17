import { useSend, Text } from 'alemonjs';
import { redis, pushInfo } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import { KEY_AUCTION_GROUP_LIST } from '../../../../model/constants.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import '../../../../route/core/auth.js';
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
    const actionKey = getRedisKey('1', 'shangjing');
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
    const redisGlKey = KEY_AUCTION_GROUP_LIST;
    const groupList = await redis.smembers(redisGlKey);
    for (const group of groupList) {
        pushInfo(group, true, msg);
    }
    return false;
});

export { res as default, regular };
