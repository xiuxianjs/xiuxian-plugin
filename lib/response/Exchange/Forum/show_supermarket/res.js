import { useSend, Text, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getForumImage } from '../../../../model/image.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?聚宝堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/;
const VALID = ['装备', '丹药', '功法', '道具', '草药', '仙宠', '材料'];
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ext = await existplayer(userId);
    if (!ext) {
        return;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?聚宝堂/, '').trim();
    const cate = VALID.find(v => v === raw);
    if (raw && !cate) {
        void Send(Text('类别无效，可选: ' + VALID.join('/')));
        return;
    }
    const img = await getForumImage(e, cate);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
    else {
        void Send(Text('生成列表失败，请稍后再试'));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
