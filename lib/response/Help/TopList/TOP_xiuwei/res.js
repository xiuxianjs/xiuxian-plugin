import { useSend, Text, Image } from 'alemonjs';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import { notUndAndNull } from '../../../../model/common.js';
import { getAllExp, sortBy } from '../../../../model/cultivation.js';
import '../../../../model/api.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import '../../../../model/currency.js';
import { getRankingPowerImage } from '../../../../model/image.js';
import 'crypto';
import 'lodash-es';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?天榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const playerList = await keysByPath(__PATH.player_path);
    let File_length = playerList.length;
    const temp = [];
    for (const this_qq of playerList) {
        const player = await readPlayer(this_qq);
        const sum_exp = await getAllExp(this_qq);
        if (!notUndAndNull(player.level_id)) {
            void Send(Text('请先#同步信息'));
            return false;
        }
        const levelList = await getDataList('Level1');
        const level = levelList.find(item => item.level_id === player.level_id).level;
        temp.push({
            总修为: sum_exp,
            境界: level,
            名号: player.名号,
            qq: this_qq
        });
    }
    temp.sort(sortBy('总修为'));
    const usr_paiming = temp.findIndex(temp => temp.qq === userId) + 1;
    const Data = [];
    if (File_length > 10) {
        File_length = 10;
    }
    for (let i = 0; i < File_length; i++) {
        temp[i].名次 = i + 1;
        Data[i] = temp[i];
    }
    const thisplayer = await readPlayer(userId);
    const img = await getRankingPowerImage(e, Data, usr_paiming, thisplayer);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
