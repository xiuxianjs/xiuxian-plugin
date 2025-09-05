import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { notUndAndNull } from '../../../../model/common.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?猎户转.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const player = await readPlayer(userId);
    if (player.occupation !== '猎户') {
        void Send(Text('你不是猎户,无法自选职业'));
        return false;
    }
    const occupation = e.MessageText.replace(/^(#|＃|\/)?猎户转/, '');
    const OccupationData = await getDataList('Occupation');
    if (!Array.isArray(OccupationData)) {
        void Send(Text('职业数据获取错误'));
        return false;
    }
    const x = OccupationData.find(item => item.name === occupation);
    if (!notUndAndNull(x)) {
        void Send(Text(`没有[${occupation}]这项职业`));
        return false;
    }
    player.occupation = occupation;
    await writePlayer(userId, player);
    void Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
