import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
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
import '../../../../model/qinmidu.js';
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

const regular = /^(#|＃|\/)?探索宗门秘境.*$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v;
}
function isGuildSecret(v) {
    return !!v && typeof v === 'object' && 'name' in v && 'Price' in v;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag)
        return false;
    const player = (await readPlayer(usr_qq));
    if (!player || !player.宗门 || !isPlayerGuildRef(player.宗门)) {
        Send(Text('请先加入宗门'));
        return false;
    }
    const assRaw = await data.getAssociation(player.宗门.宗门名称);
    if (assRaw === 'error' || !isExtAss(assRaw)) {
        Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
        Send(Text('你的宗门还没有驻地，不能探索秘境哦'));
        return false;
    }
    const didian = e.MessageText.replace(/^(#|＃|\/)?探索宗门秘境/, '').trim();
    if (!didian) {
        Send(Text('请在指令后面补充秘境名称'));
        return false;
    }
    const listRaw = data.guildSecrets_list;
    const weizhi = listRaw?.find(item => isGuildSecret(item) && item.name === didian);
    if (!notUndAndNull(weizhi) || !isGuildSecret(weizhi)) {
        Send(Text('未找到该宗门秘境'));
        return false;
    }
    const playerCoin = Number(player.灵石 || 0);
    const price = Number(weizhi.Price || 0);
    if (price <= 0) {
        Send(Text('秘境费用配置异常'));
        return false;
    }
    if (playerCoin < price) {
        Send(Text(`没有灵石寸步难行, 攒到${price}灵石才够哦~`));
        return false;
    }
    const guildGain = Math.trunc(price * 0.05);
    ass.灵石池 = Math.max(0, Number(ass.灵石池 || 0)) + guildGain;
    await data.setAssociation(ass.宗门名称, ass);
    await addCoin(usr_qq, -price);
    const cfg = config.getConfig('xiuxian', 'xiuxian');
    const minute = cfg?.CD?.secretplace;
    const time = typeof minute === 'number' && minute > 0 ? minute : 10;
    const action_time = 60000 * time;
    const arr = {
        action: '历练',
        end_time: Date.now() + action_time,
        time: action_time,
        shutup: '1',
        working: '1',
        Place_action: '0',
        Place_actionplus: '1',
        power_up: '1',
        group_id: e.ChannelId,
        Place_address: weizhi,
        XF: ass.power
    };
    await redis.set(`xiuxian@1.3.0:${usr_qq}:action`, JSON.stringify(arr));
    Send(Text(`开始探索 ${didian} 宗门秘境，${time} 分钟后归来! (扣除${price}灵石，上缴宗门${guildGain}灵石)`));
    return false;
});

export { res as default, regular };
