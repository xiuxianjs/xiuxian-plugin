import { useSend, useMention, Text } from 'alemonjs';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import 'dayjs';
import 'lodash-es';
import '../../../../model/settions.js';
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
import mw, { selects } from '../../../mw.js';

const regular = /^(#|\/)打落凡间.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster) {
            return false;
        }
        const [mention] = useMention(e);
        const res = await mention.findOne();
        const target = res?.data;
        if (!target || res.code !== 2000) {
            return false;
        }
        const qq = target.UserId;
        const ifexistplay = await existplayer(qq);
        if (!ifexistplay) {
            void Send(Text('没存档你打个锤子！'));
            return false;
        }
        const player = await readPlayer(qq);
        player.power_place = 1;
        void Send(Text('已打落凡间！'));
        await writePlayer(qq, player);
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
