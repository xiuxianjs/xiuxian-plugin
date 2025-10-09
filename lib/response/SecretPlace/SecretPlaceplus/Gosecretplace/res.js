import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import { startAction } from '../../../../model/actionHelper.js';
import { convert2integer } from '../../../../model/utils/number.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
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
import 'dayjs';
import 'buffer';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import { isUserMonthCard } from '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?沉迷秘境.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷秘境/, '');
    const code = didian.split('*');
    didian = code[0];
    const i = convert2integer(code[1]);
    if (i > 12) {
        return false;
    }
    const diDianList = await getDataList('Didian');
    const weizhi = diDianList.find(item => item.name === didian);
    if (!notUndAndNull(weizhi)) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const placeUnknown = weizhi;
    if (!placeUnknown || typeof placeUnknown !== 'object' || !('Price' in placeUnknown) || !('name' in placeUnknown) || typeof placeUnknown.Price !== 'number') {
        return false;
    }
    const place = placeUnknown;
    if (player.灵石 < place.Price * 10 * i) {
        void Send(Text('没有灵石寸步难行,攒到' + place.Price * 10 * i + '灵石才够哦~'));
        return false;
    }
    const isMonth = await isUserMonthCard(userId);
    if (didian === '大千世界' && !isMonth) {
        void Send(Text('该秘境不支持沉迷哦'));
        return false;
    }
    if (didian === '桃花岛') {
        void Send(Text('该秘境不支持沉迷哦'));
        return false;
    }
    const keyCount = await existNajieThing(userId, '秘境之匙', '道具');
    if (typeof keyCount === 'number' && keyCount >= i) {
        await addNajieThing(userId, '秘境之匙', '道具', -i);
    }
    else {
        void Send(Text('你没有足够数量的秘境之匙'));
        return false;
    }
    const Price = place.Price * 10 * i;
    await addCoin(userId, -Price);
    const time = i * 10 * 5 + 10;
    const action_time = 60000 * time;
    const arr = await startAction(userId, '历练', action_time, {
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
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    });
    await redis.set(getRedisKey(userId, 'action'), JSON.stringify(arr));
    void Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
