import { redis, pushInfo } from '../api/api.js';
import config from '../model/Config.js';
import 'fs';
import 'path';
import '../model/paths.js';
import '../model/XiuxianData.js';
import { openAU, readPlayer, Add_灵石 as Add___, addNajieThing } from '../model/xiuxian.js';
import 'dayjs';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0/1 * * * ?', async () => {
    {
        const set = config.getConfig('xiuxian', 'xiuxian');
        const wupinStr = await redis.get('xiuxian:AuctionofficialTask');
        if (!wupinStr) {
            const nowDate = new Date();
            const todayDate = new Date(nowDate);
            const { openHour, closeHour } = set.Auction;
            const todayTime = todayDate.setHours(0, 0, 0, 0);
            const openTime = todayTime + openHour * 60 * 60 * 1000;
            const nowTime = nowDate.getTime();
            const closeTime = todayTime + closeHour * 60 * 60 * 1000;
            if (nowTime < openTime || nowTime > closeTime)
                return false;
            const auction = await openAU();
            let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
            if (auction.last_offer_player === 0) {
                msg += '暂无人出价';
            }
            else {
                const player = await readPlayer(String(auction.last_offer_player));
                msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
            }
            auction.groupList.forEach(group => {
                pushInfo('', group, true, msg);
            });
            return false;
        }
        const wupin = JSON.parse(wupinStr);
        let msg = '';
        const group_ids = wupin.groupList;
        const last_offer_price = wupin.last_offer_price;
        const interMinu = set.Auction.interval;
        const nowTime = new Date().getTime();
        if (wupin.last_offer_price + interMinu * 60 * 1000 > nowTime) {
            const m = Math.floor((last_offer_price + interMinu * 60 * 1000 - nowTime) / 1000 / 60);
            const s = Math.floor((last_offer_price + interMinu * 60 * 1000 - nowTime - m * 60 * 1000) /
                1000);
            msg = `星阁限定物品【${wupin.thing.name}】拍卖中\n距离拍卖结束还有${m}分${s}秒\n目前最高价${wupin.last_price}`;
            for (const group of group_ids) {
                const [platform, group_id] = group.split(':');
                pushInfo(platform, group_id, true, msg);
            }
        }
        else {
            const last_offer_player = wupin.last_offer_player;
            if (last_offer_player === 0) {
                msg = `流拍，${wupin.thing.name}已退回神秘人的纳戒`;
            }
            else {
                await Add___(last_offer_player, -wupin.last_price);
                await addNajieThing(last_offer_player, wupin.thing.name, wupin.thing.class, wupin.amount, wupin.thing.pinji);
                const player = await readPlayer(last_offer_player);
                msg = `拍卖结束，${player.名号}最终拍得该物品！`;
            }
            for (const group of group_ids) {
                pushInfo('', group, true, msg);
            }
            await redis.del('xiuxian:AuctionofficialTask');
        }
    }
});
