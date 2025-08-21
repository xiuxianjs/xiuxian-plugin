import { useSend, Text } from 'alemonjs';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writeDuanlu } from '../../../../model/duanzaofu.js';
import '../../../../model/XiuxianData.js';
import '../../../../model/repository/playerRepository.js';
import '../../../../model/repository/najieRepository.js';
import '../../../../model/DataList.js';
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
import { stopActionWithSuffix } from '../../../actionHelper.js';
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?全体清空锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    await writeDuanlu([]);
    const playerList = await keysByPath(__PATH.player_path);
    for (const player_id of playerList) {
        await stopActionWithSuffix(player_id, 'action10');
        await setValue(userKey(player_id, 'action10'), null);
    }
    Send(Text('清除完成'));
});

export { res as default, regular };
