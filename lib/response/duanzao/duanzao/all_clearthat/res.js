import { useSend, Text } from 'alemonjs';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writeDuanlu } from '../../../../model/duanzaofu.js';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/DataList.js';
import 'dayjs';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
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
import { setValue, userKey } from '../../../../model/utils/redisHelper.js';
import '../../../../route/core/auth.js';
import { stopActionWithSuffix } from '../../../../model/actionHelper.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?全体清空锻炉/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return false;
    }
    await writeDuanlu([]);
    const playerList = await keysByPath(__PATH.player_path);
    for (const playerId of playerList) {
        await stopActionWithSuffix(playerId, 'action10');
        await setValue(userKey(playerId, 'action10'), null);
    }
    void Send(Text('清除完成'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
