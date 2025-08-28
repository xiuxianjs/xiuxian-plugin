import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import 'dayjs';
import 'lodash-es';
import '../../../../model/settions.js';
import { redis } from '../../../../model/api.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?解散宗门.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster) {
            return false;
        }
        const didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim();
        if (didian === '') {
            void Send(Text('请输入要解散的宗门名称'));
            return false;
        }
        const ass = await getDataJSONParseByKey(keys.association(didian));
        if (!ass) {
            return;
        }
        const members = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
        for (const qq of members) {
            const player = await readPlayer(qq);
            if (!player) {
                continue;
            }
            const guild = player.宗门;
            if (guild
                && typeof guild === 'object'
                && '宗门名称' in guild
                && guild.宗门名称 === didian) {
                const { 宗门: _ignored, ...rest } = player;
                await writePlayer(qq, rest);
            }
        }
        await redis.del(keys.association(didian));
        void Send(Text('解散成功!'));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
