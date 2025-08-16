import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { startAction } from '../../../actionHelper.js';
import config from '../../../../model/Config.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { addCoin } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?镇守仙境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    let didian = e.MessageText.replace(/^(#|＃|\/)?镇守仙境/, '');
    didian = didian.trim();
    const weizhiRaw = await data.Fairyrealm_list.find(item => item.name == didian);
    if (!notUndAndNull(weizhiRaw)) {
        return false;
    }
    const weizhiUnknown = weizhiRaw;
    const guardWeizhi = (v) => {
        if (!v || typeof v !== 'object')
            return false;
        const r = v;
        return typeof r.Price === 'number' && typeof r.name === 'string';
    };
    if (!guardWeizhi(weizhiUnknown)) {
        return false;
    }
    const weizhi = weizhiUnknown;
    if (player.灵石 < weizhi.Price) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));
        return false;
    }
    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 42 && player.lunhui == 0) {
        return false;
    }
    let dazhe = 1;
    if ((await existNajieThing(usr_qq, '杀神崖通行证', '道具')) &&
        player.魔道值 < 1 &&
        (player.灵根.type == '转生' || player.level_id > 41) &&
        didian == '杀神崖') {
        dazhe = 0;
        Send(Text(player.名号 + '使用了道具杀神崖通行证,本次仙境免费'));
        await addNajieThing(usr_qq, '杀神崖通行证', '道具', -1);
    }
    else if ((await existNajieThing(usr_qq, '仙境优惠券', '道具')) &&
        player.魔道值 < 1 &&
        (player.灵根.type == '转生' || player.level_id > 41)) {
        dazhe = 0.5;
        Send(Text(player.名号 + '使用了道具仙境优惠券,本次消耗减少50%'));
        await addNajieThing(usr_qq, '仙境优惠券', '道具', -1);
    }
    const Price = weizhi.Price * dazhe;
    await addCoin(usr_qq, -Price);
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.secretplace;
    const action_time = 60000 * time;
    const arr = await startAction(usr_qq, '历练', action_time, {
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
        group_id: e.name == 'message.create' ? e.ChannelId : undefined
    });
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
