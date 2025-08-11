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
import { readTiandibang, Write_tiandibang } from '../tian.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?更新属性$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tiandibang = [];
    try {
        tiandibang = await readTiandibang();
    }
    catch {
        await Write_tiandibang([]);
    }
    const index = tiandibang.findIndex(item => item.qq === Number(usr_qq));
    if (index === -1) {
        Send(Text('请先报名!'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (typeof tiandibang[index].魔道值 !== 'number')
        tiandibang[index].魔道值 = player.魔道值 || 0;
    if (typeof tiandibang[index].神石 !== 'number')
        tiandibang[index].神石 = player.神石 || 0;
    if (typeof tiandibang[index].次数 !== 'number')
        tiandibang[index].次数 = 0;
    const level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    const row = tiandibang[index];
    row.名号 = player.名号;
    row.境界 = level_id;
    row.攻击 = player.攻击;
    row.防御 = player.防御;
    row.当前血量 = player.血量上限;
    row.暴击率 = player.暴击率;
    row.学习的功法 = player.学习的功法;
    row.灵根 = player.灵根;
    row.法球倍率 = player.灵根.法球倍率;
    await Write_tiandibang(tiandibang);
    tiandibang = await readTiandibang();
    const refreshed = tiandibang[index];
    refreshed.暴击率 = Math.trunc(refreshed.暴击率 * 100);
    const msg = [];
    msg.push('名次：' +
        (index + 1) +
        '\n名号：' +
        refreshed.名号 +
        '\n攻击：' +
        refreshed.攻击 +
        '\n防御：' +
        refreshed.防御 +
        '\n血量：' +
        refreshed.当前血量 +
        '\n暴击：' +
        refreshed.暴击率 +
        '%\n积分：' +
        refreshed.积分);
    Send(Text(msg.join('')));
});

export { res as default, regular };
