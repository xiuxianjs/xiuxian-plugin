import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../util.js';
import { redis } from '../../../api/api.js';
import config from '../../../model/Config.js';
import 'fs';
import 'path';
import { openAU, Read_player } from '../../../model/xiuxian.js';
import '../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create']);
const regular = /^(#|\/)开启星阁体系$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有只因器人主人可以开启'));
        return false;
    }
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const groupList = await redis.smembers(redisGlKey);
    if (groupList.length > 0) {
        if (await redis.sismember(redisGlKey, String(e.ChannelId))) {
            console.log(await redis.smembers(redisGlKey));
            Send(Text('星阁拍卖行已经开啦'));
            return false;
        }
        await redis.sadd(redisGlKey, String(e.ChannelId));
        Send(Text('星阁已开启，已将本群添加至星阁体系'));
        return false;
    }
    const nowDate = new Date();
    const todayDate = new Date(nowDate);
    const { openHour, closeHour } = config.getConfig('xiuxian', 'xiuxian');
    const todayTime = todayDate.setHours(0, 0, 0, 0);
    const openTime = todayTime + openHour * 60 * 60 * 1000;
    const nowTime = nowDate.getTime();
    const closeTime = todayTime + closeHour * 60 * 60 * 1000;
    if (nowTime > openTime && nowTime < closeTime) {
        const auction = await openAU();
        let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
        if (auction.last_offer_player === 0) {
            msg += '暂无人出价';
        }
        else {
            const player = await Read_player(auction.last_offer_player);
            msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
        }
        await Send(Text(msg));
    }
    try {
        await redis.del(redisGlKey);
    }
    catch (err) {
        console.log(err);
    }
    await redis.sadd(redisGlKey, String(e.ChannelId));
    Send(Text('星阁体系在本群开启！'));
});

export { res as default, name, regular, selects };
