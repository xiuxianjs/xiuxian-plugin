import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?献祭魔石$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据读取失败'));
        return false;
    }
    const needMagic = 1000;
    const playerMagic = Number(player.魔道值) || 0;
    if (playerMagic < needMagic) {
        Send(Text('你不是魔头'));
        return false;
    }
    const COST = 8;
    const hasCount = await existNajieThing(usr_qq, '魔石', '道具');
    const owned = Number(hasCount) || 0;
    if (owned <= 0) {
        Send(Text('你没有魔石'));
        return false;
    }
    if (owned < COST) {
        Send(Text(`魔石不足${COST}个,当前魔石数量${owned}个`));
        return false;
    }
    const pool = data?.xingge?.[0]?.one;
    if (!Array.isArray(pool) || pool.length === 0) {
        Send(Text('奖励配置缺失'));
        return false;
    }
    await addNajieThing(usr_qq, '魔石', '道具', -COST);
    const idx = Math.floor(Math.random() * pool.length);
    const prize = pool[idx];
    if (!prize || typeof prize !== 'object' || !prize.name) {
        Send(Text('奖励生成失败'));
        return false;
    }
    const name = prize.name;
    const cls = (prize.class || '道具');
    Send(Text('获得了' + name));
    await addNajieThing(usr_qq, name, cls, 1);
    return false;
});

export { res as default, regular };
