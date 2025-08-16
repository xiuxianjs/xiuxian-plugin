import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?设置性别.*$/;
function normalizeGender(input) {
    const v = input.trim();
    if (v === '男' || v === '女')
        return v;
    return null;
}
function serializePlayer(p) {
    const r = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'function')
            continue;
        if (v && typeof v === 'object')
            r[k] = JSON.parse(JSON.stringify(v));
        else
            r[k] = v;
    }
    return r;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const player = (await readPlayer(usr_qq));
    if (player.sex && player.sex !== '0') {
        Send(Text('每个存档仅可设置一次性别！'));
        return false;
    }
    const raw = e.MessageText.replace(/^(#|＃|\/)?设置性别/, '');
    const gender = normalizeGender(raw);
    if (!gender) {
        Send(Text('用法: #设置性别男 或 #设置性别女'));
        return false;
    }
    player.sex = gender === '男' ? '2' : '1';
    await data.setData('player', usr_qq, serializePlayer(player));
    Send(Text(`${player.名号}的性别已成功设置为 ${gender}。`));
    return false;
});

export { res as default, regular };
