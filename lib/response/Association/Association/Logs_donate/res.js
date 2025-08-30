import { useSend, Text } from 'alemonjs';
import { notUndAndNull } from '../../../../model/common.js';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxiandata.js';
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
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?宗门捐献记录$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    if (!isKeys(player.宗门, ['宗门名称'])) {
        void Send(Text('宗门信息不完整'));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
    if (!ass) {
        void Send(Text('宗门数据异常'));
        return false;
    }
    const members = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    if (members.length === 0) {
        void Send(Text('宗门暂无成员'));
        return false;
    }
    const donate_list = [];
    for (const member_qq of members) {
        const member_data = await getDataJSONParseByKey(keys.player(member_qq));
        if (!member_data) {
            continue;
        }
        if (!notUndAndNull(member_data.宗门) || !isPlayerGuildRef(member_data.宗门)) {
            continue;
        }
        const donate = Number(member_data.宗门.lingshi_donate || 0);
        donate_list.push({
            name: String(member_data.名号 || member_qq),
            lingshi_donate: donate
        });
    }
    if (donate_list.length === 0) {
        void Send(Text('暂无捐献记录'));
        return false;
    }
    donate_list.sort((a, b) => b.lingshi_donate - a.lingshi_donate);
    const msg = [`${ass.宗门名称} 灵石捐献记录表`];
    donate_list.forEach((row, idx) => {
        msg.push(`第${idx + 1}名  ${row.name}  捐赠灵石:${row.lingshi_donate}`);
    });
    void Send(Text(msg.join('\n')));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
