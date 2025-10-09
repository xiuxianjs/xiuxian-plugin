import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
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
import 'dayjs';
import 'buffer';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?参悟神石$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const player = await readPlayer(userId);
    if (player.魔道值 > 0 || (player.灵根.type !== '转生' && player.level_id < 42)) {
        void Send(Text('你尝试领悟神石,但是失败了'));
        return false;
    }
    const x = await existNajieThing(userId, '神石', '道具');
    if (!x) {
        void Send(Text('你没有神石'));
        return false;
    }
    if (x < 8) {
        void Send(Text('神石不足8个,当前神石数量' + x + '个'));
        return false;
    }
    await addNajieThing(userId, '神石', '道具', -8);
    const timeDanyaoData = await getDataList('TimeDanyao');
    const wuping_length = timeDanyaoData.length;
    const wuping_index = Math.floor(Math.random() * wuping_length);
    const wuping = timeDanyaoData[wuping_index];
    void Send(Text('获得了' + wuping.name));
    await addNajieThing(userId, wuping.name, wuping.class, 1);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
