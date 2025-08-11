import { useSend, Text } from 'alemonjs';
import { redis } from '../../../model/api.js';
import config from '../../../model/Config.js';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/xiuxian.yaml.js';
import '../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../model/equipment.js';
import '../../../model/shop.js';
import { openAU } from '../../../model/trade.js';
import '../../../model/qinmidu.js';
import '../../../model/shitu.js';
import '../../../model/danyao.js';
import '../../../model/temp.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/html/adminset/adminset.css.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/state.jpg.js';
import '../../../resources/img/user_state.png.js';
import '../../../resources/html/association/association.css.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/html/danfang/danfang.css.js';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/html/gongfa/gongfa.css.js';
import '../../../resources/html/equipment/equipment.css.js';
import '../../../resources/img/equipment.jpg.js';
import '../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/html/supermarket/supermarket.css.js';
import '../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help/help.js';
import '../../../resources/html/log/log.css.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../resources/html/najie/najie.css.js';
import '../../../resources/html/player/player.css.js';
import '../../../resources/html/playercopy/player.css.js';
import '../../../resources/html/secret_place/secret_place.css.js';
import '../../../resources/html/shenbing/shenbing.css.js';
import '../../../resources/html/shifu/shifu.css.js';
import '../../../resources/html/shitu/shitu.css.js';
import '../../../resources/html/shituhelp/common.css.js';
import '../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/html/shop/shop.css.js';
import '../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../resources/html/sudoku/sudoku.css.js';
import '../../../resources/html/talent/talent.css.js';
import '../../../resources/html/temp/temp.css.js';
import '../../../resources/html/time_place/time_place.css.js';
import '../../../resources/html/tujian/tujian.css.js';
import '../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../resources/html/valuables/valuables.css.js';
import '../../../resources/img/valuables-top.jpg.js';
import '../../../resources/img/valuables-danyao.jpg.js';
import '../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?开启星阁体系$/;
function isExchangeRecord(v) {
    return !!v && typeof v === 'object' && 'thing' in v && 'start_price' in v;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有主人可以开启'));
        return false;
    }
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const channelId = String(e.ChannelId);
    const already = await redis.sismember(redisGlKey, channelId);
    if (already) {
        Send(Text('星阁拍卖行已经开啦'));
        return false;
    }
    const groupList = await redis.smembers(redisGlKey);
    if (groupList.length > 0) {
        await redis.sadd(redisGlKey, channelId);
        Send(Text('星阁已开启，已将本群添加至星阁体系'));
        return false;
    }
    const cfg = config.getConfig('xiuxian', 'xiuxian');
    const openHour = typeof cfg.openHour === 'number' ? cfg.openHour : 20;
    const closeHour = typeof cfg.closeHour === 'number' ? cfg.closeHour : 22;
    const now = new Date();
    const day0 = new Date(now);
    const midnight = day0.setHours(0, 0, 0, 0);
    const openTime = midnight + openHour * 3600 * 1000;
    const closeTime = midnight + closeHour * 3600 * 1000;
    const nowTs = now.getTime();
    if (nowTs > openTime && nowTs < closeTime) {
        try {
            const auction = await openAU();
            if (!isExchangeRecord(auction))
                throw new Error('拍卖数据结构异常');
            let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
            if (auction.last_offer_player === 0) {
                msg += '暂无人出价';
            }
            else {
                const player = await readPlayer(String(auction.last_offer_player));
                msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
            }
            await Send(Text(msg));
        }
        catch (err) {
            Send(Text('开启拍卖失败: ' + err.message));
            return false;
        }
    }
    else {
        Send(Text('当前不在星阁开启时间，将直接初始化空白场次'));
    }
    try {
        await redis.del(redisGlKey);
    }
    catch (_err) {
    }
    await redis.sadd(redisGlKey, channelId);
    Send(Text('星阁体系在本群开启！'));
    return false;
});

export { res as default, regular, selects };
