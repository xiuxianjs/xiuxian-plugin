import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/api.js';
import '@alemonjs/db';
import { notUndAndNull } from '../../../../model/common.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?我的贡献$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    if (!notUndAndNull(player.宗门)) {
        void Send(Text('你尚未加入宗门'));
        return false;
    }
    if (!notUndAndNull(player.宗门.lingshi_donate)) {
        player.宗门.lingshi_donate = 0;
    }
    if (player.宗门.lingshi_donate < 0) {
        player.宗门.lingshi_donate = 0;
    }
    const gonxianzhi = Math.trunc(player.宗门.lingshi_donate / 10000);
    void Send(Text('你为宗门的贡献值为[' + gonxianzhi + '],可以在#宗门藏宝阁 使用贡献值兑换宗门物品,感谢您对宗门做出的贡献'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
