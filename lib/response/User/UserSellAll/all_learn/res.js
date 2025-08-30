import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
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
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { addConsFaByUser } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?一键学习$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const najie = await getDataJSONParseByKey(keys.najie(userId));
    if (!najie || !Array.isArray(najie?.功法)) {
        return;
    }
    if (player.学习的功法.length >= player.level_id) {
        void Send(Text('您当前学习功法数量已达上限，请突破后再来'));
        return;
    }
    const names = [];
    for (const l of najie.功法) {
        const islearned = player.学习的功法.find(item => item === l.name);
        if (!islearned) {
            names.push(l.name);
        }
        if (player.学习的功法.length + names.length >= player.level_id) {
            break;
        }
    }
    if (!names.length) {
        void Send(Text('无新功法'));
        return;
    }
    for (const n of names) {
        await addNajieThing(userId, n, '功法', -1);
    }
    void addConsFaByUser(userId, names);
    void Send(Text(`你学会了${names.join('|')},可以在【#我的炼体】中查看`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
