import { useSend, Image, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keysByPath, __PATH, keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import '@alemonjs/db';
import { sleep } from '../../../../model/common.js';
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
import { sortBy } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { getRankingMoneyImage } from '../../../../model/image.js';
import 'crypto';
import 'lodash-es';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?灵榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const playerList = await keysByPath(__PATH.player_path);
    const temp = [];
    for (let i = 0; i < playerList.length; i++) {
        const player = await readPlayer(playerList[i]);
        if (!player) {
            continue;
        }
        temp.push(player);
    }
    let File_length = temp.length;
    temp.sort(sortBy('灵石'));
    const Data = [];
    const usr_paiming = temp.findIndex(temp => temp.qq === userId) + 1;
    if (File_length > 10) {
        File_length = 10;
    }
    for (let i = 0; i < File_length; i++) {
        temp[i].名次 = i + 1;
        Data[i] = temp[i];
    }
    await sleep(500);
    const player = await getDataJSONParseByKey(keys.player(userId));
    const thisnajie = await getDataJSONParseByKey(keys.najie(userId));
    const img = await getRankingMoneyImage(e, Data, usr_paiming, player, thisnajie);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
        return;
    }
    void Send(Text('图片生成错误'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
