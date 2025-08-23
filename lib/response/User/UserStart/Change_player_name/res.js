import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { shijianc } from '../../../../model/common.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
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
import { Show_player } from '../user.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?(改名|设置道宣).*$/;
const regularCut = /^(#|＃|\/)?(改名|设置道宣)/;
async function getDayStruct(ts) {
    const n = Number(ts);
    if (!Number.isFinite(n) || n <= 0)
        return null;
    try {
        return (await shijianc(n));
    }
    catch {
        return null;
    }
}
function sameDay(a, b) {
    return !!a && !!b && a.Y === b.Y && a.M === b.M && a.D === b.D;
}
function cleanInput(raw) {
    return raw.replace(regularCut, '').replace(/\s+/g, '').replace(/\+/g, '');
}
function isMessageEvent(ev) {
    return !!ev && typeof ev === 'object' && 'MessageText' in ev;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const isRename = /改名/.test(e.MessageText);
    const raw = cleanInput(e.MessageText);
    if (isRename) {
        if (raw.length === 0) {
            Send(Text('改名格式为:【#改名张三】请输入正确名字'));
            return false;
        }
        if (raw.length > 8) {
            Send(Text('玩家名字最多八字'));
            return false;
        }
        const now = Date.now();
        const today = (await shijianc(now));
        const lastKey = getRedisKey(usr_qq, 'last_setname_time');
        const lastRaw = await redis.get(lastKey);
        const lastStruct = await getDayStruct(lastRaw);
        if (sameDay(today, lastStruct)) {
            Send(Text('每日只能改名一次'));
            return false;
        }
        const player = (await readPlayer(usr_qq));
        if (!player) {
            Send(Text('玩家数据异常'));
            return false;
        }
        const cost = 1000;
        if (typeof player.灵石 !== 'number' || player.灵石 < cost) {
            Send(Text(`改名需要${cost}灵石`));
            return false;
        }
        player.名号 = raw;
        player.灵石 -= cost;
        await writePlayer(usr_qq, player);
        await redis.set(lastKey, String(now));
        if (isMessageEvent(e))
            Show_player(e);
        return false;
    }
    if (raw.length === 0)
        return false;
    if (raw.length > 50) {
        Send(Text('道宣最多50字符'));
        return false;
    }
    const now = Date.now();
    const today = (await shijianc(now));
    const lastKey = getRedisKey(usr_qq, 'last_setxuanyan_time');
    const lastRaw = await redis.get(lastKey);
    const lastStruct = await getDayStruct(lastRaw);
    if (sameDay(today, lastStruct)) {
        Send(Text('每日仅可更改一次'));
        return false;
    }
    const player = (await readPlayer(usr_qq));
    if (!player) {
        Send(Text('玩家数据异常'));
        return false;
    }
    player.宣言 = raw;
    await writePlayer(usr_qq, player);
    await redis.set(lastKey, String(now));
    if (isMessageEvent(e))
        Show_player(e);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
