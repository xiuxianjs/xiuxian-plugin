import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import '@alemonjs/db';
import { shijianc } from '../../../../model/common.js';
import { existplayer, readPlayer, readNajie, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import '../../../../resources/html/monthCard.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { showPlayer } from '../user.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?(改名|设置道宣).*$/;
const regularCut = /^(#|＃|\/)?(改名|设置道宣)/;
function getDayStruct(ts) {
    const n = Number(ts);
    if (!Number.isFinite(n) || n <= 0) {
        return null;
    }
    try {
        return shijianc(n);
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
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const isRename = /改名/.test(e.MessageText);
    const raw = cleanInput(e.MessageText);
    if (isRename) {
        if (raw.length === 0) {
            void Send(Text('改名格式为:【#改名张三】请输入正确名字'));
            return false;
        }
        if (raw.length > 8) {
            void Send(Text('玩家名字最多八字'));
            return false;
        }
        const now = Date.now();
        shijianc(now);
        const lastKey = getRedisKey(userId, 'last_setname_time');
        const lastRaw = await redis.get(lastKey);
        getDayStruct(lastRaw);
        const player = await readPlayer(userId);
        if (!player) {
            void Send(Text('玩家数据异常'));
            return false;
        }
        const najie = await readNajie(userId);
        if (!najie?.道具 || najie.道具.length === 0) {
            void Send(Text('你没有更名卡'));
            return false;
        }
        if (najie?.道具 && najie?.道具?.length > 0) {
            const item = najie.道具.find(i => i.name === '更名卡');
            if (!item) {
                void Send(Text('你没有更名卡'));
                return false;
            }
        }
        await addNajieThing(userId, '更名卡', '道具', -1);
        const cost = 1000;
        if (typeof player.灵石 !== 'number' || player.灵石 < cost) {
            void Send(Text(`改名需要${cost}灵石`));
            return false;
        }
        player.名号 = raw;
        player.灵石 -= cost;
        await writePlayer(userId, player);
        await redis.set(lastKey, String(now));
        if (isMessageEvent(e)) {
            void showPlayer(e);
        }
        return false;
    }
    if (raw.length === 0) {
        return false;
    }
    if (raw.length > 50) {
        void Send(Text('道宣最多50字符'));
        return false;
    }
    const now = Date.now();
    const today = shijianc(now);
    const lastKey = getRedisKey(userId, 'last_setxuanyan_time');
    const lastRaw = await redis.get(lastKey);
    const lastStruct = getDayStruct(lastRaw);
    if (sameDay(today, lastStruct)) {
        void Send(Text('每日仅可更改一次'));
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据异常'));
        return false;
    }
    player.宣言 = raw;
    await writePlayer(userId, player);
    await redis.set(lastKey, String(now));
    if (isMessageEvent(e)) {
        void showPlayer(e);
    }
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
