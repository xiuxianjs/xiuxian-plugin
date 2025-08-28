import { useSend, Image, Text } from 'alemonjs';
import { keysByPath, __PATH, keys } from '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { sleep } from '../../../../model/common.js';
import 'lodash-es';
import { sortBy } from '../../../../model/cultivation.js';
import '../../../../model/api.js';
import { getRankingMoneyImage } from '../../../../model/image.js';
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

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
