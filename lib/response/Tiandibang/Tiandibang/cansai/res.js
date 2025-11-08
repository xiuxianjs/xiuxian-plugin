import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
import { readTiandibang, writeTiandibang } from '../../../../model/tian.js';
import 'dayjs';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';
import { createRankEntry } from '../../../../model/Tiandibang.js';

const regular = /^(#|＃|\/)?报名比赛/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const tiandibang = await readTiandibang();
    const index = tiandibang.findIndex(item => item.qq === userId);
    if (index !== -1) {
        void Send(Text('你已经参赛了!'));
        return false;
    }
    const levelList = await getDataList('Level1');
    if (!levelList) {
        return;
    }
    const curLevel = levelList.find(item => item.level_id === player.level_id);
    if (!curLevel) {
        return;
    }
    const playerA = createRankEntry(player, curLevel.level_id, userId);
    tiandibang.push(playerA);
    void writeTiandibang(tiandibang);
    void Send(Text('参赛成功!'));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
