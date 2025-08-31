import { getRedisKey } from '../../../../model/keys.js';
import { useSend, Text } from 'alemonjs';
import { redis, pushInfo } from '../../../../model/api.js';
import '@alemonjs/db';
import { getAuctionKeyManager } from '../../../../model/auction.js';
import { zdBattle } from '../../../../model/battle.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
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
import '../../../../model/DataList.js';
import { existNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?刺杀目标.*$/;
function parseJson(raw) {
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const actionState = parseJson(await redis.get(getRedisKey(userId, 'action')));
    if (actionState) {
        const now = Date.now();
        if (now <= actionState.end_time) {
            const remain = actionState.end_time - now;
            const m = Math.floor(remain / 60000);
            const s = Math.floor((remain % 60000) / 1000);
            void Send(Text(`正在${actionState.action}中,剩余时间:${m}分${s}秒`));
            return false;
        }
    }
    const pool = parseJson(await redis.get(getRedisKey('1', 'shangjing')));
    if (!pool || pool.length === 0) {
        void Send(Text('暂无刺杀目标'));
        return false;
    }
    const idxRaw = e.MessageText.replace(/^(#|＃|\/)?刺杀目标/, '').trim();
    const idx = parseInt(idxRaw, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= pool.length) {
        void Send(Text('不要伤及无辜'));
        return false;
    }
    const target = pool[idx];
    const qq = target.QQ;
    if (qq === userId) {
        void Send(Text('咋的，自己干自己？'));
        return false;
    }
    const player = await readPlayer(userId);
    const player_B = await readPlayer(String(qq));
    if (player_B.当前血量 === 0) {
        void Send(Text('对方已经没有血了,请等一段时间再刺杀他吧'));
        return false;
    }
    const targetAction = parseJson(await redis.get(getRedisKey(String(qq), 'action')));
    if (targetAction) {
        const now = Date.now();
        if (now <= targetAction.end_time) {
            const hasYinshen = await existNajieThing(userId, '隐身水', '道具');
            if (!hasYinshen) {
                const remain = targetAction.end_time - now;
                const m = Math.floor(remain / 60000);
                const s = Math.floor((remain % 60000) / 1000);
                void Send(Text(`对方正在${targetAction.action}中,剩余时间:${m}分${s}秒`));
                return false;
            }
        }
    }
    const buff = player.occupation === '侠客' ? 1 + (player.occupation_level || 0) * 0.055 : 1;
    const fqA = typeof player.灵根.法球倍率 === 'number' ? player.灵根.法球倍率 : parseFloat(String(player.灵根.法球倍率)) || 0;
    const fqB = typeof player_B.灵根.法球倍率 === 'number' ? player_B.灵根.法球倍率 : parseFloat(String(player_B.灵根.法球倍率)) || 0;
    const player_A = {
        id: player.id,
        名号: player.名号,
        攻击: Math.floor(player.攻击 * buff),
        防御: Math.floor(player.防御),
        当前血量: Math.floor(player.血量上限),
        暴击率: player.暴击率,
        学习的功法: player.学习的功法,
        灵根: { ...player.灵根, 法球倍率: fqA },
        魔道值: player.魔道值 || 0,
        神石: player.神石 || 0,
        法球倍率: fqA,
        仙宠: player.仙宠
    };
    const player_B_entity = {
        id: player_B.id,
        名号: player_B.名号,
        攻击: player_B.攻击,
        防御: player_B.防御,
        当前血量: player_B.血量上限,
        暴击率: player_B.暴击率,
        学习的功法: player_B.学习的功法,
        灵根: { ...player_B.灵根, 法球倍率: fqB },
        魔道值: player_B.魔道值 || 0,
        神石: player_B.神石 || 0,
        法球倍率: fqB,
        仙宠: player_B.仙宠
    };
    const dataBattle = await zdBattle(player_A, player_B_entity);
    const msg = dataBattle.msg || [];
    const winA = `${player_A.名号}击败了${player_B.名号}`;
    const winB = `${player_B.名号}击败了${player_A.名号}`;
    let broadcast = '';
    if (msg.includes(winA)) {
        player_B.当前血量 = 0;
        player_B.修为 -= target.赏金;
        await writePlayer(String(qq), player_B);
        player.灵石 += Math.trunc(target.赏金 * 0.3);
        await writePlayer(userId, player);
        broadcast = `【全服公告】${player_B.名号}被${player.名号}悄无声息的刺杀了`;
        pool.splice(idx, 1);
        await redis.set(getRedisKey('1', 'shangjing'), JSON.stringify(pool));
    }
    else if (msg.includes(winB)) {
        player.当前血量 = 0;
        await writePlayer(userId, player);
        broadcast = `【全服公告】${player.名号}刺杀失败,${player_B.名号}勃然大怒,单手就反杀了${player.名号}`;
    }
    if (msg.length > 100) ;
    else {
        void Send(Text(msg.join('\n')));
    }
    if (broadcast) {
        const auctionKeyManager = getAuctionKeyManager();
        const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
        const groupList = await redis.smembers(groupListKey);
        for (const group of groupList) {
            pushInfo(group, true, broadcast);
        }
    }
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
