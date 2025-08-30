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
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?查看宗门贡献$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家不存在'));
        return false;
    }
    if (!player.宗门) {
        void Send(Text('玩家未加入宗门'));
        return false;
    }
    if (!['宗主', '副宗主', '长老'].includes(player.宗门.职位)) {
        void Send(Text('您没有权限查看宗门贡献'));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
    if (!ass) {
        void Send(Text('宗门不存在'));
        return false;
    }
    const allMembers = ass.所有成员;
    const list = [];
    for (const member of allMembers) {
        const user = await readPlayer(member);
        if (!user?.宗门) {
            continue;
        }
        const money = user.宗门.lingshi_donate ?? 0;
        list.push({
            name: user.名号,
            contribution: Math.trunc(money / 10000)
        });
    }
    list.sort((a, b) => b.contribution - a.contribution);
    const msg = list.map(item => `${item.name} : ${item.contribution}`).join('\n');
    void Send(Text('名号     宗门贡献\n' + msg));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
