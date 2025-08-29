import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import { setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '../../../../model/api.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
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

const regular = /^(#|＃|\/)?设置性别.*$/;
function normalizeGender(input) {
    const v = input.trim();
    if (v === '男' || v === '女') {
        return v;
    }
    return null;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await readPlayer(userId);
    if (player.sex && player.sex !== '0') {
        void Send(Text('每个存档仅可设置一次性别！'));
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?设置性别/, '');
    const gender = normalizeGender(raw);
    if (!gender) {
        void Send(Text('用法: #设置性别男 或 #设置性别女'));
        return false;
    }
    player.sex = gender === '男' ? '2' : '1';
    void setDataJSONStringifyByKey(keys.player(userId), player);
    void Send(Text(`${player.名号}的性别已成功设置为 ${gender}。`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
