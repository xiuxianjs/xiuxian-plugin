import { useSend, Image } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { sleep } from '../../../../model/common.js';
import data from '../../../../model/XiuxianData.js';
import 'lodash-es';
import { sortBy } from '../../../../model/cultivation.js';
import { getRankingMoneyImage } from '../../../../model/image.js';
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?灵榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    const temp = [];
    for (let i = 0; i < playerList.length; i++) {
        const player = await readPlayer(playerList[i]);
        if (!player)
            continue;
        temp.push(player);
    }
    let File_length = temp.length;
    temp.sort(sortBy('灵石'));
    const Data = [];
    const usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1;
    if (File_length > 10) {
        File_length = 10;
    }
    for (let i = 0; i < File_length; i++) {
        temp[i].名次 = i + 1;
        Data[i] = temp[i];
    }
    await sleep(500);
    const thisplayer = await await data.getData('player', usr_qq);
    const thisnajie = await await data.getData('najie', usr_qq);
    const img = await getRankingMoneyImage(e, Data, usr_paiming, thisplayer, thisnajie);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
