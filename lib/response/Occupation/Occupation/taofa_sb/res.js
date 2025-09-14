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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/currency.js';
import { addExp4 } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?讨伐目标.*$/;
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
        const now_time = Date.now();
        const end = actionState.end_time;
        if (now_time <= end) {
            const remain = end - now_time;
            const m = Math.floor(remain / 60000);
            const s = Math.floor((remain % 60000) / 1000);
            void Send(Text(`正在${actionState.action}中,剩余时间:${m}分${s}秒`));
            return false;
        }
    }
    const player = await readPlayer(userId);
    if (player.occupation !== '侠客') {
        void Send(Text('侠客资质不足,需要进行训练'));
        return false;
    }
    const task = parseJson(await redis.get(getRedisKey(userId, 'shangjing')));
    if (!task) {
        void Send(Text('还没有接取到悬赏,请查看后再来吧'));
        return false;
    }
    if (task.arm.length === 0) {
        void Send(Text('每日限杀,请等待20小时后新的赏金目标'));
        return false;
    }
    const idxRaw = e.MessageText.replace(/^(#|＃|\/)?讨伐目标/, '').trim();
    const num = parseInt(idxRaw, 10) - 1;
    if (isNaN(num) || num < 0 || num >= task.arm.length) {
        void Send(Text('不要伤及无辜'));
        return false;
    }
    const target = task.arm[num];
    const qq = target.QQ;
    let lastMessage = '';
    if (qq !== 1) {
        const player_B = await readPlayer(String(qq));
        player_B.当前血量 = player_B.血量上限;
        const fq = typeof player_B.灵根.法球倍率 === 'number' ? player_B.灵根.法球倍率 : parseFloat(String(player_B.灵根.法球倍率)) || 0;
        const buff = 1 + (player.occupation_level || 0) * 0.055;
        const player_A = {
            id: player.id,
            名号: player.名号,
            攻击: Math.floor(player.攻击 * buff),
            防御: Math.floor(player.防御),
            当前血量: Math.floor(player.血量上限 * buff),
            暴击率: player.暴击率,
            学习的功法: player.学习的功法,
            魔道值: player.魔道值 || 0,
            灵根: { ...player.灵根, 法球倍率: fq },
            法球倍率: fq,
            仙宠: player.仙宠,
            神石: player.神石 || 0
        };
        const player_B_entity = {
            id: player_B.id,
            名号: player_B.名号,
            攻击: player_B.攻击,
            防御: player_B.防御,
            当前血量: player_B.当前血量,
            暴击率: player_B.暴击率,
            学习的功法: player_B.学习的功法,
            魔道值: player_B.魔道值 || 0,
            灵根: { ...player_B.灵根, 法球倍率: fq },
            法球倍率: fq,
            仙宠: player_B.仙宠,
            神石: player_B.神石 || 0
        };
        const dataBattle = await zdBattle(player_A, player_B_entity);
        const msg = dataBattle.msg || [];
        const winA = `${player_A.名号}击败了${player_B.名号}`;
        const winB = `${player_B.名号}击败了${player_A.名号}`;
        if (msg.includes(winA)) {
            player_B.魔道值 = (player_B.魔道值 || 0) - 50;
            player_B.灵石 -= 1000000;
            player_B.当前血量 = 0;
            await writePlayer(String(qq), player_B);
            player.灵石 += target.赏金;
            player.魔道值 = (player.魔道值 || 0) - 5;
            await writePlayer(userId, player);
            await addExp4(userId, 2255);
            lastMessage = `【全服公告】${player_B.名号}失去了1000000灵石,罪恶得到了洗刷,魔道值-50,无名侠客获得了部分灵石,自己的正气提升了,同时获得了更多的悬赏加成`;
        }
        else if (msg.includes(winB)) {
            const shangjing = Math.trunc(target.赏金 * 0.8);
            player.当前血量 = 0;
            player.灵石 += shangjing;
            player.魔道值 = (player.魔道值 || 0) - 5;
            await writePlayer(userId, player);
            await addExp4(userId, 1100);
            lastMessage = `${player_B.名号}反杀了你,只获得了部分辛苦钱`;
        }
        if (msg.length > 100) ;
        else {
            void Send(Text(msg.join('\n')));
        }
    }
    else {
        player.灵石 += target.赏金;
        player.魔道值 = (player.魔道值 || 0) - 5;
        await writePlayer(userId, player);
        await addExp4(userId, 2255);
        lastMessage = '你惩戒了仙路窃贼,获得了部分灵石';
    }
    task.arm.splice(num, 1);
    await redis.set(getRedisKey(userId, 'shangjing'), JSON.stringify(task));
    if (lastMessage === '你惩戒了仙路窃贼,获得了部分灵石' || lastMessage.endsWith('反杀了你,只获得了部分辛苦钱')) {
        void Send(Text(lastMessage));
    }
    else if (lastMessage) {
        const auctionKeyManager = getAuctionKeyManager();
        const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
        const groupList = await redis.smembers(groupListKey);
        for (const group of groupList) {
            pushInfo(group, true, lastMessage);
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
