import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { startAction } from '../../../actionHelper.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import { existHunyin, findQinmidu, addQinmidu } from '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
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
    const cf = config.getConfig('xiuxian', 'xiuxian');
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
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
