import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?解散宗门.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return false;
    }
    const didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim();
    if (!didian) {
        void Send(Text('请输入要解散的宗门名称'));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(didian));
    if (!ass) {
        return;
    }
    if (!Array.isArray(ass.所有成员)) {
        void Send(Text('未找到该宗门成员信息'));
        return;
    }
    const members = ass.所有成员;
    void Promise.all(members.map(async (qq) => {
        const player = await readPlayer(qq);
        if (!player) {
            return;
        }
        if (player.宗门) {
            delete player.宗门;
            await writePlayer(qq, player);
        }
    })).finally(() => {
        void redis.del(keys.association(didian));
        void Send(Text('解散成功!'));
    });
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
