import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import { startAction } from '../../../actionHelper.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import { getDataList } from '../../../../model/DataList.js';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { addCoin } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
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
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?沉迷秘境.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷秘境/, '');
    const code = didian.split('*');
    didian = code[0];
    const i = await convert2integer(code[1]);
    if (i > 12) {
        return false;
    }
    const diDianList = await getDataList('Didian');
    const weizhi = await diDianList.find(item => item.name == didian);
    if (!notUndAndNull(weizhi)) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    const placeUnknown = weizhi;
    if (!placeUnknown
        || typeof placeUnknown !== 'object'
        || !('Price' in placeUnknown)
        || !('name' in placeUnknown)
        || typeof placeUnknown.Price !== 'number') {
        return false;
    }
    const place = placeUnknown;
    if (player.灵石 < place.Price * 10 * i) {
        Send(Text('没有灵石寸步难行,攒到' + place.Price * 10 * i + '灵石才够哦~'));
        return false;
    }
    if (didian == '大千世界' || didian == '桃花岛') {
        Send(Text('该秘境不支持沉迷哦'));
        return false;
    }
    const keyCount = await existNajieThing(usr_qq, '秘境之匙', '道具');
    if (typeof keyCount === 'number' && keyCount >= i) {
        await addNajieThing(usr_qq, '秘境之匙', '道具', -i);
    }
    else {
        Send(Text('你没有足够数量的秘境之匙'));
        return false;
    }
    const Price = place.Price * 10 * i;
    await addCoin(usr_qq, -Price);
    const time = i * 10 * 5 + 10;
    const action_time = 60000 * time;
    const arr = await startAction(usr_qq, '历练', action_time, {
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '0',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        cishu: i * 10,
        Place_address: place,
        group_id: e.name == 'message.create' ? e.ChannelId : undefined
    });
    await redis.set(getRedisKey(usr_qq, 'action'), JSON.stringify(arr));
    Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
