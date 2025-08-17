import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import data from '../../../../model/XiuxianData.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?猎户转.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await readPlayer(usr_qq);
    if (player.occupation != '猎户') {
        Send(Text('你不是猎户,无法自选职业'));
        return false;
    }
    const occupation = e.MessageText.replace(/^(#|＃|\/)?猎户转/, '');
    const x = data.occupation_list.find(item => item.name == occupation);
    if (!notUndAndNull(x)) {
        Send(Text(`没有[${occupation}]这项职业`));
        return false;
    }
    player.occupation = occupation;
    await writePlayer(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
});

export { res as default, regular };
