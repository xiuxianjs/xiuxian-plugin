import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/settions.js';
import { getDataList } from '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../../model/api.js';
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
import { readTiandibang, Write_tiandibang } from '../tian.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?更新属性$/;
const res = onResponse(selects, async (e) => {
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
    const index = tiandibang.findIndex(item => item.qq === usr_qq);
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
    const levelList = await getDataList('Level1');
    const level_id = levelList.find(item => item.level_id == player.level_id).level_id;
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
    const msg = [
        '名次：' +
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
            refreshed.积分
    ];
    Send(Text(msg.join('')));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
