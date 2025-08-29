import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getDataList } from '../../../../model/DataList.js';
import { getRedisKey } from '../../../../model/keys.js';
import { startAction } from '../../../../model/actionHelper.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?镇守仙境.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(userId);
    let didian = e.MessageText.replace(/^(#|＃|\/)?镇守仙境/, '');
    didian = didian.trim();
    const fairyRealmList = await getDataList('FairyRealm');
    const weizhiRaw = fairyRealmList?.find(item => item.name === didian);
    if (!notUndAndNull(weizhiRaw)) {
        return false;
    }
    const weizhiUnknown = weizhiRaw;
    const guardWeizhi = (v) => {
        if (!v || typeof v !== 'object') {
            return false;
        }
        const r = v;
        return typeof r.Price === 'number' && typeof r.name === 'string';
    };
    if (!guardWeizhi(weizhiUnknown)) {
        return false;
    }
    const weizhi = weizhiUnknown;
    if (player.灵石 < weizhi.Price) {
        void Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));
        return false;
    }
    const levelList = await getDataList('Level1');
    const now_level_id = levelList?.find(item => item.level_id === player.level_id)?.level_id;
    if (now_level_id < 42 && player.lunhui === 0) {
        return false;
    }
    let dazhe = 1;
    if ((await existNajieThing(userId, '杀神崖通行证', '道具'))
        && player.魔道值 < 1
        && (player.灵根.type === '转生' || player.level_id > 41)
        && didian === '杀神崖') {
        dazhe = 0;
        void Send(Text(player.名号 + '使用了道具杀神崖通行证,本次仙境免费'));
        await addNajieThing(userId, '杀神崖通行证', '道具', -1);
    }
    else if ((await existNajieThing(userId, '仙境优惠券', '道具')) && player.魔道值 < 1 && (player.灵根.type === '转生' || player.level_id > 41)) {
        dazhe = 0.5;
        void Send(Text(player.名号 + '使用了道具仙境优惠券,本次消耗减少50%'));
        await addNajieThing(userId, '仙境优惠券', '道具', -1);
    }
    const Price = weizhi.Price * dazhe;
    await addCoin(userId, -Price);
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.secretplace;
    const action_time = 60000 * time;
    const arr = await startAction(userId, '历练', action_time, {
        shutup: '1',
        working: '1',
        Place_action: '0',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        Place_address: weizhi,
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    });
    await redis.set(getRedisKey(String(userId), 'action'), JSON.stringify(arr));
    void Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
