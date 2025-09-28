import { redis, pushInfo } from '../model/api.js';
import { openAU } from '../model/trade.js';
import '../model/keys.js';
import '@alemonjs/db';
import { getAuctionKeyManager } from '../model/auction.js';
import 'alemonjs';
import 'dayjs';
import { readPlayer } from '../model/xiuxiandata.js';
import { addCoin } from '../model/economy.js';
import '../model/DataList.js';
import '../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import { getConfig } from '../model/Config.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../model/najie.js';
import '../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../model/message.js';

const startTask = async () => {
    const auctionKeyManager = getAuctionKeyManager();
    const set = await getConfig('xiuxian', 'xiuxian');
    const auctionTaskKey = await auctionKeyManager.getAuctionOfficialTaskKey();
    const wupinStr = await redis.get(auctionTaskKey);
    if (!wupinStr) {
        const now = new Date();
        const { openHour, closeHour } = set.Auction;
        const startOfDay = new Date(now).setHours(0, 0, 0, 0);
        const openTime = startOfDay + openHour * 3600_000;
        const closeTime = startOfDay + closeHour * 3600_000;
        const nowTime = now.getTime();
        if (nowTime < openTime || nowTime > closeTime) {
            return false;
        }
        const auction = await openAU();
        let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
        if (auction.last_offer_player === 0) {
            msg += '暂无人出价';
        }
        else {
            const player = await readPlayer(String(auction.last_offer_player));
            if (player) {
                msg += `最高出价是${player.名号}叫出的${auction.lastPrice}`;
            }
        }
        auction.groupList.forEach(g => pushInfo(String(g), true, msg));
        return false;
    }
    const wupin = JSON.parse(wupinStr);
    const nowTime = Date.now();
    const interMinu = set.Auction.interval;
    let msg;
    const endTime = wupin.last_offer_price + interMinu * 60_000;
    if (endTime > nowTime) {
        const remain = endTime - nowTime;
        const m = Math.floor(remain / 1000 / 60);
        const s = Math.floor((remain - m * 60_000) / 1000);
        msg = `星阁限定物品【${wupin.thing.name}】拍卖中\n距离拍卖结束还有${m}分${s}秒\n目前最高价${wupin.lastPrice}`;
        wupin.groupList.forEach(g => pushInfo(String(g), true, msg));
        return false;
    }
    if (wupin.last_offer_player === 0) {
        msg = `流拍，${wupin.thing.name}已退回神秘人的纳戒`;
    }
    else {
        const pid = String(wupin.last_offer_player);
        await addCoin(pid, -wupin.lastPrice);
        const cls = (() => {
            const raw = String(wupin.thing.class);
            const list = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
            return list.includes(raw) ? raw : '道具';
        })();
        const pinji = Number(wupin.thing.pinji);
        await addNajieThing(pid, wupin.thing.name, cls, wupin.amount, isNaN(pinji) ? 0 : pinji);
        const player = await readPlayer(pid);
        if (player) {
            msg = `拍卖结束，${player.名号}最终拍得该物品！`;
        }
    }
    wupin.groupList.forEach(g => pushInfo(String(g), true, msg));
    await redis.del(auctionTaskKey);
};
const AuctionofficialTask = () => {
    void startTask();
};

export { AuctionofficialTask };
