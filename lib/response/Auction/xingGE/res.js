import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../util.js';
import { redis } from '../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../config/help/Association.yaml.js';
import '../../../config/help/help.yaml.js';
import '../../../config/help/helpcopy.yaml.js';
import '../../../config/help/set.yaml.js';
import '../../../config/help/shituhelp.yaml.js';
import '../../../config/parameter/namelist.yaml.js';
import '../../../config/task/task.yaml.js';
import '../../../config/version/version.yaml.js';
import '../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../model/paths.js';
import '../../../model/XiuxianData.js';
import { existplayer, isNotNull, Read_player } from '../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)星阁拍卖行$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let res = await redis.get('xiuxian:AuctionofficialTask');
    if (!isNotNull(res)) {
        Send(Text('目前没有拍卖正在进行'));
        return false;
    }
    const auction = JSON.parse(res);
    let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
    if (auction.last_offer_player === 0) {
        msg += '暂无人出价';
    }
    else {
        const player = await Read_player(auction.last_offer_player);
        msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
    }
    await Send(Text(msg));
});

export { res as default, name, regular, selects };
