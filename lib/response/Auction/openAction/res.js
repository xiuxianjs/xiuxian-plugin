import { useSend, Text } from 'alemonjs';
import { redis } from '../../../api/api.js';
import config from '../../../model/Config.js';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/namelist.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/version.yaml.js';
import '../../../config/xiuxian.yaml.js';
import '../../../model/XiuxianData.js';
import { openAU, readPlayer } from '../../../model/xiuxian.js';
import 'dayjs';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?开启星阁体系$/;
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
            logger.info(await redis.smembers(redisGlKey));
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
            const player = await readPlayer(auction.last_offer_player);
            msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
        }
        await Send(Text(msg));
    }
    try {
        await redis.del(redisGlKey);
    }
    catch (err) {
        logger.info(err);
    }
    await redis.sadd(redisGlKey, String(e.ChannelId));
    Send(Text('星阁体系在本群开启！'));
});

export { res as default, regular, selects };
