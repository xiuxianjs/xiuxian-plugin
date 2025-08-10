import { useSend, Image } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer, sortBy, sleep } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { getRankingMoneyImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?灵榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let usr_paiming;
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
    let Data = [];
    usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1;
    if (File_length > 10) {
        File_length = 10;
    }
    for (let i = 0; i < File_length; i++) {
        temp[i].名次 = i + 1;
        Data[i] = temp[i];
    }
    await sleep(500);
    let thisplayer = await await data.getData('player', usr_qq);
    let thisnajie = await await data.getData('najie', usr_qq);
    let img = await getRankingMoneyImage(e, Data, usr_paiming, thisplayer, thisnajie);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
