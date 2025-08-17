import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import { startAction } from '../../../actionHelper.js';
import config from '../../../../model/Config.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import data from '../../../../model/XiuxianData.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import { existHunyin, findQinmidu, addQinmidu } from '../../../../model/qinmidu.js';
import '../../../../model/settions.js';
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

const regular = /^(#|＃|\/)?降临秘境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    let didian = e.MessageText.replace(/^(#|＃|\/)?降临秘境/, '');
    didian = didian.trim();
    const weizhiRaw = await data.didian_list.find(item => item.name == didian);
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
    if (didian == '桃花岛') {
        const exist_B = await existHunyin(usr_qq);
        if (!exist_B) {
            Send(Text(`还请少侠找到道侣之后再来探索吧`));
            return false;
        }
        const qinmidu = await findQinmidu(usr_qq, exist_B);
        if (typeof qinmidu === 'number' && qinmidu < 550) {
            Send(Text('少侠还是先和道侣再联络联络感情吧'));
            return false;
        }
        await addQinmidu(usr_qq, exist_B, -50);
    }
    const Price = weizhi.Price;
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
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    });
    await redis.set(getRedisKey(String(usr_qq), 'action'), JSON.stringify(arr));
    Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
