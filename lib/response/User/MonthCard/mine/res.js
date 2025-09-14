import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { getAvatar } from '../../../../model/utils/utilsx.js';
import { useMessage, Image, Text } from 'alemonjs';
import 'dayjs';
import '../../../../model/DataList.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import { checkUserMonthCardStatus, isUserMonthCardByMothData } from '../../../../model/currency.js';
import { getMonthCard } from '../../../../model/image.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?我的权益$/;
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const data = await checkUserMonthCardStatus(e.UserId);
    const isMonth = isUserMonthCardByMothData(data);
    const img = await getMonthCard(e.UserId, { isMonth, avatar: getAvatar(e.UserId), data });
    if (!img) {
        return;
    }
    if (Buffer.isBuffer(img)) {
        void message.send(format(Image(img)));
        return false;
    }
    void message.send(format(Text('图片加载失败')));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
